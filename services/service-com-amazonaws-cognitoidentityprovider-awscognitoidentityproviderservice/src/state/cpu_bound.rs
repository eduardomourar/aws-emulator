// SPDX-License-Identifier: CC0-1.0

//! Runs a CPU-bound, synchronous closure (minting a pool's RSA/ECDSA key pairs) off the
//! async executor.
//!
//! On native, this is `tokio::task::spawn_blocking`: a dedicated thread, since the work is
//! synchronous and CPU-bound and does not belong on an async worker. On wasm32, there is
//! no real OS thread to hand it to -- confirmed by running it: `spawn_blocking` panics
//! ("OS can't spawn worker thread: Not supported"), and that panic does not just fail this
//! one call, it aborts the whole shared, long-lived component instance, wedging every
//! future request to it. Concurrency into one instance is already serialized by the host
//! that embeds it, so there is no other async work in flight to protect by moving this off
//! the task anyway: the closure just runs inline there instead.
//!
//! Returns the same `Result` shape `JoinHandle::await` does (`Ok(T)`, or an error on the
//! rare case the closure itself could not be run to completion) so every call site's own
//! `.map_err`/`Ok`/`Err` handling needs no change switching between the two.

#[cfg(not(target_family = "wasm"))]
pub(crate) async fn run<F, T>(f: F) -> Result<T, ::tokio::task::JoinError>
where
    F: FnOnce() -> T + Send + 'static,
    T: Send + 'static,
{
    ::tokio::task::spawn_blocking(f).await
}

#[cfg(target_family = "wasm")]
pub(crate) async fn run<F, T>(f: F) -> Result<T, ::std::convert::Infallible>
where
    F: FnOnce() -> T,
{
    Ok(f())
}
