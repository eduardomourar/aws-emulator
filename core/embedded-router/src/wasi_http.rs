// SPDX-License-Identifier: CC0-1.0

//! `wasi:http/proxy` component export: the one incoming-handler every console
//! bundle's AWS SDK client is pointed at. Unlike every other `embedded-*`
//! component, this one dispatches nothing itself — [`crate`]'s module docs
//! cover why and how.

use embedded_console::{call_component, handle_with};

/// (SigV4 signing name, loopback authority of the component that answers it).
/// The signing name is a fixed property of each service's AWS SDK client (its
/// default `signingName`), not something a caller configures, so this table
/// only needs to grow when a new service's `embedded-*` component is added
/// behind this front door. Each port matches the one the sibling component is
/// told to listen on in `core/embedded-console/src/bin/serve_native.rs`.
const AUTHORITY_BY_SERVICE: &[(&str, &str)] = &[
    ("secretsmanager", "127.0.0.1:9401"),
    ("kms", "127.0.0.1:9402"),
    ("sts", "127.0.0.1:9403"),
    ("iam", "127.0.0.1:9404"),
    ("monitoring", "127.0.0.1:9405"),
    ("codebuild", "127.0.0.1:9406"),
    ("cognito-idp", "127.0.0.1:9407"),
    ("dsql", "127.0.0.1:9408"),
    ("payment-cryptography", "127.0.0.1:9409"),
    ("ecr", "127.0.0.1:9410"),
    ("sqs", "127.0.0.1:9411"),
    ("xray", "127.0.0.1:9412"),
    ("kinesis", "127.0.0.1:9413"),
    ("sns", "127.0.0.1:9414"),
    ("acm", "127.0.0.1:9415"),
    ("route53", "127.0.0.1:9416"),
    ("cloudfront", "127.0.0.1:9417"),
    ("s3", "127.0.0.1:9418"),
    ("ses", "127.0.0.1:9419"),
    ("logs", "127.0.0.1:9420"),
    ("es", "127.0.0.1:9421"),
    ("eks", "127.0.0.1:9422"),
    ("elasticloadbalancing", "127.0.0.1:9423"),
    ("dynamodb", "127.0.0.1:9424"),
    ("apigateway", "127.0.0.1:9425"),
    ("ec2", "127.0.0.1:9426"),
    ("lambda", "127.0.0.1:9427"),
    ("states", "127.0.0.1:9428"),
    ("events", "127.0.0.1:9429"),
    ("application-autoscaling", "127.0.0.1:9430"),
    ("cloudformation", "127.0.0.1:9431"),
    ("ssm", "127.0.0.1:9432"),
    ("ecs", "127.0.0.1:9433"),
    ("scheduler", "127.0.0.1:9434"),
    ("appconfig", "127.0.0.1:9435"),
    ("athena", "127.0.0.1:9436"),
    ("sagemaker", "127.0.0.1:9437"),
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
