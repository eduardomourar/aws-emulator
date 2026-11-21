// SPDX-License-Identifier: CC0-1.0

//! Secrets Manager-only in-process emulator, built for wasm32-wasip2.
//!
//! Registers Secrets Manager plus the services it calls in-process for authorization
//! and envelope crypto (STS, IAM, KMS) on one shared engine, the same pattern
//! `aws-emulator-router::build_router` uses for the full multi-service emulator.
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
        service_com_amazonaws_secretsmanager_secretsmanager::EmulatedService::new(engine.clone()),
    );
    router.register_service(service_com_amazonaws_sts_awssecuritytokenservicev20110615::EmulatedService::new(
        engine.clone(),
    ));
    router.register_service(service_com_amazonaws_iam_awsidentitymanagementv20100508::EmulatedService::new(
        engine.clone(),
    ));
    router.register_service(service_com_amazonaws_kms_trentservice::EmulatedService::new(engine.clone()));
    router
}

#[cfg(target_family = "wasm")]
mod wasi_http;
