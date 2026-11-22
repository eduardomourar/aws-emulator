// SPDX-License-Identifier: CC0-1.0

//! Shared `wasm32-wasip2` component plumbing for every `embedded-*` crate, and
//! a small standalone component of its own.
//!
//! A pure library (`rlib` only — see `Cargo.toml`), depended on by every
//! `embedded-*` crate so none of them hand-rolls its own `wit-bindgen`/`wstd`
//! glue: [`serving::handle_with`] and [`serving::runtime`] for the
//! `wasi:http/incoming-handler` (server) side, [`outgoing::call_component`]
//! for the `wasi:http/outgoing-handler` (client) side — calling another
//! component the same way this component would reach a real network peer.
//!
//! This crate's own standalone "console" component — a thin internal relay
//! standing in for a cross-cutting service, forwarding Secrets Manager's
//! authorization-fallback calls to IAM's own internal-only endpoint — lives in
//! the separate `embedded-console-service` crate, which depends on this one.
//! It can't live here too: a `cdylib` built from this crate would carry its own
//! `wasi:http/incoming-handler` export, colliding at link time with every
//! dependent's own export of the same symbol.

#[cfg(target_family = "wasm")]
mod outgoing;
#[cfg(target_family = "wasm")]
pub use outgoing::call_component;

#[cfg(target_family = "wasm")]
mod serving;
#[cfg(target_family = "wasm")]
pub use serving::{handle_with, runtime};

/// Defines `build_router` and, for `wasm32-wasip2`, the `wasi:http/proxy`
/// component export, for an `embedded-*` crate that registers a single
/// service with no `wasi:http/outgoing-handler` fallback and no extra
/// internal-only routes.
///
/// `embedded-iam`, `embedded-secretsmanager` and `embedded-console-service`
/// each need one of those extras, so they keep their own hand-written
/// `build_router`/`wasi_http` instead of using this macro.
#[macro_export]
macro_rules! embedded_service {
    ($service:path) => {
        pub use engine::InMemoryEngine;

        pub fn build_router(engine: std::sync::Arc<InMemoryEngine>) -> smithy_server_runtime::MultiServiceRouter {
            use $service as EmbeddedServiceImpl;

            let mut router = smithy_server_runtime::MultiServiceRouter::new();
            router.register_service(EmbeddedServiceImpl::new(engine));
            router
        }

        #[cfg(target_family = "wasm")]
        mod wasi_http {
            use std::sync::OnceLock;

            use $crate::{handle_with, runtime};
            use wstd::http::body::Body;
            use wstd::http::{Error, Request, Response};

            fn router() -> &'static smithy_server_runtime::MultiServiceRouter {
                static ROUTER: OnceLock<smithy_server_runtime::MultiServiceRouter> = OnceLock::new();
                ROUTER.get_or_init(|| super::build_router(std::sync::Arc::new(super::InMemoryEngine::new())))
            }

            #[wstd::http_server]
            async fn main(request: Request<Body>) -> Result<Response<Body>, Error> {
                handle_with(request, |req| async move { runtime().block_on(router().dispatch(req)) }).await
            }
        }
    };
}
