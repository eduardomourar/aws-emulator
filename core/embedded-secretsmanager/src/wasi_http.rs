// SPDX-License-Identifier: CC0-1.0

//! `wasi:http/proxy` component export: bridges the WASI HTTP guest ABI to
//! [`crate::build_router`]'s [`smithy_server_runtime::MultiServiceRouter`].
//!
//! A request this router has no local service for (KMS, called by Secrets
//! Manager's envelope crypto) falls back to `wasi:http/outgoing-handler` — a
//! real outbound HTTP call, the same boundary this component would cross to
//! reach any other network peer — via [`KmsCallback`].
//!
//! This crate's authorization fallback (`authorization.rs`'s `caller()`, in
//! the Secrets Manager service crate) ALSO calls out, to IAM, but DIRECTLY —
//! via `embedded_console::call_component`, bypassing this router's own
//! dispatch/`ExternalDispatch` fallback entirely, since it isn't answering a
//! request the local router tried to route; it's the service crate reaching
//! out on its own, mid-operation. Both call sites share the one
//! `call_component` helper from `aws-emulator-embedded-console`.

use std::sync::OnceLock;

use embedded_console::{call_component, handle_with, runtime};

/// `KMS_AUTHORITY` names no real host: nothing resolves it over a network. It is
/// here only so the outgoing request is well-formed; the host (a browser's JS glue,
/// in this demo) decides which component actually answers an outgoing call, the same
/// way a real reverse proxy decides where a request with this authority routes.
const KMS_AUTHORITY: &str = "kms.local.invalid";

fn router() -> &'static smithy_server_runtime::MultiServiceRouter {
    static ROUTER: OnceLock<smithy_server_runtime::MultiServiceRouter> = OnceLock::new();
    ROUTER.get_or_init(|| {
        let mut router = crate::build_router(std::sync::Arc::new(crate::InMemoryEngine::new()));
        router.set_external_dispatch(std::sync::Arc::new(KmsCallback));
        router
    })
}

#[wstd::http_server]
async fn main(
    request: wstd::http::Request<wstd::http::body::Body>,
) -> Result<wstd::http::Response<wstd::http::body::Body>, wstd::http::Error> {
    handle_with(request, |req| runtime().block_on(router().dispatch(req))).await
}

/// Falls back, for any request this component's own router has no service
/// registered for (in practice: KMS, called by Secrets Manager's envelope
/// crypto), to [`embedded_console::call_component`] — the same boundary this
/// component would cross to reach a real network peer.
struct KmsCallback;

impl smithy_server_runtime::ExternalDispatch for KmsCallback {
    fn dispatch(
        &self,
        request: http::Request<bytes::Bytes>,
    ) -> std::pin::Pin<Box<dyn std::future::Future<Output = http::Response<bytes::Bytes>> + Send + '_>> {
        Box::pin(async move { call_component(KMS_AUTHORITY, request) })
    }
}
