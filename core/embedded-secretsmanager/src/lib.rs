// SPDX-License-Identifier: CC0-1.0

//! Secrets Manager-only in-process emulator, built for wasm32-wasip2.
//!
//! Registers ONLY Secrets Manager — each service it calls in-process (KMS, for
//! envelope crypto; STS and IAM, for authorization) is split into its own
//! sibling `embedded-*` component. A request this router has no local service
//! for falls back, over `wasi:http/outgoing-handler`, to whichever component a
//! host wires up to answer it — wired up in `wasi_http`.
//!
//! For `wasm32-wasip2`, this crate also exports `wasi:http/incoming-handler` (the
//! `wasi:http/proxy` world), so a wasm host can deliver HTTP requests straight into
//! the router.

use std::sync::Arc;

pub use engine::InMemoryEngine;
use smithy_server_runtime::MultiServiceRouter;

pub fn build_router(engine: Arc<InMemoryEngine>) -> MultiServiceRouter {
    let mut router = MultiServiceRouter::new();
    router.register_service(
        service_com_amazonaws_secretsmanager_secretsmanager::EmulatedService::new(engine),
    );
    router
}

#[cfg(target_family = "wasm")]
mod wasi_http;
