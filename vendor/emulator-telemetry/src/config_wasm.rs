// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//! wasm32 stand-in for `config.rs`.
//!
//! WASM-EMBEDDED EXPERIMENT (not the normal build): the real `Endpoint` validates with
//! `reqwest::Url`, which does not exist for wasm32 (`reqwest::blocking`/its `Url` re-export are
//! compiled out there). `core/embedded` only ever calls [`Endpoint::parse`] to build a
//! [`crate::client::TelemetryOptions`] that a no-op [`crate::client::TelemetryClient`] never
//! sends anywhere, so this keeps the same type and a much looser validation (non-empty) rather
//! than pulling in a URL parser for a value nothing here dials.

/// Where the effective on/off decision came from. `policy.rs` names this unconditionally
/// (it is real, cross-platform logic), so it stays even though nothing on wasm32 reads it.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum SwitchSource {
    Env,
    ConfigFile,
    Api,
    Default,
    InvalidEnv,
    InvalidFile,
}

/// A nominally-validated telemetry endpoint. See the module docs: on wasm32 this never
/// actually dials anything, so validation is reduced to "non-empty".
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Endpoint {
    url: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum EndpointError {
    Empty,
}

impl std::fmt::Display for EndpointError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::Empty => write!(f, "the value was empty or whitespace"),
        }
    }
}

impl std::error::Error for EndpointError {}

impl Endpoint {
    pub fn parse(raw: &str) -> Result<Self, EndpointError> {
        let trimmed = raw.trim().trim_end_matches('/');
        if trimmed.is_empty() {
            return Err(EndpointError::Empty);
        }
        Ok(Self {
            url: trimmed.to_string(),
        })
    }

    pub fn parse_ingest(raw: &str) -> Result<Self, EndpointError> {
        Self::parse(raw)
    }

    pub fn as_str(&self) -> &str {
        &self.url
    }

    pub fn host(&self) -> &str {
        &self.url
    }

    pub fn same_host(&self, other: &Endpoint) -> bool {
        self.url == other.url
    }
}
