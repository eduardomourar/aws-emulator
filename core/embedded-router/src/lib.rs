// SPDX-License-Identifier: CC0-1.0

//! NOT PART OF ANY LIVE REQUEST PATH — `core/embedded-console/build.rs`
//! doesn't build this crate. It was the single front door for the
//! browser-embedded build: one synthetic authority a console (Floci UI's
//! bundles, or any other off-the-shelf AWS-SDK client) points its endpoint
//! at, with every request forwarded to whichever sibling `embedded-*`
//! component actually answers it over `wasi:http/outgoing-handler`.
//!
//! That forwarding is a `wasi:http` SERVER (this component, answering the
//! front door) making an outgoing CLIENT call (to the real target
//! component) while still inside its own handler — a nested async wasm
//! call, which reproducibly traps (`wasm trap: cannot enter component
//! instance`, a wit-bindgen JSPI assertion failure) on the current
//! toolchain. The same limitation already made `embedded-console-service`'s
//! relay dead code earlier in this project's history; this component hit it
//! too, for every request that needed forwarding, not as an edge case.
//!
//! `core/embedded-console/web/external-dispatch-bridge.js` now does this
//! same SigV4-based dispatch in the browser instead: calling each real
//! component directly, since the browser itself — not another wasm
//! component — can decide where a request goes without ever nesting a
//! wasm-level call. This crate's [`wasi_http::authority_for`] stays as the
//! authoritative reference for that signing-name-to-authority mapping.

#[cfg(target_family = "wasm")]
mod wasi_http;
