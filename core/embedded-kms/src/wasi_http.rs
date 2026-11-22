// SPDX-License-Identifier: CC0-1.0

//! `wasi:http/proxy` component export: bridges the WASI HTTP guest ABI to
//! [`crate::build_router`]'s [`smithy_server_runtime::MultiServiceRouter`].
//!
//! The actual server-side plumbing (collecting the incoming body, driving
//! `dispatch` on a current-thread tokio runtime, converting the response back)
//! lives once in `aws-emulator-embedded-console`'s [`embedded_console::serving`]
//! module — this file is just this crate's own router plus the one line that
//! calls it.

use std::sync::OnceLock;

use embedded_console::{handle_with, runtime};
use wstd::http::body::Body;
use wstd::http::{Error, Request, Response};

fn router() -> &'static smithy_server_runtime::MultiServiceRouter {
    static ROUTER: OnceLock<smithy_server_runtime::MultiServiceRouter> = OnceLock::new();
    ROUTER.get_or_init(|| crate::build_router(std::sync::Arc::new(crate::InMemoryEngine::new())))
}

#[wstd::http_server]
async fn main(request: Request<Body>) -> Result<Response<Body>, Error> {
    handle_with(request, |req| async move { runtime().block_on(router().dispatch(req)) }).await
}
