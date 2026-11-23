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
    ("aws-emulator-embedded-router", "router"),
];

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

    for (package, short_name) in COMPONENTS {
        let wasm_path = build_component(&workspace_root, &component_target_dir, &wasi_sdk, package);
        transpile_component(&web_dir, &wasm_path, short_name);
    }
}

/// Builds `package` as a `wasm32-wasip3` component into `component_target_dir`
/// and returns the path to the resulting `.wasm` — already a Component Model
/// binary, linked by `wasm-component-ld`, with no separate componentize step.
fn build_component(workspace_root: &Path, component_target_dir: &Path, wasi_sdk: &str, package: &str) -> PathBuf {
    println!("cargo:warning=Building {package} for {WASM_TARGET}...");

    let cargo = env::var_os("CARGO").unwrap_or_else(|| "cargo".into());
    let mut cmd = Command::new(cargo);
    cmd.args(["build", "--release", "--target", WASM_TARGET, "-p", package])
        .current_dir(workspace_root)
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

    let status = cmd.status().unwrap_or_else(|err| panic!("`cargo build -p {package}` did not run: {err}"));
    if !status.success() {
        panic!("`cargo build -p {package} --target {WASM_TARGET}` failed");
    }

    let wasm_name = format!("{}.wasm", package.replace('-', "_"));
    let wasm_path = component_target_dir.join(WASM_TARGET).join("release").join(&wasm_name);
    if !wasm_path.exists() {
        panic!("expected {} after a successful build, but it is missing", wasm_path.display());
    }
    wasm_path
}

/// Transpiles the component at `wasm_path` into `web/jco-out-<short_name>/`.
fn transpile_component(web_dir: &Path, wasm_path: &Path, short_name: &str) {
    println!("cargo:warning=Transpiling {short_name}...");

    let module_name = format!("aws_emulator_embedded_{}", short_name.replace('-', "_"));
    let out_dir = web_dir.join(format!("jco-out-{short_name}"));

    let component_bytes = fs::read(wasm_path)
        .unwrap_or_else(|err| panic!("reading {} for {short_name}: {err}", wasm_path.display()));

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
}

fn set_if_unset(cmd: &mut Command, key: &str, value: impl AsRef<std::ffi::OsStr>) {
    if env::var_os(key).is_none() {
        cmd.env(key, value);
    }
}
