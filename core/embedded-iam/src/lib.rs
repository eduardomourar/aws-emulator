// SPDX-License-Identifier: CC0-1.0

//! IAM-only in-process emulator, built for wasm32-wasip2.
//!
//! The counterpart to `aws-emulator-embedded-secretsmanager`'s split: splitting IAM
//! out lets a browser host cache it separately from the rest of the emulator.

use std::sync::Arc;

pub use engine::InMemoryEngine;
use smithy_server_runtime::MultiServiceRouter;

pub fn build_router(engine: Arc<InMemoryEngine>) -> MultiServiceRouter {
    let mut router = MultiServiceRouter::new();
    router.register_service(
        service_com_amazonaws_iam_awsidentitymanagementv20100508::EmulatedService::new(engine),
    );
    router
}

#[cfg(target_family = "wasm")]
mod wasi_http;
