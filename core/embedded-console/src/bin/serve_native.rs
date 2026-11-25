// SPDX-License-Identifier: CC0-1.0

//! Serves already-built `wasm32-wasip3` `embedded-*` components natively,
//! with the `wasmtime` embedding API directly -- no browser, no `wasmtime`
//! CLI subprocess. Each component gets its own loopback TCP port; port
//! assignment matches `core/embedded-router/src/wasi_http.rs`'s
//! `AUTHORITY_BY_SERVICE` table, since `embedded-router` dials those ports
//! over a genuine `wasi:http/outgoing-handler` call to forward a request to
//! the right sibling component.
//!
//! Build the components first (`cargo build --release --target wasm32-wasip3
//! -p aws-emulator-embedded-<name>`, see AGENTS.md for the required
//! `WASI_SDK_DIR` toolchain setup), then:
//!
//! ```text
//! cargo run -p aws-emulator-embedded-console --bin serve_native --features native-serve
//! ```

use std::net::SocketAddr;
use std::path::{Path, PathBuf};
use std::sync::Arc;

use bytes::Bytes;
use http_body_util::{BodyExt, Full};
use hyper::service::service_fn;
use hyper_util::rt::TokioIo;
use tokio::net::TcpListener;
use tokio::sync::Mutex;
use wasmtime::component::{Accessor, Component, Linker, ResourceTable};
use wasmtime::{Config, Engine, Store};
use wasmtime_wasi::{WasiCtx, WasiCtxView, WasiView};
use wasmtime_wasi_http::p3::Request as WasiRequest;
use wasmtime_wasi_http::p3::bindings::{Service, ServicePre};
use wasmtime_wasi_http::{WasiHttpCtx, WasiHttpCtxView, WasiHttpView};

/// (short name, loopback port) -- keep in sync with `AUTHORITY_BY_SERVICE`.
const COMPONENTS: &[(&str, u16)] = &[
    ("secretsmanager", 9401),
    ("kms", 9402),
    ("sts", 9403),
    ("iam", 9404),
    ("cloudwatch", 9405),
    ("codebuild", 9406),
    ("cognitoidentityprovider", 9407),
    ("dsql", 9408),
    ("paymentcryptography", 9409),
    ("ecr", 9410),
    ("sqs", 9411),
    ("xray", 9412),
    ("kinesis", 9413),
    ("sns", 9414),
    ("acm", 9415),
    ("route53", 9416),
    ("cloudfront", 9417),
    ("s3", 9418),
    ("ses", 9419),
    ("cloudwatchlogs", 9420),
    ("opensearch", 9421),
    ("eks", 9422),
    ("elasticloadbalancingv2", 9423),
    ("dynamodb", 9424),
    ("apigateway", 9425),
    ("ec2", 9426),
    ("lambda", 9427),
    ("sfn", 9428),
    ("eventbridge", 9429),
    ("applicationautoscaling", 9430),
    ("router", 9397),
];

#[tokio::main]
async fn main() -> wasmtime::Result<()> {
    let target_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .and_then(Path::parent)
        .expect("core/embedded-console has a workspace root")
        .join("target/wasm32-wasip3/release");

    let mut config = Config::new();
    config.wasm_component_model(true);
    config.wasm_component_model_async(true);
    let engine = Engine::new(&config)?;

    let mut tasks = Vec::new();
    for (short_name, port) in COMPONENTS {
        let wasm_path = target_dir.join(format!("aws_emulator_embedded_{short_name}.wasm"));
        let pre = load(&engine, &wasm_path)?;
        let addr = SocketAddr::from(([127, 0, 0, 1], *port));
        println!("serving {short_name} on http://{addr}/ ({})", wasm_path.display());
        tasks.push(tokio::spawn(serve(pre, addr)));
    }

    for task in tasks {
        task.await.expect("server task panicked")?;
    }
    Ok(())
}

struct Ctx {
    table: ResourceTable,
    wasi: WasiCtx,
    http: WasiHttpCtx,
    hooks: [(); 0],
}

impl WasiView for Ctx {
    fn ctx(&mut self) -> WasiCtxView<'_> {
        WasiCtxView { ctx: &mut self.wasi, table: &mut self.table }
    }
}

impl WasiHttpView for Ctx {
    fn http(&mut self) -> WasiHttpCtxView<'_> {
        WasiHttpCtxView { ctx: &mut self.http, table: &mut self.table, hooks: &mut self.hooks }
    }
}

fn new_store(engine: &Engine) -> Store<Ctx> {
    Store::new(
        engine,
        Ctx {
            table: ResourceTable::default(),
            // Without this, the guest sees no `EMULATOR_TELEMETRY` env var at all (its host
            // never passed one through) and falls back to its own default-enabled posture,
            // trying a real outbound telemetry call this sandbox can't reach -- which hangs
            // every request behind it on `wasmtime-wasi-http`'s 600s default timeout.
            wasi: WasiCtx::builder().inherit_stdio().env("EMULATOR_TELEMETRY", "off").build(),
            http: WasiHttpCtx::new(),
            hooks: [],
        },
    )
}

/// Compiles `wasm_path` and links every interface the `embedded_service!`
/// macro's `#[wstd::http_server]` export needs: WASI 0.2 (filesystem,
/// sockets -- still p2 in this toolchain) plus WASI 0.3 clocks/random/cli/http.
fn load(engine: &Engine, wasm_path: &Path) -> wasmtime::Result<ServicePre<Ctx>> {
    let component = Component::from_file(engine, wasm_path)?;
    let mut linker = Linker::new(engine);
    wasmtime_wasi::p2::add_to_linker_async(&mut linker)?;
    wasmtime_wasi::p3::add_to_linker(&mut linker)?;
    wasmtime_wasi_http::p3::add_to_linker(&mut linker)?;
    let pre = linker.instantiate_pre(&component)?;
    ServicePre::new(pre)
}

/// One persistent wasm instance per component, reused for every request it
/// serves. The `embedded_service!` macro keeps the service's `InMemoryEngine`
/// behind a `OnceLock` *inside the guest's own linear memory* (see its doc
/// comment) -- a fresh instance per request would mean a fresh, empty engine
/// per request, so e.g. a `CreateTable` and the `DescribeTable` polls that
/// follow it would never see each other's state. Requests are serialized
/// through the `Mutex`: correctness over throughput for this runner's scope.
struct Instance {
    store: Mutex<Store<Ctx>>,
    service: Service,
}

async fn serve(pre: ServicePre<Ctx>, addr: SocketAddr) -> wasmtime::Result<()> {
    let engine = pre.engine().clone();
    let mut store = new_store(&engine);
    let service = pre.instantiate_async(&mut store).await?;
    let instance = Arc::new(Instance { store: Mutex::new(store), service });

    let listener = TcpListener::bind(addr).await?;
    loop {
        let (stream, _) = listener.accept().await?;
        let instance = instance.clone();
        tokio::spawn(async move {
            let io = TokioIo::new(stream);
            let result = hyper::server::conn::http1::Builder::new()
                .serve_connection(io, service_fn(move |req| handle(instance.clone(), req)))
                .await;
            if let Err(err) = result {
                eprintln!("connection error: {err:#}");
            }
        });
    }
}

async fn handle(
    instance: Arc<Instance>,
    req: hyper::Request<hyper::body::Incoming>,
) -> Result<hyper::Response<Full<Bytes>>, hyper::Error> {
    let (parts, body) = req.into_parts();
    let body_bytes = body.collect().await?.to_bytes();
    let body = Full::new(body_bytes).map_err(|never: std::convert::Infallible| -> wasmtime_wasi_http::Error { match never {} });
    let req = http::Request::from_parts(parts, body);

    let mut store = instance.store.lock().await;
    let (wasi_req, io) = WasiRequest::from_http(&mut store.data_mut().hooks, req);

    // The guest response body is a live stream backed by this `Store`'s component-model-async
    // machinery: it must be drained to plain `Bytes` *inside* `run_concurrent`'s accessor
    // context, same as the request, not after -- awaiting it on the outer executor stalls
    // forever since nothing is left driving the guest's async tasks forward.
    let service = &instance.service;
    let outcome: wasmtime::Result<wasmtime::Result<(Option<(http::response::Parts, Bytes)>, Option<()>)>> = store
        .run_concurrent(async move |store| {
            let answer = answer_request(store, service, wasi_req);
            let drain = async { wasmtime::Result::<Option<()>>::Ok(io.await.ok()) };
            futures::try_join!(answer, drain)
        })
        .await;

    let (parts, body_bytes) = match outcome {
        Ok(Ok((Some(res), _))) => res,
        Ok(Ok((None, _))) => return Ok(error_response("guest returned an HTTP error")),
        Ok(Err(err)) => return Ok(error_response(&format!("guest trapped: {err:#}"))),
        Err(err) => return Ok(error_response(&format!("concurrent task failed: {err:#}"))),
    };
    Ok(hyper::Response::from_parts(parts, Full::new(body_bytes)))
}

/// Calls `service.handle` and converts a successful guest response into plain
/// `(parts, bytes)`, or `None` for a `wasi:http` protocol-level error (the
/// guest never got the chance to answer; distinct from a guest-produced 5xx).
async fn answer_request(
    store: &Accessor<Ctx>,
    service: &Service,
    wasi_req: WasiRequest,
) -> wasmtime::Result<Option<(http::response::Parts, Bytes)>> {
    match service.handle(store, wasi_req).await? {
        Ok(res) => {
            let res = store.with(|store| res.into_http(store, async { Ok(()) }))?;
            let (parts, body) = res.into_parts();
            let body_bytes = body.collect().await.map_err(|err| wasmtime::format_err!("{err:#}"))?.to_bytes();
            Ok(Some((parts, body_bytes)))
        }
        Err(_) => Ok(None),
    }
}

fn error_response(message: &str) -> hyper::Response<Full<Bytes>> {
    eprintln!("{message}");
    hyper::Response::builder()
        .status(hyper::StatusCode::BAD_GATEWAY)
        .body(Full::new(Bytes::from(message.to_string())))
        .expect("a well-formed error response")
}
