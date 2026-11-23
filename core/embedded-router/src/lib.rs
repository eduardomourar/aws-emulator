// SPDX-License-Identifier: CC0-1.0

//! The single front door for the browser-embedded build: one synthetic
//! authority a console (Floci UI's bundles, or any other off-the-shelf
//! AWS-SDK client) points its endpoint at, the browser-side counterpart of
//! the native `core/router`'s `MultiServiceRouter` — except this component
//! registers no service of its own. Every request it receives is forwarded,
//! unmodified, to whichever sibling `embedded-*` component actually answers
//! it, over `wasi:http/outgoing-handler` (the same boundary any `embedded-*`
//! component crosses to reach a peer) via
//! [`embedded_console::call_component`].
//!
//! Which sibling a request goes to is decided the same way a real
//! multi-service AWS endpoint decides it: by the SigV4 credential scope in
//! the request's own `Authorization` header (`.../<region>/<service>/aws4_request`)
//! — see [`wasi_http::authority_for`]. That's the one signal every signed AWS
//! request carries regardless of wire protocol (JSON RPC services send
//! `X-Amz-Target` too; the older query/XML services like IAM and STS do not),
//! so it's the only one this component looks at.

#[cfg(target_family = "wasm")]
mod wasi_http;
