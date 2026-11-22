// SPDX-License-Identifier: CC0-1.0

/// Services whose `embedded-*` crate needs nothing but the
/// `embedded_console::embedded_service!` macro: one registered service, no
/// `wasi:http/outgoing-handler` fallback, no extra internal-only routes.
///
/// `embedded-iam`, `embedded-secretsmanager` and `embedded-console-service` each
/// need one of those extras, so they are not in this list and keep their own
/// hand-written `Cargo.toml`/`lib.rs` instead of a generated one.
///
/// (short name, full package name of the service crate it wraps). Everything
/// else about the crate — its own package name, module path, dependency line —
/// is mechanical from these two.
#[allow(dead_code)]
const SIMPLE_EMBEDDED_COMPONENTS: &[(&str, &str)] = &[
    ("budgets", "service-com-amazonaws-budgets-awsbudgetservicegateway"),
    ("codeguruprofiler", "service-com-amazonaws-codeguruprofiler-codeguruprofiler"),
    ("dlm", "service-com-amazonaws-dlm-dlm-20180112"),
    ("glacier", "service-com-amazonaws-glacier-glacier"),
    ("kms", "service-com-amazonaws-kms-trentservice"),
    ("route53domains", "service-com-amazonaws-route53domains-route53domains-v20140515"),
    ("sts", "service-com-amazonaws-sts-awssecuritytokenservicev20110615"),
];
