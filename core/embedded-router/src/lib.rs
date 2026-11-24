// SPDX-License-Identifier: CC0-1.0

//! Not built by `core/embedded-console/build.rs` (the browser-embedded web
//! console path): there, this component's own forwarding call would be a
//! `wasi:http` SERVER (this component, answering the front door) making an
//! outgoing CLIENT call to the real target component while still inside its
//! own handler, nested inside the SAME wasm engine — which reproducibly
//! traps (`wasm trap: cannot enter component instance`, a wit-bindgen JSPI
//! assertion failure) under that toolchain's JS-glue-driven async mode.
//! `core/embedded-console/web/external-dispatch-bridge.js` does this same
//! SigV4-based dispatch in the browser instead.
//!
//! Served natively instead (`core/embedded-console/src/bin/serve_native.rs`),
//! this component's own outgoing call is never nested inside another wasm
//! instance at all: each sibling `embedded-*` component is its own OS
//! process listening on its own loopback port, so forwarding a request is a
//! genuine `wasi:http/outgoing-handler` call over real TCP — the same thing
//! a reverse proxy does — with no JSPI trap to hit. This crate's
//! [`wasi_http::authority_for`] is the signing-name-to-authority mapping
//! both paths share.

#[cfg(target_family = "wasm")]
mod wasi_http;
