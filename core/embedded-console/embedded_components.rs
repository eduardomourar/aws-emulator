// SPDX-License-Identifier: CC0-1.0

/// Services whose `embedded-*` crate needs nothing but the
/// `embedded_console::embedded_service!` macro: one registered service, no
/// `wasi:http/outgoing-handler` fallback, no extra internal-only routes.
///
/// `embedded-iam`, `embedded-secretsmanager` and `embedded-router` each need
/// one of those extras (IAM's internal resolve-access-key route, Secrets
/// Manager's KMS `ExternalDispatch` fallback, and the router's own
/// forward-everything dispatch respectively), so they are not in this list
/// and keep their own hand-written `Cargo.toml`/`lib.rs` instead of a
/// generated one.
///
/// (short name, full package name of the service crate it wraps). Everything
/// else about the crate — its own package name, module path, dependency line —
/// is mechanical from these two.
///
/// Every entry here is a service Floci UI also supports (see
/// `core/embedded-console/web/floci-backend/README.md`) that compiles clean
/// for `wasm32-wasip3` with no workaround beyond what `build.rs` already does
/// uniformly for every component. Deferred, pending their own investigation:
/// `lambda` (fails NATIVELY on this host — `nix::sys::resource::UsageWho::
/// RUSAGE_THREAD` is Linux-only — a pre-existing platform issue, not caused
/// by and out of scope for this wasm effort), `eventbridge`/`ssm`/`sfn`/
/// `scheduler`/`appconfig`/`ecs` (transitively depend on `lambda` through
/// `glue`), `athena`/`cloudformation`/`sagemaker` (transitively depend on
/// `lambda` through `glue`'s own `[build-dependencies]`), and
/// `acm`/`apigateway`/`cloudfront`/`eks`/`elasticloadbalancingv2` (each
/// depends on `hyper`'s `server` feature unconditionally — confirmed, by
/// reading each crate's own source, to back a REAL HTTP listener each of
/// them runs natively: an ACME challenge responder, an EKS webhook, an ALB
/// listener, a CloudFront edge-function endpoint, an API Gateway custom
/// domain socket. Fixing this for wasm would mean gating `hyper`'s `server`
/// feature to native-only in `Cargo.toml` AND wrapping the listener-starting
/// code itself in each service's Rust source behind
/// `cfg(not(target_family = "wasm"))`, so the service still compiles and
/// serves its CRUD operations on wasm, just without the real socket
/// listener — a bigger, riskier change than a `Cargo.toml` feature split,
/// not yet attempted). `rds` and `elasticache` are deferred for the same
/// reason as `dsql`, confirmed by reading their source: each runs a REAL
/// wire-protocol TCP server as its data plane (`rds`'s
/// `src/state/data_plane/{pg,mysql}_server.rs`, `elasticache`'s
/// `src/state/cache_data_plane/resp_wire.rs`) that a real database/cache
/// client connects to — not something a browser can do at all, regardless
/// of what's injected into it, since there is no raw TCP socket API in one.
/// `ec2` is deferred too: it depends directly on both `acm` and
/// `eventbridge`.
///
/// `dsql`, `kinesis`, `paymentcryptography`, `ecr`, `route53`, `ses`, `sqs`,
/// `s3` and `xray` all carry the same wasm-safe `tokio` split every other
/// entry here does. Of those, `dsql`, `kinesis`, `paymentcryptography`,
/// `ecr`, `sqs` and `xray` are confirmed building and transpiling for
/// `wasm32-wasip3` and are in `build.rs`'s `COMPONENTS`.
/// `ses`, `s3`, `dynamodb` and `opensearch` are listed here but NOT yet in
/// `COMPONENTS`: each transitively depends (checked via `cargo tree
/// --target wasm32-wasip3`) on `dynamodb`, which needs `rquickjs-sys` (a C
/// JS engine, for PartiQL expression evaluation) that doesn't ship or build
/// wasm32-wasip3 bindings, and/or on `cloudfront`, which is already deferred
/// above for its own unconditional `hyper` server dependency.
/// `cloudwatchlogs` has the same `tokio` split as the others here but is
/// ALSO excluded from `COMPONENTS` for the same `dynamodb`/`cloudfront`
/// entanglement. `route53` is ALSO excluded for the same reason: it
/// transitively depends on `cloudfront` (confirmed via `cargo tree --target
/// wasm32-wasip3 -e features -i tokio`, which shows `cloudfront` as one of
/// the activators of tokio's `rt-multi-thread`).
///
/// `kinesis`, `ecr` and `sqs` each needed one more fix beyond their own
/// `Cargo.toml`'s split: they all transitively depend on
/// `service-com-amazonaws-signer-wallabyservice` (AWS Signer), whose own
/// `tokio = { workspace = true, features = ["time"] }` had the same
/// ADDS-not-replaces bug (see that crate's `Cargo.toml` and `sqs`'s own, now
/// fixed the same way) — not an axum/vendor issue after all.
///
/// `sns` is also confirmed building and transpiling for `wasm32-wasip3` and
/// is in `build.rs`'s `COMPONENTS`. It needed its own `tokio` split (same
/// ADDS-not-replaces fix) plus one more: its own `aws-sdk-cloudwatchlogs`
/// dependency carried the unconditional `"rt-tokio"` feature, which sets
/// `tokio?/fs` (not wasm-safe) via `aws-smithy-types`'s own feature
/// definition — same fix as `ecr`/`kinesis`/`xray`'s `aws-sdk-kms`/`-s3`.
/// `sns` separately failed to even build NATIVELY until its own
/// `serde_json` dependency gained the `"raw_value"` feature its own code
/// (`state/filter_policy.rs`) uses but never declared — unrelated to wasm,
/// fixed the same way.
#[allow(dead_code)]
const SIMPLE_EMBEDDED_COMPONENTS: &[(&str, &str)] = &[
    ("kms", "service-com-amazonaws-kms-trentservice"),
    ("sts", "service-com-amazonaws-sts-awssecuritytokenservicev20110615"),
    ("cloudwatch", "service-com-amazonaws-cloudwatch-graniteserviceversion20100801"),
    ("codebuild", "service-com-amazonaws-codebuild-codebuild-20161006"),
    ("cognitoidentityprovider", "service-com-amazonaws-cognitoidentityprovider-awscognitoidentityproviderservice"),
    ("dsql", "service-com-amazonaws-dsql-dsql"),
    ("dynamodb", "service-com-amazonaws-dynamodb-dynamodb-20120810"),
    ("kinesis", "service-com-amazonaws-kinesis-kinesis-20131202"),
    ("cloudwatchlogs", "service-com-amazonaws-cloudwatchlogs-logs-20140328"),
    ("opensearch", "service-com-amazonaws-opensearch-amazonopensearchservice"),
    ("paymentcryptography", "service-com-amazonaws-paymentcryptography-paymentcryptographycontrolplane"),
    ("ecr", "service-com-amazonaws-ecr-amazonec2containerregistry-v20150921"),
    ("route53", "service-com-amazonaws-route53-awsdnsv20130401"),
    ("ses", "service-com-amazonaws-ses-simpleemailservice"),
    ("sqs", "service-com-amazonaws-sqs-amazonsqs"),
    ("s3", "service-com-amazonaws-s3-amazons3"),
    ("xray", "service-com-amazonaws-xray-awsxray"),
    ("sns", "service-com-amazonaws-sns-amazonsimplenotificationservice"),
];
