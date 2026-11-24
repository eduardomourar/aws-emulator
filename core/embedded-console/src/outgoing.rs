// SPDX-License-Identifier: CC0-1.0

//! Calls another `wasi:http` component over `wasi:http/outgoing-handler` — the
//! same boundary this component would cross to reach a real network peer.
//!
//! Built on `wstd::http::Client`, now that everything is genuinely WASI-0.3
//! native end to end. An earlier revision of this file stayed on raw
//! `wit-bindgen` bindings against WASI 0.2.12 because `wstd::http::Client`'s
//! `p2` code path awaits a WASI pollable through `wstd`'s own reactor, which
//! only makes progress when `wstd`'s own `block_on` loop regains control — a
//! caller nested inside a foreign (tokio) runtime would deadlock. `wstd`'s
//! `p3` code path (`target_env = "p3"`) has no such reactor: `Client::send`
//! there is a bare `wasip3::http::client::send(request).await` on the raw
//! async-generated import, which integrates with any standard Rust executor's
//! ordinary `Future`/`Waker` polling — no separate loop to stall on. That
//! removes the original reason to avoid it.
//!
//! This is also why [`call_component`] is now `async fn`: WASI 0.3's
//! `client.send` has no synchronous/blocking variant at the WIT level (`send:
//! async func(...)`), so there is no way to keep this function's old
//! synchronous signature without reintroducing a blocking shim — which is
//! exactly the `wit_bindgen`-task-state conflict this rewrite is for.

/// Sends `request` to `authority` over `wasi:http/outgoing-handler`, plain HTTP
/// (no TLS termination to forward through). Under a browser host, `authority`
/// names no real host and the host's own JS glue decides which component
/// answers it; under a native host (`wasmtime serve`), `authority` is a real
/// loopback `host:port` and this is a genuine network call to the sibling
/// component listening there.
pub async fn call_component(
    authority: &str,
    request: http::Request<bytes::Bytes>,
) -> http::Response<bytes::Bytes> {
    let (mut parts, body) = request.into_parts();
    parts.uri = {
        let mut builder = http::Uri::builder().scheme("http").authority(authority);
        if let Some(path_and_query) = parts.uri.path_and_query() {
            builder = builder.path_and_query(path_and_query.clone());
        }
        builder.build().expect("a well-formed outgoing request URI")
    };
    let wstd_request = wstd::http::Request::from_parts(parts, wstd::http::body::Body::from(body.to_vec()));

    let response = wstd::http::Client::new()
        .send(wstd_request)
        .await
        .expect("the peer answered without a transport error");

    let (parts, body) = response.into_parts();
    let body_bytes = {
        use wstd::http::BodyExt;
        body.into_boxed_body()
            .collect()
            .await
            .expect("reading the peer's response body")
            .to_bytes()
    };
    http::Response::from_parts(parts, body_bytes)
}
