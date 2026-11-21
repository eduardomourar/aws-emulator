// SPDX-License-Identifier: CC0-1.0

//! `wasi:http/proxy` component export: bridges the WASI HTTP guest ABI to
//! [`crate::build_router`]'s [`smithy_server_runtime::MultiServiceRouter`].

use std::sync::OnceLock;

wit_bindgen::generate!({
    path: "wit",
    world: "wasi:http/proxy",
    generate_all,
});

use exports::wasi::http::incoming_handler::Guest;
use wasi::http::types::{
    ErrorCode, Fields, IncomingRequest, Method, OutgoingBody, OutgoingResponse, ResponseOutparam,
};

struct Component;

export!(Component);

fn router() -> &'static smithy_server_runtime::MultiServiceRouter {
    static ROUTER: OnceLock<smithy_server_runtime::MultiServiceRouter> = OnceLock::new();
    ROUTER.get_or_init(|| crate::build_router(std::sync::Arc::new(crate::InMemoryEngine::new())))
}

fn runtime() -> &'static tokio::runtime::Runtime {
    static RUNTIME: OnceLock<tokio::runtime::Runtime> = OnceLock::new();
    RUNTIME.get_or_init(|| {
        tokio::runtime::Builder::new_current_thread()
            .enable_time()
            .build()
            .expect("current-thread tokio runtime")
    })
}

impl Guest for Component {
    fn handle(request: IncomingRequest, response_out: ResponseOutparam) {
        match convert_request(request) {
            Ok(request) => {
                let response = runtime().block_on(router().dispatch(request));
                send_response(response_out, response);
            }
            Err(code) => ResponseOutparam::set(response_out, Err(code)),
        }
    }
}

fn convert_request(request: IncomingRequest) -> Result<http::Request<bytes::Bytes>, ErrorCode> {
    let method = match request.method() {
        Method::Get => http::Method::GET,
        Method::Head => http::Method::HEAD,
        Method::Post => http::Method::POST,
        Method::Put => http::Method::PUT,
        Method::Delete => http::Method::DELETE,
        Method::Connect => http::Method::CONNECT,
        Method::Options => http::Method::OPTIONS,
        Method::Trace => http::Method::TRACE,
        Method::Patch => http::Method::PATCH,
        Method::Other(other) => {
            http::Method::from_bytes(other.as_bytes()).map_err(|_| ErrorCode::HttpRequestMethodInvalid)?
        }
    };

    let path_with_query = request.path_with_query().unwrap_or_else(|| "/".to_string());
    let authority = request.authority();
    let scheme = match request.scheme() {
        Some(wasi::http::types::Scheme::Https) | None => "https",
        Some(wasi::http::types::Scheme::Http) => "http",
        Some(wasi::http::types::Scheme::Other(_)) => "https",
    };
    let uri = if let Some(authority) = authority {
        format!("{scheme}://{authority}{path_with_query}")
    } else {
        path_with_query
    };

    let mut builder = http::Request::builder().method(method).uri(uri);
    for (name, value) in request.headers().entries() {
        builder = builder.header(name, value);
    }

    let body_bytes = read_incoming_body(&request)?;
    // Dropping `request` also drops its still-live `incoming-body` child; read it first.
    drop(request);

    builder
        .body(bytes::Bytes::from(body_bytes))
        .map_err(|_| ErrorCode::HttpRequestMethodInvalid)
}

fn read_incoming_body(request: &IncomingRequest) -> Result<Vec<u8>, ErrorCode> {
    let incoming_body = request
        .consume()
        .map_err(|_| ErrorCode::HttpProtocolError)?;
    let mut buf = Vec::new();
    {
        let stream = incoming_body
            .stream()
            .map_err(|_| ErrorCode::HttpProtocolError)?;
        loop {
            match stream.blocking_read(64 * 1024) {
                Ok(chunk) if chunk.is_empty() => break,
                Ok(chunk) => buf.extend_from_slice(&chunk),
                Err(wasi::io::streams::StreamError::Closed) => break,
                Err(wasi::io::streams::StreamError::LastOperationFailed(_)) => {
                    return Err(ErrorCode::HttpProtocolError);
                }
            }
        }
        // `stream` (the input-stream child) must drop before `incoming_body` does.
    }
    // No trailers to read; dropping `incoming_body` without calling `finish` is fine for a
    // request we've fully consumed — we never write to it, only `outgoing-body` needs `finish`.
    Ok(buf)
}

fn send_response(response_out: ResponseOutparam, response: http::Response<bytes::Bytes>) {
    let (parts, body) = response.into_parts();

    let header_entries: Vec<(String, Vec<u8>)> = parts
        .headers
        .iter()
        .map(|(name, value)| (name.to_string(), value.as_bytes().to_vec()))
        .collect();
    let headers = match Fields::from_list(&header_entries) {
        Ok(headers) => headers,
        Err(_) => {
            ResponseOutparam::set(response_out, Err(ErrorCode::InternalError(None)));
            return;
        }
    };

    let outgoing_response = OutgoingResponse::new(headers);
    if outgoing_response.set_status_code(parts.status.as_u16()).is_err() {
        ResponseOutparam::set(response_out, Err(ErrorCode::InternalError(None)));
        return;
    }

    let outgoing_body = match outgoing_response.body() {
        Ok(body) => body,
        Err(_) => {
            ResponseOutparam::set(response_out, Err(ErrorCode::InternalError(None)));
            return;
        }
    };

    // `set` hands the response headers/status to the host and lets execution continue so
    // the body can be streamed afterward; the `outgoing-body` handle above stays valid.
    ResponseOutparam::set(response_out, Ok(outgoing_response));

    if write_body(&outgoing_body, &body).is_ok() {
        let _ = OutgoingBody::finish(outgoing_body, None);
    }
}

fn write_body(outgoing_body: &OutgoingBody, body: &[u8]) -> Result<(), ErrorCode> {
    let stream = outgoing_body
        .write()
        .map_err(|_| ErrorCode::InternalError(None))?;
    for chunk in body.chunks(4096) {
        stream
            .blocking_write_and_flush(chunk)
            .map_err(|_| ErrorCode::InternalError(None))?;
    }
    drop(stream);
    Ok(())
}
