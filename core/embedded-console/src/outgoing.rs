// SPDX-License-Identifier: CC0-1.0

//! Calls another `wasi:http` component over `wasi:http/outgoing-handler` — the
//! same boundary this component would cross to reach a real network peer.
//!
//! Stays on raw `wit-bindgen` bindings rather than `wstd`'s own `http::Client`:
//! `wstd::http::Client::send` awaits a WASI pollable through `wstd`'s own
//! reactor, which only makes progress when `wstd`'s own `block_on` loop regains
//! control. A caller of [`call_component`] that runs inside a NESTED tokio
//! runtime (as every `embedded-*` component does, to drive
//! `smithy_server_runtime::MultiServiceRouter::dispatch`) would deadlock: if the
//! outgoing call's pollable isn't ready on `wstd`'s synchronous first check —
//! true of any real cross-component call bridged through JS `fetch` — `wstd`'s
//! reactor registers tokio's waker and returns, and nothing ever calls it again:
//! `wstd`'s own event loop is the only thing that would, and it can't — it's
//! blocked further up the same call stack. Raw `wit-bindgen` + `pollable.block()`
//! sidesteps this entirely: it's a direct blocking host call with no Waker and no
//! reactor involved, so it doesn't care who nominally "owns" the call stack —
//! this is also why [`call_component`] is a plain synchronous function, safely
//! callable from anywhere, including from inside a service crate's own business
//! logic (see the Secrets Manager authorization fallback), with no `.await` and
//! no risk of a reentrant-runtime panic.
//!
//! ## A limitation this DOESN'T sidestep: nested outgoing calls
//!
//! A SINGLE `wasi:http/outgoing-handler` call per component, bridged through a
//! host's JS `fetch`, works reliably (proven repeatedly: Secrets Manager calling
//! KMS, Secrets Manager calling IAM directly). A SECOND one, made by the
//! component that ANSWERS the first call, from within handling it — e.g.
//! Secrets Manager calls `embedded-console-service`, whose own handler calls
//! IAM over ANOTHER `wasi:http/outgoing-handler` before answering — reproducibly
//! fails: `future_response.get()` returns `None` even right after `block()`
//! returns, and the underlying pollable reports itself disposed on every retry
//! (confirmed not a transient readiness race: retrying `block()` makes no
//! difference, every attempt sees the same disposed state). This looks like a
//! genuine limitation of how nested JSPI suspension across
//! independently-instantiated components is handled by this toolchain
//! (`jco`'s transpile output plus `@bytecodealliance/preview2-shim`'s browser
//! implementation), not a bug in this file's own blocking-call code, which is
//! unchanged from the proven-working single-hop case. Until that's resolved
//! upstream (or worked around with real network-level calls instead of the
//! in-process `fetch` bridge), a component that needs to call another service
//! on behalf of a caller should call it DIRECTLY rather than through a relay —
//! see Secrets Manager's own authorization fallback, which calls IAM directly
//! rather than through `embedded-console-service`, for exactly this reason.

wit_bindgen::generate!({
    path: "wit",
    world: "wasi:http/proxy",
    generate_all,
});

use wasi::http::outgoing_handler;
use wasi::http::types::{
    ErrorCode, Fields, IncomingResponse, Method, OutgoingBody, OutgoingRequest, Scheme,
};

/// Sends `request` to `authority` over `wasi:http/outgoing-handler`. `authority`
/// names no real host: nothing resolves it over a network. It exists only so the
/// outgoing request is well-formed; the host (a browser's JS glue, in this demo)
/// decides which component actually answers a call to a given authority, the
/// same way a real reverse proxy decides where a request with that authority
/// routes.
pub fn call_component(
    authority: &str,
    request: http::Request<bytes::Bytes>,
) -> http::Response<bytes::Bytes> {
    let (parts, body) = request.into_parts();

    let header_entries: Vec<(String, Vec<u8>)> = parts
        .headers
        .iter()
        .map(|(name, value)| (name.to_string(), value.as_bytes().to_vec()))
        .collect();
    let headers = Fields::from_list(&header_entries).expect("request headers are valid field values");

    let outgoing_request = OutgoingRequest::new(headers);
    outgoing_request
        .set_method(&to_wit_method(&parts.method))
        .expect("method is set before the request is dispatched");
    outgoing_request
        .set_scheme(Some(&Scheme::Https))
        .expect("scheme is set before the request is dispatched");
    outgoing_request
        .set_authority(Some(authority))
        .expect("authority is set before the request is dispatched");
    outgoing_request
        .set_path_with_query(Some(
            parts.uri.path_and_query().map(|p| p.as_str()).unwrap_or("/"),
        ))
        .expect("path is set before the request is dispatched");

    let outgoing_body = outgoing_request.body().expect("body requested once, before dispatch");
    write_outgoing_body(&outgoing_body, &body).expect("writing the request body");
    OutgoingBody::finish(outgoing_body, None).expect("finishing a body written without trailers");

    let future_response =
        outgoing_handler::handle(outgoing_request, None).expect("a well-formed outgoing request");
    future_response.subscribe().block();
    let incoming_response = future_response
        .get()
        .expect("ready after block")
        .expect("polled at most once")
        .expect("the peer answered without a transport error");

    from_incoming_response(incoming_response).expect("reading the peer's response")
}

fn to_wit_method(method: &http::Method) -> Method {
    match method.as_str() {
        "GET" => Method::Get,
        "HEAD" => Method::Head,
        "POST" => Method::Post,
        "PUT" => Method::Put,
        "DELETE" => Method::Delete,
        "CONNECT" => Method::Connect,
        "OPTIONS" => Method::Options,
        "TRACE" => Method::Trace,
        "PATCH" => Method::Patch,
        other => Method::Other(other.to_string()),
    }
}

fn write_outgoing_body(outgoing_body: &OutgoingBody, body: &[u8]) -> Result<(), ErrorCode> {
    let stream = outgoing_body.write().map_err(|_| ErrorCode::InternalError(None))?;
    for chunk in body.chunks(4096) {
        stream
            .blocking_write_and_flush(chunk)
            .map_err(|_| ErrorCode::InternalError(None))?;
    }
    drop(stream);
    Ok(())
}

fn from_incoming_response(response: IncomingResponse) -> Result<http::Response<bytes::Bytes>, ErrorCode> {
    let status = response.status();
    let header_entries = {
        let headers = response.headers();
        let entries = headers.entries();
        drop(headers);
        entries
    };

    let incoming_body = response.consume().map_err(|_| ErrorCode::HttpProtocolError)?;
    let mut body_buf = Vec::new();
    {
        let stream = incoming_body
            .stream()
            .map_err(|_| ErrorCode::HttpProtocolError)?;
        loop {
            match stream.blocking_read(64 * 1024) {
                Ok(chunk) if chunk.is_empty() => break,
                Ok(chunk) => body_buf.extend_from_slice(&chunk),
                Err(wasi::io::streams::StreamError::Closed) => break,
                Err(wasi::io::streams::StreamError::LastOperationFailed(_)) => {
                    return Err(ErrorCode::HttpProtocolError);
                }
            }
        }
    }
    drop(incoming_body);
    drop(response);

    let mut builder = http::Response::builder().status(status);
    for (name, value) in header_entries {
        builder = builder.header(name, value);
    }
    builder
        .body(bytes::Bytes::from(body_buf))
        .map_err(|_| ErrorCode::InternalError(None))
}
