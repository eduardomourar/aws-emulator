// SPDX-License-Identifier: CC0-1.0

//! `aws-emulator:callback/dispatch` component export: bridges the WIT call to
//! [`crate::build_router`]'s [`smithy_server_runtime::MultiServiceRouter`].

use std::sync::OnceLock;

wit_bindgen::generate!({
    path: "wit",
    world: "kms-export",
    generate_all,
});

use exports::aws_emulator::callback::dispatch::{Guest, HttpHeader, HttpRequest, HttpResponse};

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
    fn dispatch(request: HttpRequest) -> HttpResponse {
        let request = to_http_request(request);
        let response = runtime().block_on(router().dispatch(request));
        from_http_response(response)
    }
}

fn to_http_request(request: HttpRequest) -> http::Request<bytes::Bytes> {
    let mut builder = http::Request::builder()
        .method(request.method.as_str())
        .uri(request.uri.as_str());
    for header in &request.headers {
        builder = builder.header(&header.name, &header.value);
    }
    builder
        .body(bytes::Bytes::from(request.body))
        .expect("a WIT dispatch request always builds a valid http::Request")
}

fn from_http_response(response: http::Response<bytes::Bytes>) -> HttpResponse {
    let (parts, body) = response.into_parts();
    let headers = parts
        .headers
        .iter()
        .map(|(name, value)| HttpHeader {
            name: name.to_string(),
            value: String::from_utf8_lossy(value.as_bytes()).into_owned(),
        })
        .collect();
    HttpResponse {
        status: parts.status.as_u16(),
        headers,
        body: body.to_vec(),
    }
}
