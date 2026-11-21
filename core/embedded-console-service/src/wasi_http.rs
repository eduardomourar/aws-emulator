// SPDX-License-Identifier: CC0-1.0

//! This component's own `wasi:http/incoming-handler` export: a thin internal
//! relay sitting between a caller (today: Secrets Manager's authorization
//! fallback) and whichever component actually owns the data being asked for.
//!
//! Scoped for now to IAM only: everything this component receives is forwarded
//! verbatim to `embedded-iam`'s own internal-only endpoint.
//!
//! NOT currently called by Secrets Manager's authorization fallback, despite
//! being built for exactly that: calling THIS component from another
//! component's own `wasi:http/outgoing-handler` call — i.e. the fallback
//! calling this relay, which then makes its OWN outgoing call to IAM before
//! answering — reproducibly fails under this toolchain (`jco`'s transpile
//! output plus `preview2-shim`'s browser implementation): a SECOND, nested
//! outgoing call, made while answering a FIRST one, never resolves (see
//! `embedded_console::outgoing`'s module docs for the details). So Secrets
//! Manager calls IAM DIRECTLY instead (same `call_component` helper, no relay
//! hop) — this component remains correct and usable on its own (calling it as
//! the FIRST/only outgoing hop in a chain works fine; it's a second NESTED hop
//! that fails), just without an active caller in this demo's wiring today.

use embedded_console::{call_component, handle_with};

/// The authority this relay forwards every request to today.
const IAM_AUTHORITY: &str = "iam.local.invalid";

#[wstd::http_server]
async fn main(
    request: wstd::http::Request<wstd::http::body::Body>,
) -> Result<wstd::http::Response<wstd::http::body::Body>, wstd::http::Error> {
    handle_with(request, |req| call_component(IAM_AUTHORITY, req)).await
}
