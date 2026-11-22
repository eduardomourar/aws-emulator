// SPDX-License-Identifier: CC0-1.0

//! `wasi:http/proxy` component export: bridges the WASI HTTP guest ABI to
//! [`crate::build_router`]'s [`smithy_server_runtime::MultiServiceRouter`].
//!
//! The server-side plumbing (collecting the incoming body, driving `dispatch`
//! on a current-thread tokio runtime, converting the response back) lives once
//! in `aws-emulator-embedded-console`'s [`embedded_console::serving`] module.
//!
//! One extra thing lives here beyond that shared pattern: a single
//! INTERNAL-ONLY route, [`INTERNAL_RESOLVE_ACCESS_KEY_PATH`], answering a
//! question no real AWS API exposes — "what identity, policy documents and
//! permissions boundary does this access key resolve to?" — which Secrets
//! Manager's authorization gate asks (via `embedded-console`'s relay) now that
//! it no longer holds IAM's state locally. This is emulator-internal plumbing,
//! not a modeled IAM operation: it bypasses `MultiServiceRouter::dispatch`
//! entirely and reads `iam_store`'s own accessors directly, the exact same
//! calls Secrets Manager's `authorization.rs` makes when IAM IS local — see
//! that module for the native/local half of this split.

use std::sync::{Arc, OnceLock};

use embedded_console::{handle_with, runtime};
use service_com_amazonaws_iam_awsidentitymanagementv20100508::state as iam_store;
use wstd::http::body::Body;
use wstd::http::{Error, Request, Response};

/// Not a real IAM API path — nothing in the Smithy model claims it. Checked
/// before anything is handed to `MultiServiceRouter::dispatch`.
const INTERNAL_RESOLVE_ACCESS_KEY_PATH: &str = "/__internal/iam/resolve-access-key";

fn engine() -> &'static Arc<crate::InMemoryEngine> {
    static ENGINE: OnceLock<Arc<crate::InMemoryEngine>> = OnceLock::new();
    ENGINE.get_or_init(|| Arc::new(crate::InMemoryEngine::new()))
}

fn router() -> &'static smithy_server_runtime::MultiServiceRouter {
    static ROUTER: OnceLock<smithy_server_runtime::MultiServiceRouter> = OnceLock::new();
    ROUTER.get_or_init(|| crate::build_router(engine().clone()))
}

#[wstd::http_server]
async fn main(request: Request<Body>) -> Result<Response<Body>, Error> {
    handle_with(request, |req| async move {
        if req.uri().path() == INTERNAL_RESOLVE_ACCESS_KEY_PATH {
            resolve_access_key(req)
        } else {
            runtime().block_on(router().dispatch(req))
        }
    })
    .await
}

/// A principal this emulator resolved an access key to, with the policy
/// documents and permissions boundary in force on it — exactly what
/// `iam_store`'s own accessors answer, serialized for a caller outside this
/// process.
#[derive(serde::Serialize)]
struct ResolvedPrincipal {
    found: bool,
    arn: Option<String>,
    documents: Vec<String>,
    boundary: Option<String>,
}

fn resolve_access_key(request: http::Request<bytes::Bytes>) -> http::Response<bytes::Bytes> {
    let not_found = ResolvedPrincipal { found: false, arn: None, documents: Vec::new(), boundary: None };

    let Ok(body) = serde_json::from_slice::<serde_json::Value>(request.body()) else {
        return json_response(200, &not_found);
    };
    let Some(access_key_id) = body.get("access_key_id").and_then(|v| v.as_str()) else {
        return json_response(200, &not_found);
    };

    let Some(state) = iam_store::service_state(&**engine()) else {
        return json_response(200, &not_found);
    };
    let store = state.lock();

    let Some(user) = store
        .access_keys
        .get(access_key_id)
        .and_then(|record| store.users.get(&record.user_key))
    else {
        return json_response(200, &not_found);
    };

    let documents = store
        .principal_policies(&user.arn)
        .map(|policies| policies.documents)
        .unwrap_or_default();
    let boundary = store.permissions_boundary_document(&user.arn);

    json_response(
        200,
        &ResolvedPrincipal { found: true, arn: Some(user.arn.clone()), documents, boundary },
    )
}

fn json_response(status: u16, body: &ResolvedPrincipal) -> http::Response<bytes::Bytes> {
    let bytes = bytes::Bytes::from(serde_json::to_vec(body).expect("ResolvedPrincipal serializes"));
    http::Response::builder()
        .status(status)
        .header("content-type", "application/json")
        .body(bytes)
        .expect("a well-formed response")
}
