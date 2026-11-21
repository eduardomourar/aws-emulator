// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0
//! wasm32 stand-in for `listeners.rs`.
//!
//! WASM-EMBEDDED EXPERIMENT (not the normal build): a browser-embedded emulator has no real
//! socket to bind, so every resource listener here is a `SurfaceError::Bind` refusal rather
//! than a TLS accept loop. The type names match `listeners.rs` exactly, because `engine`
//! (`InMemoryEngine`) holds an `Arc<Listeners>` unconditionally and services such as Lambda's
//! function-URL front door name `ResourceListener`/`NativeHandler`/`HttpHandler` directly: this
//! file exists only so those keep compiling for `wasm32-wasip2`, not because a resource
//! listener can work in that target.

use std::future::Future;
use std::net::SocketAddr;
use std::pin::Pin;

use tokio::io::{AsyncRead, AsyncWrite};

use crate::listener_guard::SurfaceError;

const NOT_AVAILABLE: &str = "resource listeners are not available in a wasm32 embed";

/// Matches the real `ListenerStream`'s bound exactly: callers across the workspace (e.g.
/// `service-common`'s wire-protocol readers) call `AsyncRead`/`AsyncWrite` methods directly
/// on a `ListenerConn`, so the stub's alias must satisfy the same trait bound even though no
/// listener here ever actually produces one.
pub trait ListenerStream: AsyncRead + AsyncWrite + Unpin + Send {}
impl<T: AsyncRead + AsyncWrite + Unpin + Send> ListenerStream for T {}

pub type ListenerConn = Box<dyn ListenerStream>;

pub trait NativeHandler: Send + Sync + 'static {
    fn serve(&self, conn: ListenerConn) -> Pin<Box<dyn Future<Output = ()> + Send>>;
}

pub trait HttpHandler: Send + Sync + 'static {
    fn handle(
        &self,
        req: http::Request<Vec<u8>>,
    ) -> Pin<Box<dyn Future<Output = http::Response<Vec<u8>>> + Send>>;
}

#[derive(Debug, Clone)]
pub struct HttpPolicy {
    pub remote_origins: crate::listener_guard::RemoteOrigins,
    pub allow_remote: bool,
}

impl Default for HttpPolicy {
    fn default() -> Self {
        Self {
            remote_origins: crate::listener_guard::RemoteOrigins::SameOriginOnly,
            allow_remote: true,
        }
    }
}

pub struct Listeners {
    _private: (),
}

impl Default for Listeners {
    fn default() -> Self {
        Self::new()
    }
}

impl Listeners {
    pub fn new() -> Self {
        Self { _private: () }
    }

    pub async fn tcp<H: NativeHandler>(&self, _handler: H) -> Result<ResourceListener, SurfaceError> {
        Err(SurfaceError::Bind(NOT_AVAILABLE.to_string()))
    }

    pub async fn tcp_with_idle<H: NativeHandler>(
        &self,
        _handler: H,
        _idle: std::time::Duration,
    ) -> Result<ResourceListener, SurfaceError> {
        Err(SurfaceError::Bind(NOT_AVAILABLE.to_string()))
    }

    pub async fn tcp_plaintext<H: NativeHandler>(
        &self,
        _handler: H,
    ) -> Result<ResourceListener, SurfaceError> {
        Err(SurfaceError::Bind(NOT_AVAILABLE.to_string()))
    }

    pub fn tls_upgrader(&self) -> Result<TlsUpgrader, SurfaceError> {
        Err(SurfaceError::Bind(NOT_AVAILABLE.to_string()))
    }

    pub async fn http<H: HttpHandler>(
        &self,
        _handler: H,
        _policy: HttpPolicy,
    ) -> Result<ResourceListener, SurfaceError> {
        Err(SurfaceError::Bind(NOT_AVAILABLE.to_string()))
    }
}

#[derive(Clone)]
pub struct TlsUpgrader {
    _private: (),
}

impl TlsUpgrader {
    pub async fn accept(
        &self,
        _conn: ListenerConn,
        _alpn: Option<&[u8]>,
    ) -> std::io::Result<(ListenerConn, Option<Vec<u8>>)> {
        Err(std::io::Error::other(NOT_AVAILABLE))
    }
}

/// Never constructed (every [`Listeners`] method above refuses before making one), but the
/// type stays real so callers holding one across an `.await` still compile.
pub struct ResourceListener {
    addr: SocketAddr,
}

impl ResourceListener {
    pub fn host(&self) -> String {
        self.addr.ip().to_string()
    }
    pub fn port(&self) -> u16 {
        self.addr.port()
    }
    pub fn addr(&self) -> SocketAddr {
        self.addr
    }
    pub fn url(&self) -> String {
        format!("https://{}", self.authority())
    }
    pub fn authority(&self) -> String {
        self.addr.to_string()
    }
}
