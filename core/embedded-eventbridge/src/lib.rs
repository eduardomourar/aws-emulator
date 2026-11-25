// SPDX-License-Identifier: CC0-1.0

//! EventBridge in-process emulator, built for wasm32-wasip3.
//!
//! Hand-written (not `embedded_console::embedded_service!`-generated) because it mounts
//! TWO services on one shared engine: EventBridge V1
//! (`service-com-amazonaws-eventbridge-awsevents`) and EventBridge V2
//! (`service-com-amazonaws-eventbridgev2-awseventsv2`). Both sign as the same SigV4 name
//! (`events`) and are disambiguated by URI path inside each service's own `can_handle`
//! (`awsJson1_1`'s `POST /` for V1, `rpcv2Cbor`'s `POST /service/AWSEventsV2/operation/...`
//! for V2) -- see `embedded_components.rs`'s comment on why `eventbridge` is not in
//! `SIMPLE_EMBEDDED_COMPONENTS`. `MultiServiceRouter` already resolves that ambiguity by
//! trying every registered service's `can_handle`, so mounting both here needs no code of
//! its own beyond two `register_service` calls.

use std::sync::Arc;

pub use engine::InMemoryEngine;
use smithy_server_runtime::MultiServiceRouter;

pub fn build_router(engine: Arc<InMemoryEngine>) -> MultiServiceRouter {
    let mut router = MultiServiceRouter::new();
    router.register_service(service_com_amazonaws_eventbridge_awsevents::EmulatedService::new(
        engine.clone(),
    ));
    router.register_service(service_com_amazonaws_eventbridgev2_awseventsv2::EmulatedService::new(engine));
    router
}

#[cfg(target_family = "wasm")]
mod wasi_http;
