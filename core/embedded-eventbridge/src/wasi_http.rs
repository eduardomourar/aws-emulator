// SPDX-License-Identifier: CC0-1.0

//! `wasi:http/proxy` component export: bridges the WASI HTTP guest ABI to
//! [`crate::build_router`]'s [`smithy_server_runtime::MultiServiceRouter`], which mounts
//! both EventBridge V1 and V2 -- see this crate's own `lib.rs`. No outgoing-handler
//! fallback: both registered services answer entirely from their own in-process state.

use std::sync::OnceLock;

use embedded_console::{handle_with, runtime};

fn router() -> &'static smithy_server_runtime::MultiServiceRouter {
    static ROUTER: OnceLock<smithy_server_runtime::MultiServiceRouter> = OnceLock::new();
    ROUTER.get_or_init(|| crate::build_router(std::sync::Arc::new(crate::InMemoryEngine::new())))
}

#[wstd::http_server]
async fn main(
    request: wstd::http::Request<wstd::http::body::Body>,
) -> Result<wstd::http::Response<wstd::http::body::Body>, wstd::http::Error> {
    handle_with(request, |req| async move { runtime().block_on(router().dispatch(req)) }).await
}
