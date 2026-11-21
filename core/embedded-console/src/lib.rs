// SPDX-License-Identifier: CC0-1.0

//! Shared `wasm32-wasip2` component plumbing for every `embedded-*` crate, and
//! a small standalone component of its own.
//!
//! A pure library (`rlib` only — see `Cargo.toml`), depended on by every
//! `embedded-*` crate so none of them hand-rolls its own `wit-bindgen`/`wstd`
//! glue: [`serving::handle_with`] and [`serving::runtime`] for the
//! `wasi:http/incoming-handler` (server) side, [`outgoing::call_component`]
//! for the `wasi:http/outgoing-handler` (client) side — calling another
//! component the same way this component would reach a real network peer.
//!
//! This crate's own standalone "console" component — a thin internal relay
//! standing in for a cross-cutting service, forwarding Secrets Manager's
//! authorization-fallback calls to IAM's own internal-only endpoint — lives in
//! the separate `embedded-console-service` crate, which depends on this one.
//! It can't live here too: a `cdylib` built from this crate would carry its own
//! `wasi:http/incoming-handler` export, colliding at link time with every
//! dependent's own export of the same symbol.

#[cfg(target_family = "wasm")]
mod outgoing;
#[cfg(target_family = "wasm")]
pub use outgoing::call_component;

#[cfg(target_family = "wasm")]
mod serving;
#[cfg(target_family = "wasm")]
pub use serving::{handle_with, runtime};
