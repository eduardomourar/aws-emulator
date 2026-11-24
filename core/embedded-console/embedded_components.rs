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
/// `lambda` through `glue`'s own `[build-dependencies]`), and `eventbridge`
/// itself (hence `ec2`, which depends on it).
///
/// `apigateway`/`cloudfront`/`eks`/`elasticloadbalancingv2` were ONCE assumed
/// blocked the same way `acm` was (each depends on `hyper`'s `server`
/// feature unconditionally, backing a REAL HTTP listener each runs
/// natively — an EKS webhook, an ALB listener, a CloudFront edge-function
/// endpoint, an API Gateway custom domain socket). That assumption turned
/// out to be WRONG for `acm`, confirmed by actually testing a
/// `wasm32-wasip3` build rather than reasoning about `hyper`'s `Cargo.toml`
/// features alone: `hyper`'s `server`/`http1` features compile clean for
/// `wasm32-wasip3` as a generic protocol library (they operate over any
/// `AsyncRead + AsyncWrite`, not a raw OS socket), and `vendor/server`
/// already ships a `wasm32`-only `listeners_wasm.rs` — built specifically
/// for this experiment — that stubs every `Listeners` method
/// (`tcp`/`tcp_plaintext`/`http`/...) to immediately return
/// `Err(SurfaceError::Bind(...))` rather than compile-failing or trying to
/// bind a socket that cannot exist in a browser. `acm`'s own
/// `state::acme_socket::ensure_acme_socket` already propagates that refusal
/// to `None` (its one caller, `ops/create_acme_endpoint.rs`, already
/// discards the return value entirely), so `acm` needed ZERO Rust source
/// changes — only the same `Cargo.toml` `tokio`-feature-gating fixes used
/// throughout this list. `cloudfront` is ALSO confirmed fixed the same way
/// (see below — its real blocker turned out to be unrelated to `hyper`
/// entirely). `apigatewayv2`/`apigateway-backplanecontrolservice` are
/// confirmed GENUINELY blocked, but for a reason that has nothing to do
/// with `hyper` either: both depend on `boon` (JSON Schema validation, for
/// request validators), which depends on `ahash` with ahash's OWN default
/// features (`boon`'s `Cargo.toml` declares plain `ahash = "0.8.3"`, no
/// `default-features = false`) — and ahash's default `runtime-rng` feature
/// needs `getrandom`, which resolves to `getrandom 0.3.4` here, a version
/// with no `wasm32-wasip3` support (confirmed: no relevant feature flag in
/// its own `Cargo.toml`; `wasm_js` is for `wasm32-unknown-unknown`, not
/// WASI). Cargo's feature unification is additive-only, so nothing in
/// *our* `Cargo.toml` can strip `ahash`'s default features back off once
/// `boon` has asked for them; fixing this would mean forking `boon` or
/// `[patch]`-ing `ahash` workspace-wide, neither attempted. `eks` and
/// `elasticloadbalancingv2` ARE now confirmed fixed under the corrected
/// `hyper`/listener understanding: `eks` (and its
/// `service-com-amazonaws-eksauth-eksauthfrontend` dependency) needed only
/// the standard `tokio` ADDS-not-replaces split. `elasticloadbalancingv2`
/// needed that same split plus its own instance of `dynamodb`'s
/// `getrandom`-via-`rand` problem: its direct `rand = "0.9"` dependency hit
/// the same unsupported `getrandom 0.3.4`, fixed the same way by bumping to
/// `rand = "0.10"` — which also means porting the one call site
/// (`src/service/access_logs.rs`'s `unique_field`) off the `random_range`
/// method `rand = "0.9"`'s `Rng` trait had: `rand = "0.10"` moved that
/// method onto a new `RngExt` trait instead (`use rand::Rng as _;` ->
/// `use rand::RngExt as _;`, no call-site change needed beyond the import).
///
/// The `elasticloadbalancingv2` entry below wraps a DIFFERENT crate than its
/// name suggests: `service-com-amazonaws-elasticloadbalancing-elasticloadbalancing-v7`
/// (the CLASSIC Elastic Load Balancing model), not
/// `service-com-amazonaws-elasticloadbalancingv2-elasticloadbalancing-v10`
/// directly. Found by testing end to end, not by reasoning about the model
/// alone: an AWS SDK ELBv2 client signs its SigV4 credential scope as
/// `elasticloadbalancing` (confirmed both in the v2 model's own
/// `aws.auth#sigv4` trait and in `@aws-sdk/client-elastic-load-balancing-v2`'s
/// `httpAuthSchemeProvider.js`), the SAME signing name the classic model
/// publishes — not `elasticloadbalancingv2`, which is a routing key internal
/// to the v2 crate's own `can_handle` override
/// (`src/service/service.rs`'s `ROUTE_KEY`), used only for addressing that
/// model DIRECTLY without going through the shared front door. Only the
/// CLASSIC crate's `can_handle` claims the real `elasticloadbalancing`
/// signing name; it then dispatches a `Version=2015-12-01` envelope to the
/// v2 model in-process via `src/service/api_version.rs`'s `serving_model`
/// (both crates share one engine). Embedding the v2 crate alone — this
/// experiment's first attempt — left every real SDK call unclaimed: the
/// wasm component answered `404 UnknownService` ("no emulated service is
/// registered for 'elasticloadbalancing'") for every request, confirmed via
/// Playwright against the live embedded build, not assumed. The CLASSIC
/// crate needed the same `tokio` ADDS-not-replaces split and the same
/// `rand = "0.9"` -> `"0.10"` bump as the v2 crate (used only via the free
/// function `rand::random::<f64>()` in `src/service/data_plane.rs`, which
/// rand 0.10 did NOT move off the top-level module, so no `RngExt` import
/// change was needed there).
///
/// `rds` and `elasticache` are deferred for the same reason as `dsql`,
/// confirmed by reading their source: each runs a REAL wire-protocol TCP
/// server as its data plane (`rds`'s
/// `src/state/data_plane/{pg,mysql}_server.rs`, `elasticache`'s
/// `src/state/cache_data_plane/resp_wire.rs`) that a real database/cache
/// client connects to over a plain `tokio::net` socket, not through
/// `vendor/server`'s `Listeners` abstraction at all — so the wasm stub
/// above does not save them. Opening a raw TCP socket is not something a
/// browser can do at all, regardless of what's injected into it.
///
/// `dsql`, `kinesis`, `paymentcryptography`, `ecr`, `route53`, `acm`,
/// `cloudfront`, `ses`, `sqs`, `s3` and `xray` all carry the same wasm-safe
/// `tokio` split every other entry here does. Of those, `dsql`, `kinesis`,
/// `paymentcryptography`, `ecr`, `sqs`, `xray`, `route53`, `acm`,
/// `cloudfront`, `s3` and `ses` are confirmed building and transpiling for
/// `wasm32-wasip3` and are in `build.rs`'s `COMPONENTS`. `ses` has NO Floci
/// UI wiring despite building clean: Floci's only `ses`-related adapter,
/// `AwsSesAdapter` for the catalog key `email` (displayed as "SES Mailbox"),
/// does not take an AWS SDK SES client at all — its constructor is
/// `(endpoint = cloudEndpoint('aws'), fetcher = globalThis.fetch)` and its
/// `list()` calls `fetchInbox()` then parses with `postal-mime`, a
/// completely different feature (polling and parsing raw email messages)
/// from the standard SigV4-signed SES API this crate implements. There is
/// no sensible adapter to wire this component's `wasi:http` handler into.
///
/// `cloudfront` was ONCE assumed permanently blocked: it has a REAL direct
/// dependency on `rquickjs` (likely for CloudFront Functions JS execution),
/// and `rquickjs-sys` was assumed to lack `wasm32-wasip3` support entirely.
/// Testing it directly (rather than trusting that assumption, the same
/// mistake made about `hyper` above) found TWO narrower, fixable causes
/// instead: (1) `rquickjs-sys`'s own `build.rs` reads an env var named
/// `WASI_SDK` (not `WASI_SDK_DIR`, which every other wasm32 C dependency in
/// this workspace keys off and which `build.rs` here already sets) and,
/// finding it unset, auto-downloads its OWN WASI SDK release (v24.0) whose
/// `wasm32-wasip3` sysroot is incomplete (`fatal error: 'stdlib.h' file not
/// found` compiling quickjs's own C sources) — `build.rs`'s
/// `build_component` now also sets `WASI_SDK` to the same SDK directory.
/// (2) with that fixed, the C half compiles, but `rquickjs-sys` ships no
/// PRE-GENERATED Rust bindings file for `wasm32-wasip3` (only
/// `wasm32-wasip1`) and refuses to build rather than guess — its own
/// warning names the fix: `rquickjs`'s `"bindgen"` feature (which forwards
/// to `rquickjs-sys/bindgen`) generates bindings at build time instead of
/// `include!`-ing a missing prebuilt file. `cloudfront`'s own
/// `Cargo.toml` now declares `rquickjs = { version = "0.14", features =
/// ["bindgen"] }` for this. Once both were fixed, cloudfront's only
/// remaining blocker was the familiar `tokio` feature-gating pattern,
/// in itself and in `service-com-amazonaws-servicequotas-servicequotasv20190624`
/// (reached transitively), both fixed the same way as everywhere else.
///
/// Because `dynamodb`, `s3`, `ses`, `opensearch` and `cloudwatchlogs` all
/// reach `rquickjs` ONLY via a real dependency on `cloudfront` (`dynamodb`
/// -> `s3` -> `cloudfront` -> `rquickjs`, confirmed via `cargo tree -e
/// normal,build -i rquickjs-sys`), `cloudfront` being fixed reopened the
/// question for all of them. `s3` is confirmed fixed, needing only its own
/// ADDS-not-replaces `tokio` bug fixed. `ses` is also confirmed fixed —
/// needed the same `tokio` split in itself AND in two crates reached
/// through its own dependency on WorkMail
/// (`service-com-amazonaws-workmail-workmailservice` and
/// `-workmailmessageflow-giraffemessageintransitservice`, both completely
/// unsplit `tokio = { workspace = true }`), plus its own
/// `aws-sdk-s3`/`-kms`/`-lambda`/`-sns` clients' unconditional `"rt-tokio"`
/// feature (same fix as `ecr`/`kinesis`/`xray`). `dynamodb` specifically
/// also has its OWN, separate, GENUINE blocker, distinct from `rquickjs`:
/// its direct `rand = "0.9"` dependency resolves `rand_core 0.9.5`, which
/// pulls `getrandom 0.3.4` — the exact same no-`wasm32-wasip3`-support
/// version `apigateway`'s `boon` chain hits above. This is now FIXED: bumped
/// to `rand = "0.10"` (whose `rand_core` pulls the newer,
/// `wasm32-wasip3`-compatible `getrandom 0.4.x` instead), and the one call
/// site ported off `rand::Rng::random_range` onto `rand::RngExt::random_range`
/// (rand 0.10 moved that method to a new extension trait — same migration
/// `elasticloadbalancingv2` needed, see below). That tokio bump also surfaced
/// the standard ADDS-not-replaces `tokio` bug in `dynamodb` itself and in two
/// of its own workspace dependencies
/// (`service-com-amazonaws-dynamodbstreams-dynamodbstreams-20120810` and
/// `service-com-amazonaws-account-account`), fixed the same way everywhere
/// else is. `opensearch` and `cloudwatchlogs` are confirmed fixed too (see
/// `SIMPLE_EMBEDDED_COMPONENTS` below), needing only their own `tokio` splits.
///
/// `apigateway`'s `boon`/`ahash`/`getrandom` chain above is ALSO now fixed,
/// for a reason narrower than forking `boon` or workspace-wide `[patch]`ing
/// `ahash`: `ahash` shipped `0.8.13` after the original finding, adding its
/// own `[target.'cfg(target_arch = "wasm32")'.dependencies]` override that
/// pulls `wasm32-wasip3`-capable `getrandom 0.4` instead of `0.3.4`; `boon`'s
/// own loose `ahash = "^0.8.3"` constraint already allows resolving to
/// `0.8.13`, so `cargo update -p ahash --precise 0.8.13` fixed the whole
/// chain with no `Cargo.toml` edit and no behavior change. `apigatewayv2`
/// also needed the standard `tokio` fix (in itself and in its own dependency
/// `service-com-amazonaws-apigatewaymanagementapi-apigatewaymanagementapi`)
/// plus a source-level fix: `src/service/invoke.rs`'s `drivable_runtime`/
/// `awaited` pair referenced `tokio::runtime::RuntimeFlavor::MultiThread`/
/// `tokio::task::block_in_place`, both gated behind tokio's non-wasm-safe
/// `rt-multi-thread` feature — cfg-split so the `wasm32` build reports "no
/// drivable runtime" directly (always true there, since wasm32 has no OS
/// threads) instead of naming either item. `apigateway-backplanecontrolservice`
/// needed the same `tokio`/`rt-tokio`(`aws-sdk-s3`)/`block_in_place` fixes
/// (independently, in its own `src/service/invoke/browser_invoke.rs`) plus
/// its own `rand = "0.9"` -> `"0.10"` + `Rng` -> `RngExt` migration (used in
/// `src/state/identifier.rs`'s `drawn_id`) — the same genuine, boon-unrelated
/// `getrandom` blocker `dynamodb` hit, independently.
///
/// `route53` was ONCE mistakenly deferred too, for an entanglement with
/// `cloudfront` that turned out to be a FALSE POSITIVE: an earlier `cargo
/// tree` check that didn't restrict edge kinds picked up `route53`'s
/// `[dev-dependencies]` on `service-com-amazonaws-s3-amazons3` (TEST-ONLY,
/// nothing in `route53`'s own `src/` reaches it) as if it were a real
/// dependency. Restricting to `-e normal,build` shows zero `rquickjs`/
/// `cloudfront` reachability. `route53` only needed the same
/// `tokio`-feature-gating fix as everything else, plus the SAME fix,
/// discovered transitively while fixing `acm` (which has a real dependency
/// on `route53`), for three more crates reachable through it: `ebs` and
/// `rbin` (both just `tokio = { workspace = true }`, completely unsplit)
/// and `ec2` (reached via `route53`'s real dependency on it; its own
/// `aws-sdk-acm`/`aws-sdk-kms` carried the unconditional `"rt-tokio"`
/// feature, same fix as below). `ebs` separately needed its OWN
/// `aws-sdk-kms` fixed the same way.
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
    ("acm", "service-com-amazonaws-acm-certificatemanager"),
    ("cloudfront", "service-com-amazonaws-cloudfront-cloudfront2020-05-31"),
    ("ses", "service-com-amazonaws-ses-simpleemailservice"),
    ("sqs", "service-com-amazonaws-sqs-amazonsqs"),
    ("s3", "service-com-amazonaws-s3-amazons3"),
    ("xray", "service-com-amazonaws-xray-awsxray"),
    ("sns", "service-com-amazonaws-sns-amazonsimplenotificationservice"),
    ("eks", "service-com-amazonaws-eks-awswesleyfrontend"),
    ("elasticloadbalancingv2", "service-com-amazonaws-elasticloadbalancing-elasticloadbalancing-v7"),
    ("apigateway", "service-com-amazonaws-apigateway-backplanecontrolservice"),
];
