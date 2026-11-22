// SPDX-License-Identifier: CC0-1.0

//! `wasi:http/incoming-handler` server-side plumbing shared by every
//! `embedded-*` component: collect the incoming WASI body into `bytes::Bytes`,
//! run the caller-supplied handler, and convert the result back into a
//! `wstd`-shaped response. Built on [`wstd`]'s own WASI 0.2 bindings, not
//! hand-rolled `wit-bindgen` glue — see `core/embedded-console/src/outgoing.rs`
//! for why the OUTGOING side can't use `wstd` the same way.

use std::sync::OnceLock;

use wstd::http::body::Body;
use wstd::http::{BodyExt, Error, Request, Response};

/// The tokio runtime a component drives its
/// `smithy_server_runtime::MultiServiceRouter::dispatch` call on — needed
/// because `dispatch` depends on tokio internals (timers, sync primitives) that
/// `wstd`'s own executor doesn't supply. One per wasm instance, not shared
/// across components.
pub fn runtime() -> &'static tokio::runtime::Runtime {
    static RUNTIME: OnceLock<tokio::runtime::Runtime> = OnceLock::new();
    RUNTIME.get_or_init(|| {
        tokio::runtime::Builder::new_current_thread()
            .enable_time()
            .build()
            .expect("current-thread tokio runtime")
    })
}

/// Collects `request`'s body into `bytes::Bytes`, awaits `handler` with the
/// resulting plain `http::Request`, and converts its `http::Response` back into
/// the `wstd`-shaped response a `#[wstd::http_server]`-attributed `main`
/// returns. `handler` is async because every caller now either drives a
/// `wstd`/WASI-0.3-native outgoing call (genuinely `async fn` at the WIT
/// level — there is no synchronous variant) or dispatches through a nested
/// tokio runtime that itself may make one.
pub async fn handle_with<F>(
    request: Request<Body>,
    handler: impl FnOnce(http::Request<bytes::Bytes>) -> F,
) -> Result<Response<Body>, Error>
where
    F: std::future::Future<Output = http::Response<bytes::Bytes>>,
{
    let (parts, body) = request.into_parts();
    let body_bytes = body.into_boxed_body().collect().await?.to_bytes();
    let request = http::Request::from_parts(parts, body_bytes);

    let response = handler(request).await;

    let (parts, body) = response.into_parts();
    Ok(http::Response::from_parts(parts, Body::from(body)))
}
