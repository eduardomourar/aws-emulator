// SPDX-License-Identifier: CC0-1.0

//! `wasi:http/proxy` component export: the one incoming-handler every console
//! bundle's AWS SDK client is pointed at. Unlike every other `embedded-*`
//! component, this one dispatches nothing itself — [`crate`]'s module docs
//! cover why and how.

use embedded_console::{call_component, handle_with};

/// (SigV4 signing name, synthetic authority of the component that answers
/// it). The signing name is a fixed property of each service's AWS SDK
/// client (its default `signingName`), not something a caller configures, so
/// this table only needs to grow when a new service's `embedded-*` component
/// is added behind this front door.
const AUTHORITY_BY_SERVICE: &[(&str, &str)] = &[
    ("secretsmanager", "secretsmanager.local.invalid"),
    ("kms", "kms.local.invalid"),
    ("sts", "sts.local.invalid"),
    ("iam", "iam.local.invalid"),
    ("monitoring", "cloudwatch.local.invalid"),
    ("codebuild", "codebuild.local.invalid"),
    ("cognito-idp", "cognitoidentityprovider.local.invalid"),
];

#[wstd::http_server]
async fn main(
    request: wstd::http::Request<wstd::http::body::Body>,
) -> Result<wstd::http::Response<wstd::http::body::Body>, wstd::http::Error> {
    handle_with(request, |req| async move {
        match authority_for(&req) {
            Some(authority) => call_component(authority, req).await,
            None => unknown_service_response(),
        }
    })
    .await
}

/// The synthetic authority to forward `request` to, read from the SigV4
/// credential scope in its `Authorization` header
/// (`AWS4-HMAC-SHA256 Credential=<key>/<date>/<region>/<service>/aws4_request, ...`)
/// — the one signal every signed AWS request carries regardless of wire
/// protocol. `None` if the header is missing, malformed, or names a service
/// with no sibling component behind this front door.
fn authority_for(request: &http::Request<bytes::Bytes>) -> Option<&'static str> {
    let header = request.headers().get(http::header::AUTHORIZATION)?.to_str().ok()?;
    let credential = header.split("Credential=").nth(1)?;
    let scope = credential.split(|c: char| c == ',' || c.is_whitespace()).next()?;
    let service = scope.split('/').nth(3)?;
    AUTHORITY_BY_SERVICE
        .iter()
        .find(|(name, _)| *name == service)
        .map(|(_, authority)| *authority)
}

fn unknown_service_response() -> http::Response<bytes::Bytes> {
    http::Response::builder()
        .status(400)
        .header("content-type", "application/json")
        .body(bytes::Bytes::from_static(
            br#"{"__type":"UnknownOperationException","message":"no service behind this front door claims this request"}"#,
        ))
        .expect("a well-formed response")
}
