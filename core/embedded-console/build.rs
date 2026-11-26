// SPDX-License-Identifier: CC0-1.0

//! Builds every `embedded-*` service into a `wasm32-wasip3` component and
//! transpiles each one into the JS glue its console web page imports from
//! `web/jco-out-<name>/`.
//!
//! No-op unless `EMULATOR_BUILD_WEB_COMPONENTS=1`: every `embedded-*` crate
//! depends on this one in its plain `[dependencies]` (not only under the wasm
//! target), so this script would otherwise run on every native `cargo
//! check`/`cargo build` that touches any of them. Set the variable and build
//! (or re-build) this crate to regenerate `web/jco-out-*`.
//!
//! Two steps, both done without external tooling beyond `cargo` itself and a
//! WASI SDK:
//!
//! - **Build**: a plain `cargo build --release --target wasm32-wasip3`, NOT
//!   `cargo component build`. `wasm32-wasip3`'s own linker is `wasm-component-ld`
//!   (shipped inside the Rust toolchain for this target) — the artifact `cargo
//!   build` produces IS already a real Component Model binary, so there is no
//!   separate "componentize" step to run.
//! - **Transpile**: [`js_component_bindgen::transpile`] — the same engine
//!   `jco transpile`'s CLI drives — called in-process, so this needs no
//!   Node/npm at all (the bare `jco` package on npm is an unrelated
//!   dependency-confusion placeholder; nothing here resolves a package by that
//!   name).
//!
//! The one external prerequisite is `WASI_SDK_DIR`, pointing at a WASI SDK
//! release (<https://github.com/WebAssembly/wasi-sdk/releases>). Its `bin/clang`
//! carries the `wasm32-unknown-wasip{1,2,3}` compiler-rt builtins the host's own
//! `cc`/`clang` does not, which `aws-lc-sys` (pulled in transitively by
//! `vendor/server`'s HTTPS listener, in every `embedded-*` crate regardless of
//! target) needs to link. This script points `CC`/`CXX`/`AR` and
//! `BINDGEN_EXTRA_CLANG_ARGS` at that SDK for the nested `cargo build`
//! invocations below, without overriding any of those a caller already set.
//!
//! Each component is built in `target/web-components`, a `CARGO_TARGET_DIR` of
//! its own: shelling `cargo` out from inside a build script while still holding
//! the *outer* build's lock on the default `target/` deadlocks the nested
//! invocation against it.

use std::collections::HashMap;
use std::env;
use std::fs;
use std::hash::{Hash, Hasher};
use std::path::{Path, PathBuf};
use std::process::Command;

use js_component_bindgen::{transpile, AsyncMode, TranspileOpts};

/// `jco`'s own default WASI shim table (its `wasiShim` option, ON unless the CLI's
/// `--no-wasi-shim` turns it off), copied verbatim from `transpileBytes` in
/// <https://github.com/bytecodealliance/jco/blob/main/packages/jco-transpile/src/transpile.ts>.
///
/// `js_component_bindgen::transpile` leaves WASI imports as bare `wasi:...`
/// specifiers unless told otherwise — a browser's module loader then tries to
/// `fetch` that literal string as a URL and fails
/// (`GET wasi:random/random net::ERR_FAILED`). The glob key and the `#*` suffix on
/// the value both matter: `"wasi:cli/*"` matches every interface in that
/// package, and `#*` tells bindgen to bind each one as a same-named member of
/// the mapped module (`import { preopens, types } from ".../filesystem"`) rather
/// than flattening every individual function into its own top-level import —
/// which the two interfaces this package's `web/vendor/preview3-shim` modules
/// export, `preopens` and `types`, already support, and a flat per-function
/// style does not (nothing there exports a bare `getDirectories` or `Descriptor`).
///
/// The versioned (`@0.3.0`-suffixed) entries are the ones that actually match
/// these wasm32-wasip3 components; the unversioned ones are jco's own WASI
/// 0.2 defaults, copied for parity even though nothing here imports a 0.2
/// interface.
fn wasi_shim_map() -> HashMap<String, String> {
    const SUPPORTED_P3_VERSIONS: &[&str] = &["0.3.0-rc-2026-03-15", "0.3.0"];
    const P2_PACKAGES: &[&str] = &["cli", "clocks", "filesystem", "http", "io", "random", "sockets"];
    const P3_PACKAGES: &[&str] = &["cli", "clocks", "filesystem", "http", "random", "sockets"];

    let mut map = HashMap::new();
    for package in P2_PACKAGES {
        map.insert(format!("wasi:{package}/*"), format!("@bytecodealliance/preview2-shim/{package}#*"));
    }
    for version in SUPPORTED_P3_VERSIONS {
        for package in P3_PACKAGES {
            map.insert(format!("wasi:{package}/*@{version}"), format!("@bytecodealliance/preview3-shim/{package}#*"));
        }
    }
    map
}

const TRIGGER_VAR: &str = "EMULATOR_BUILD_WEB_COMPONENTS";
const WASM_TARGET: &str = "wasm32-wasip3";

/// (package name, short name) — the short name is both the `web/jco-out-<short>`
/// directory and the `aws_emulator_embedded_<short>` module name it generates.
const COMPONENTS: &[(&str, &str)] = &[
    ("aws-emulator-embedded-secretsmanager", "secretsmanager"),
    ("aws-emulator-embedded-kms", "kms"),
    ("aws-emulator-embedded-sts", "sts"),
    ("aws-emulator-embedded-iam", "iam"),
    ("aws-emulator-embedded-cloudwatch", "cloudwatch"),
    ("aws-emulator-embedded-codebuild", "codebuild"),
    ("aws-emulator-embedded-cognitoidentityprovider", "cognitoidentityprovider"),
    ("aws-emulator-embedded-dsql", "dsql"),
    ("aws-emulator-embedded-paymentcryptography", "paymentcryptography"),
    ("aws-emulator-embedded-ecr", "ecr"),
    ("aws-emulator-embedded-sqs", "sqs"),
    ("aws-emulator-embedded-xray", "xray"),
    ("aws-emulator-embedded-kinesis", "kinesis"),
    ("aws-emulator-embedded-sns", "sns"),
    ("aws-emulator-embedded-acm", "acm"),
    ("aws-emulator-embedded-route53", "route53"),
    ("aws-emulator-embedded-cloudfront", "cloudfront"),
    ("aws-emulator-embedded-s3", "s3"),
    ("aws-emulator-embedded-ses", "ses"),
    ("aws-emulator-embedded-cloudwatchlogs", "cloudwatchlogs"),
    ("aws-emulator-embedded-opensearch", "opensearch"),
    ("aws-emulator-embedded-eks", "eks"),
    ("aws-emulator-embedded-elasticloadbalancingv2", "elasticloadbalancingv2"),
    ("aws-emulator-embedded-dynamodb", "dynamodb"),
    ("aws-emulator-embedded-apigateway", "apigateway"),
    ("aws-emulator-embedded-ec2", "ec2"),
    ("aws-emulator-embedded-lambda", "lambda"),
    ("aws-emulator-embedded-sfn", "sfn"),
    ("aws-emulator-embedded-eventbridge", "eventbridge"),
    ("aws-emulator-embedded-applicationautoscaling", "applicationautoscaling"),
    ("aws-emulator-embedded-cloudformation", "cloudformation"),
    ("aws-emulator-embedded-ssm", "ssm"),
    ("aws-emulator-embedded-ecs", "ecs"),
    ("aws-emulator-embedded-scheduler", "scheduler"),
    ("aws-emulator-embedded-appconfig", "appconfig"),
    ("aws-emulator-embedded-athena", "athena"),
    ("aws-emulator-embedded-sagemaker", "sagemaker"),
    ("aws-emulator-embedded-rds", "rds"),
    ("aws-emulator-embedded-elasticache", "elasticache"),
];
// `aws-emulator-embedded-router` is deliberately NOT built here: it's a wasi:http
// SERVER that, to answer a request, makes an outgoing CLIENT call to the real
// target component — a nested async wasm call that reproducibly traps on this
// toolchain (`wasm trap: cannot enter component instance`, a wit-bindgen JSPI
// assertion failure), the same limitation that already made `embedded-console-service`'s
// relay dead code. `web/external-dispatch-bridge.js` does this same SigV4-based
// dispatch in the browser instead, calling each real component directly with no
// nesting. The crate's source stays as the authoritative reference for that mapping.

fn main() {
    println!("cargo:rerun-if-env-changed={TRIGGER_VAR}");
    if env::var(TRIGGER_VAR).as_deref() != Ok("1") {
        return;
    }

    let manifest_dir = PathBuf::from(env::var("CARGO_MANIFEST_DIR").expect("set by cargo"));
    let workspace_root = manifest_dir.parent().and_then(Path::parent).expect("core/embedded-console").to_path_buf();
    let web_dir = manifest_dir.join("web");
    let component_target_dir = workspace_root.join("target").join("web-components");

    for (_, short_name) in COMPONENTS {
        println!(
            "cargo:rerun-if-changed={}",
            workspace_root.join("core").join(format!("embedded-{short_name}")).join("src").display()
        );
    }

    let wasi_sdk = env::var("WASI_SDK_DIR").unwrap_or_else(|_| {
        panic!(
            "{TRIGGER_VAR}=1 but WASI_SDK_DIR is not set. Download a WASI SDK release \
             (https://github.com/WebAssembly/wasi-sdk/releases) and export WASI_SDK_DIR \
             to point at it — its bin/clang carries the wasm32-unknown-wasip{{1,2,3}} \
             compiler-rt builtins the host toolchain does not."
        )
    });

    // ONE combined `cargo build -p A -p B ... -p Z`, not 39 separate invocations: Cargo's
    // feature unification is computed per invocation, over exactly the packages named on
    // that command line. 39 separate single-package invocations each unify features over a
    // DIFFERENT one-package slice of the graph, so a shared dependency (tokio, hyper,
    // aws-smithy-types, ...) can genuinely resolve to a different feature set from one
    // invocation to the next even with nothing in `component_target_dir` or any source
    // file touched — which invalidates that shared dependency's fingerprint and forces
    // Cargo to recompile it again on the VERY NEXT component's invocation, cascading into
    // rebuilding most of the graph on every single component, every single run (confirmed:
    // editing one component's own wrapper-crate `src/lib.rs` — the only thing that can
    // make this script rerun at all — was observed forcing 40-120 minute full rebuilds of
    // all 39 components instead of just the one that changed). One combined invocation
    // unifies features ONCE, over the same fixed 39-package set every time this script
    // runs, so that per-dependency feature set is now STABLE across runs — only a package
    // whose own inputs actually changed needs to recompile, and Cargo's ordinary
    // fingerprinting (unrelated to `[profile.release]`'s own `incremental` setting, which
    // stays off) already skips every other one correctly once the feature set stops moving
    // under it.
    let wasm_paths = build_components(&workspace_root, &component_target_dir, &wasi_sdk, COMPONENTS);
    for (package, short_name) in COMPONENTS {
        let wasm_path = wasm_paths.get(*package).unwrap_or_else(|| panic!("no wasm path recorded for {package}"));
        strip_component(wasm_path, package);
        transpile_component(&web_dir, wasm_path, short_name);
    }
}

/// The equivalent of `wasm-tools strip --all`, in place, via `wasmparser`/`wasm-encoder`
/// directly rather than shelling out to the `wasm-tools` CLI (which this workspace does
/// not otherwise depend on at all). Drops the custom sections `[profile.release]`'s own
/// `strip = true` does not reach (`producers`, `wit-component`, `name` — measured at under
/// 10 KiB on `aws-emulator-embedded-cognitoidentityprovider`, so this is a cheap finishing
/// pass rather than where the size reduction actually comes from; that's `[profile.release]`
/// itself, in the root `Cargo.toml`). Runs after [`build_components`], before
/// [`transpile_component`] reads `wasm_path`'s bytes, so the transpiled JS glue and the
/// digest cache both see the STRIPPED component.
fn strip_component(wasm_path: &Path, package: &str) {
    let input = fs::read(wasm_path).unwrap_or_else(|err| panic!("reading {} for {package}: {err}", wasm_path.display()));
    let stripped = strip_all_custom_sections(&input)
        .unwrap_or_else(|err| panic!("stripping custom sections from {} ({package}): {err}", wasm_path.display()));
    fs::write(wasm_path, stripped).unwrap_or_else(|err| panic!("writing stripped {}: {err}", wasm_path.display()));
}

/// Re-encodes `input` (a module OR a component — this recurses into nested core modules
/// and components the same way) with every custom section (`producers`, `name`,
/// `wit-component`, anything else `wasmparser` doesn't recognise as a core section) left
/// out. Ported from `wasm-metadata`'s own `rewrite_wasm` (the engine behind `wasm-tools
/// metadata add`/`wasm-tools strip`'s actual section-copying loop), simplified down to
/// "drop every custom section unconditionally" — `rewrite_wasm` itself keeps `producers`/
/// `name` by default (only `wasm-tools strip --all` drops those too, which is the
/// behaviour wanted here), so it is not reused as-is.
///
/// `Payload::as_section()`'s own docs are what make the final loop correct: every payload
/// that denotes a WHOLE section's raw bytes (including `CodeSectionStart`, whose range
/// already spans every function body in it) returns `Some`; a payload that is part of one
/// (`Version`, `CodeSectionEntry`, `End`) returns `None` and is a no-op in that copy, which
/// is why those three are handled separately above rather than falling into it.
fn strip_all_custom_sections(input: &[u8]) -> anyhow::Result<Vec<u8>> {
    use wasm_encoder::{ComponentSectionId, Encode, RawSection, Section};
    use wasmparser::Payload::*;
    use wasmparser::{Encoding, Parser};

    let mut stack: Vec<Vec<u8>> = Vec::new();
    let mut output = Vec::new();
    for payload in Parser::new(0).parse_all(input) {
        match payload? {
            Version { encoding, .. } => {
                output.extend_from_slice(match encoding {
                    Encoding::Component => &wasm_encoder::Component::HEADER,
                    Encoding::Module => &wasm_encoder::Module::HEADER,
                });
            }
            ModuleSection { .. } | ComponentSection { .. } => {
                stack.push(std::mem::take(&mut output));
                continue;
            }
            End { .. } => {
                let Some(mut parent) = stack.pop() else { break };
                parent.push(if output.starts_with(&wasm_encoder::Component::HEADER) {
                    ComponentSectionId::Component as u8
                } else {
                    ComponentSectionId::CoreModule as u8
                });
                output.encode(&mut parent);
                output = parent;
            }
            CustomSection(_) => continue,
            other => {
                if let Some((id, range)) = other.as_section() {
                    RawSection { id, data: &input[range.start as usize..range.end as usize] }.append_to(&mut output);
                }
            }
        }
    }
    Ok(output)
}

/// Builds every `(package, _)` in `components` as a `wasm32-wasip3` component, in ONE
/// `cargo build` invocation naming all of them, into `component_target_dir` — see `main`'s
/// own comment for why one combined invocation matters here, not just 39 separate calls to
/// what this function used to be. Returns each package's resulting `.wasm` path — already a
/// Component Model binary, linked by `wasm-component-ld`, with no separate componentize step.
fn build_components(
    workspace_root: &Path,
    component_target_dir: &Path,
    wasi_sdk: &str,
    components: &[(&str, &str)],
) -> HashMap<String, PathBuf> {
    println!("cargo:warning=Building {} components for {WASM_TARGET}...", components.len());

    let cargo = env::var_os("CARGO").unwrap_or_else(|| "cargo".into());
    let mut cmd = Command::new(cargo);
    cmd.args(["build", "--release", "--target", WASM_TARGET]);
    for (package, _) in components {
        cmd.args(["-p", package]);
    }
    cmd.current_dir(workspace_root)
        .env("CARGO_TARGET_DIR", component_target_dir)
        // Nested `cargo` invocation: never re-trigger this script on embedded-console's
        // own build inside this child, or every component rebuilds every other one.
        .env_remove(TRIGGER_VAR);

    let wasi_sdk_bin = Path::new(wasi_sdk).join("bin");
    for triple in ["wasm32_wasip1", "wasm32_wasip2", "wasm32_wasip3", "wasm32_unknown_unknown"] {
        set_if_unset(&mut cmd, &format!("CC_{triple}"), wasi_sdk_bin.join("clang"));
        set_if_unset(&mut cmd, &format!("CXX_{triple}"), wasi_sdk_bin.join("clang++"));
        set_if_unset(&mut cmd, &format!("AR_{triple}"), wasi_sdk_bin.join("llvm-ar"));
    }
    set_if_unset(
        &mut cmd,
        "BINDGEN_EXTRA_CLANG_ARGS",
        format!("--sysroot={}/share/wasi-sysroot --target={WASM_TARGET}", wasi_sdk),
    );
    // `bindgen` loads `libclang` dynamically rather than driving the `clang` binary
    // above: without this, it falls back to whichever libclang the host's own
    // toolchain (e.g. Homebrew's) puts on the dynamic linker's search path, which
    // carries no wasm32 sysroot of its own and fails parsing aws-lc-sys's headers.
    set_if_unset(&mut cmd, "LIBCLANG_PATH", wasi_sdk_bin.parent().expect("bin has a parent").join("lib"));
    // `rquickjs-sys`'s own build script reads `WASI_SDK` specifically (not
    // `WASI_SDK_DIR`), and auto-downloads its own WASI SDK release when unset —
    // one with an incomplete wasm32-wasip3 sysroot (missing `stdlib.h`). Pointing
    // it at the same SDK as everything else above fixes that.
    set_if_unset(&mut cmd, "WASI_SDK", wasi_sdk);

    let status = cmd
        .status()
        .unwrap_or_else(|err| panic!("`cargo build --target {WASM_TARGET}` for {} components did not run: {err}", components.len()));
    if !status.success() {
        panic!("`cargo build --target {WASM_TARGET}` for {} components failed", components.len());
    }

    components
        .iter()
        .map(|(package, _)| {
            let wasm_name = format!("{}.wasm", package.replace('-', "_"));
            let wasm_path = component_target_dir.join(WASM_TARGET).join("release").join(&wasm_name);
            if !wasm_path.exists() {
                panic!("expected {} after a successful build, but it is missing", wasm_path.display());
            }
            (package.to_string(), wasm_path)
        })
        .collect()
}

/// Transpiles the component at `wasm_path` into `web/jco-out-<short_name>/` — skipped
/// entirely when `wasm_path`'s own CONTENT (not its mtime: Cargo re-copies a package's
/// final artifact into the target dir on every build, bumping its mtime, even for a
/// package its own fingerprinting decided needed no recompilation at all) hashes the same
/// as what was transpiled last time, recorded alongside the output as a small marker file,
/// `<module_name>.wasm.digest` — a `DefaultHasher` digest (8 bytes), not a second copy of
/// the (multi-megabyte) component itself; `target/web-components` already holds that one.
/// With 39 components built every run (`main`'s own comment covers why that's one combined
/// invocation now), re-transpiling every one of them unconditionally every run — real
/// work, done entirely in-process by `js_component_bindgen::transpile`, not free — was the
/// dominant cost left once that combined invocation stopped most of them from recompiling
/// at all.
fn transpile_component(web_dir: &Path, wasm_path: &Path, short_name: &str) {
    let module_name = format!("aws_emulator_embedded_{}", short_name.replace('-', "_"));
    let out_dir = web_dir.join(format!("jco-out-{short_name}"));
    let digest_marker = out_dir.join(format!("{module_name}.wasm.digest"));

    let component_bytes = fs::read(wasm_path)
        .unwrap_or_else(|err| panic!("reading {} for {short_name}: {err}", wasm_path.display()));
    let digest = {
        let mut hasher = std::collections::hash_map::DefaultHasher::new();
        component_bytes.hash(&mut hasher);
        hasher.finish()
    };

    if fs::read_to_string(&digest_marker).is_ok_and(|cached| cached.trim() == digest.to_string()) {
        return;
    }

    println!("cargo:warning=Transpiling {short_name}...");

    let opts = TranspileOpts {
        name: module_name,
        async_mode: Some(AsyncMode::JavaScriptPromiseIntegration { imports: Vec::new(), exports: Vec::new() }),
        map: Some(wasi_shim_map()),
        // `jco`'s own default (`noComponentErrorWrapping: opts.noComponentErrorWrapping ?? true`
        // in transpile.ts) — the Rust struct's bare `Default` leaves this `false`.
        no_component_error_wrapping: true,
        ..Default::default()
    };
    let transpiled = transpile(&component_bytes, opts)
        .unwrap_or_else(|err| panic!("transpiling {short_name} ({}): {err}", wasm_path.display()));

    if out_dir.exists() {
        fs::remove_dir_all(&out_dir).unwrap_or_else(|err| panic!("clearing {}: {err}", out_dir.display()));
    }
    for (relative_path, contents) in &transpiled.files {
        let path = out_dir.join(relative_path);
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent).unwrap_or_else(|err| panic!("creating {}: {err}", parent.display()));
        }
        fs::write(&path, contents).unwrap_or_else(|err| panic!("writing {}: {err}", path.display()));
    }
    fs::write(&digest_marker, digest.to_string())
        .unwrap_or_else(|err| panic!("writing {}: {err}", digest_marker.display()));
}

fn set_if_unset(cmd: &mut Command, key: &str, value: impl AsRef<std::ffi::OsStr>) {
    if env::var_os(key).is_none() {
        cmd.env(key, value);
    }
}
