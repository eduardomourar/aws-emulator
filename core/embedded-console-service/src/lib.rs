// SPDX-License-Identifier: CC0-1.0

//! This crate IS the "console" component: the thin internal relay
//! `embedded-secretsmanager`'s authorization fallback calls, which forwards to
//! `embedded-iam`'s own internal-only endpoint — "as if it was another
//! internal emulator service", even though today it holds no state of its own.
//!
//! Split from `aws-emulator-embedded-console` (the shared library it depends
//! on) because a single crate can't be both: a `cdylib` built from the library
//! would export its own `wasi:http/incoming-handler`, colliding at link time
//! with every OTHER `embedded-*` crate's own export of that symbol, since the
//! library is also an `rlib` dependency of all of them.

#[cfg(target_family = "wasm")]
mod wasi_http;
