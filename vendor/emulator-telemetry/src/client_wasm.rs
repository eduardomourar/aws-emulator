// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//! wasm32 stand-in for `client.rs`.
//!
//! WASM-EMBEDDED EXPERIMENT (not the normal build): the real client's worker thread, its
//! SQLite-backed outbox and its `reqwest::blocking` sender have no wasm32-wasip2 equivalent.
//! Every generated operation's dispatch sequence (`smithy-server-runtime::operation::run_operation_http`)
//! names this module's types unconditionally, so they stay real types with the same public
//! signatures; recording itself is simply always off (`recording_active()` is always `false`),
//! which is the correct behavior for a browser-embedded emulator with no telemetry transport
//! to send to.

use crate::config::Endpoint;
use crate::metadata::SanitizedRequestMetadata;
use crate::types::{
    ErrorType, Namespace, OperationName, Outcome, ProductVersion, ProjectId, RunMode,
    TelemetryFeatureFlags,
};
use std::path::PathBuf;
use std::sync::OnceLock;
use std::time::Duration;

/// Options for [`TelemetryClient::start`]. Same public fields as the native
/// `TelemetryOptions`, since `core/embedded` sets `embedding_opt_out` and `run_mode` directly.
#[derive(Debug, Clone)]
pub struct TelemetryOptions {
    pub project_id: ProjectId,
    pub product_version: ProductVersion,
    pub feature_flags: TelemetryFeatureFlags,
    pub embedding_opt_out: bool,
    pub state_dir: Option<PathBuf>,
    pub run_mode: RunMode,
    pub config_endpoint: Option<Endpoint>,
    pub ingest_endpoint: Option<Endpoint>,
    pub flush_interval_override: Option<Duration>,
}

impl TelemetryOptions {
    pub fn new(
        project_id: ProjectId,
        product_version: ProductVersion,
        config_endpoint: Endpoint,
    ) -> Self {
        Self {
            project_id,
            product_version,
            feature_flags: TelemetryFeatureFlags::default(),
            embedding_opt_out: false,
            state_dir: None,
            run_mode: RunMode::Standalone,
            config_endpoint: Some(config_endpoint),
            ingest_endpoint: None,
            flush_interval_override: None,
        }
    }

    pub fn without_endpoint(project_id: ProjectId, product_version: ProductVersion) -> Self {
        Self {
            project_id,
            product_version,
            feature_flags: TelemetryFeatureFlags::default(),
            embedding_opt_out: false,
            state_dir: None,
            run_mode: RunMode::Standalone,
            config_endpoint: None,
            ingest_endpoint: None,
            flush_interval_override: None,
        }
    }
}

/// Inert: a wasm32 build never sends or persists anything, so there is nothing to hold.
#[derive(Clone)]
pub struct TelemetryClient;

impl TelemetryClient {
    pub fn start(_options: TelemetryOptions) -> Self {
        Self
    }

    pub fn recording_active(&self) -> bool {
        false
    }

    pub fn mark_ready(&self) {}

    pub fn mark_startup_failed(&self) {}

    pub fn opt_out(&self) {}

    pub fn begin_request(&self) -> TelemetryRequestGuard {
        TelemetryRequestGuard
    }
}

impl std::fmt::Debug for TelemetryClient {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        f.debug_struct("TelemetryClient").finish_non_exhaustive()
    }
}

/// RAII guard used by a generated router to track concurrent requests; a no-op here since
/// there is no concurrency counter to decrement.
pub struct TelemetryRequestGuard;

static GLOBAL_CLIENT: OnceLock<TelemetryClient> = OnceLock::new();

pub fn init_global(client: TelemetryClient) -> &'static TelemetryClient {
    GLOBAL_CLIENT.get_or_init(|| client)
}

pub fn global() -> Option<&'static TelemetryClient> {
    GLOBAL_CLIENT.get()
}

/// Always `false`: a wasm32 embed has no transport to record for.
pub fn recording_active() -> bool {
    false
}

pub fn flush_at_process_exit() {}

/// A model-derived operation identity; see the native `client.rs` for the full contract.
pub trait ModelOperation {
    const NAMESPACE: &'static str;
    const OPERATION: &'static str;
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct OperationHandle {
    namespace: Namespace,
    operation: OperationName,
}

impl OperationHandle {
    pub fn of<T: ModelOperation>() -> Self {
        Self {
            namespace: Namespace::fold(T::NAMESPACE),
            operation: OperationName::fold(T::OPERATION),
        }
    }

    pub fn folded(namespace: &str, operation: &str) -> Self {
        Self {
            namespace: Namespace::fold(namespace),
            operation: OperationName::fold(operation),
        }
    }

    pub fn namespace(&self) -> &Namespace {
        &self.namespace
    }

    pub fn operation(&self) -> &OperationName {
        &self.operation
    }
}

/// Classification is pure (protocol facts in, closed vocabulary out), so it stays identical
/// to the native implementation even though nothing here ever records the result.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct OperationFailure {
    outcome: Outcome,
    error_type: Option<ErrorType>,
}

impl OperationFailure {
    pub fn classify(http_status: u16, error_shape_name: &str) -> Self {
        if http_status == crate::policy::NOT_EMULATED_HTTP_STATUS
            && error_shape_name == crate::policy::NOT_EMULATED_SHAPE_NAME
        {
            return Self {
                outcome: Outcome::NotEmulated,
                error_type: None,
            };
        }
        Self {
            outcome: Outcome::from_http_status(http_status),
            error_type: Some(ErrorType::from_code(error_shape_name)),
        }
    }

    pub fn outcome(self) -> Outcome {
        self.outcome
    }

    pub fn error_type(self) -> Option<ErrorType> {
        self.error_type
    }

    pub fn is_coverage_gap(self) -> bool {
        self.outcome == Outcome::NotEmulated
    }
}

/// No-op: [`recording_active`] is always `false`, so a generated router's dispatch sequence
/// never reaches the point of calling this with anything to act on, but the signature must
/// still match the native crate's.
pub fn record_generated_operation_with_handle(
    _handle: &OperationHandle,
    _latency: Duration,
    _failure: Option<OperationFailure>,
    _request_metadata: Option<SanitizedRequestMetadata>,
) {
}
