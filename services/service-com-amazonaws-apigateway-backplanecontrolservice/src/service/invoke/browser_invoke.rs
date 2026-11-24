// SPDX-License-Identifier: CC0-1.0

//! The invoke a BROWSER sent from ANOTHER SITE: which ones a deployed stage answers, and how
//! this plane answers them.
//!
//! A deployed stage is a public HTTP endpoint, and a page a browser loaded from another origin
//! is one of its clients: the browser asks the endpoint first (the `OPTIONS` preflight it
//! sends before a cross-origin call), then sends the real request, and decides from the
//! `Access-Control-*` headers the answers carry whether the page may read them. A REST API
//! declares nothing about origins of its own, so the CORS contract of one is entirely the
//! methods the developer deployed and the header values their responses map.
//!
//! The emulator's front door refuses a request whose browser-set headers say a browser sent it
//! from another site, so a page the developer visits cannot drive this emulator, and it applies
//! that rule to every request it NAMES AN OPERATION for — after the operation is named and
//! before it is run, with no seam a service can admit one through. The data plane is named as
//! an operation ([`crate::service`]) because an integration is a call into another service and
//! only the router's context carries the transport for it, so EVERY cross-origin invoke was
//! refused `403`, the preflight included, which leaves a browser unable to make any
//! cross-origin call to an emulated API.
//!
//! What this module admits, and what it withholds, is therefore narrow on purpose:
//!
//! * ADMITTED only where the api's own deployed records ADMIT the request and ANSWER IT BY
//!   THEMSELVES ([`admitted_by_the_records`]). The method that would serve it must DECLARE the
//!   request's origin — a static `Access-Control-Allow-Origin` mapping on a response it serves,
//!   naming the wildcard or that exact origin, which is a statement made through the CONTROL
//!   plane that no browser reaches, so the api's owner has said whose pages its answers are for
//!   — and serving it must perform no call outside this service: a `MOCK` integration, the
//!   integration a CORS method is wired to, whose answer is the request template that selects a
//!   status, the integration response that maps it and that response's own template. A method
//!   whose integration names a BACKEND (a function, another emulated service, an HTTP upstream)
//!   is never admitted, and neither is a page from an origin no declaration names: both are
//!   left to the front door, which refuses them exactly as it did before this seam existed.
//!   The one request admitted without a declaration is one NO deployed method serves, because
//!   what answers it is the stage's own refusal, which performs nothing — and the endpoint's
//!   recorded behaviour is that it answers such a preflight (`403` `Missing Authentication
//!   Token`), which is how a browser tells a resource that declines a preflight from one that
//!   answers it.
//! * SERVED over a transport that REACHES NOTHING ([`contained_transport`]). The seam that
//!   answers such a request is handed no request context, so there is no transport to perform an
//!   onward call over, and this module deliberately builds none that could: the handle the
//!   serving is given is onto an emulator with no service mounted. So even a step that would
//!   reach for one — an authorizer's decision, the stage's log delivery — reaches nothing, and
//!   the answer is the api's own records and nothing else.
//!
//! The admission is the API's own, not the operator's, because the operator has no say to
//! consult: the front door's check is fixed at same-origin-only, the emulator's command line
//! parses no cross-origin option, and nothing in this tree resolves one. Where a browser-facing
//! data plane of this emulator does admit a page, it is the RESOURCE's own declaration that
//! admits it (a function URL's `Cors$AllowOrigins`, over the same core reading of a browser's
//! headers), and that is the rule this follows.

use std::sync::Arc;

use ::smithy_server_runtime::{MultiServiceRouter, ServiceIdentity};

use super::*;

/// The response header whose mapping is a method's statement about which origins its answers
/// are for: `Access-Control-Allow-Origin`, the header a browser reads a cross-origin answer's
/// admission from.
const ALLOW_ORIGIN_HEADER: &str = "Access-Control-Allow-Origin";

/// The `Access-Control-Allow-Origin` value that names every origin.
const EVERY_ORIGIN: &str = "*";

/// The `Origin` a document with no site of its own sends — a sandboxed frame, a `file://` page,
/// some redirects. It names no site, so no declaration names it.
const OPAQUE_ORIGIN: &str = "null";

/// Whether this plane answers `req` from the seam that runs ahead of the front door's
/// cross-site refusal: a request a browser sent from another site, addressed to a deployed
/// stage this plane serves, that the api's own deployed records ADMIT AND ANSWER BY THEMSELVES.
///
/// Asked by BOTH seams in [`crate::service`] — the one that leaves such a request unnamed and
/// the one that answers it — so the request the front door never refuses is exactly the request
/// this plane serves, and neither seam can drift from the other.
pub fn claims_a_cross_origin_browser_request<Eng: Send + Sync + 'static>(
    engine: &Eng,
    req: &RtRequest,
) -> bool {
    refused_by_the_front_door(req)
        && claims_request(engine, req)
        && admitted_by_the_records(engine, req)
}

/// Whether the FRONT DOOR refuses this request before a named operation of this service is
/// reached, because its browser-set headers say a browser sent it from another site.
///
/// The router applies that check to every request it NAMES AN OPERATION for, and to no request
/// it does not, with the same reading this calls
/// (`emulator_server::classify_browser_request` over same-origin-only). So the request this
/// answers `true` for is exactly the one that reaches no operation of this service at all.
fn refused_by_the_front_door(req: &RtRequest) -> bool {
    let header = |name: &str| req.headers().get(name);
    matches!(
        ::emulator_server::classify_browser_request(
            header("origin"),
            header("sec-fetch-site"),
            &::emulator_server::RemoteOrigins::SameOriginOnly,
            false,
        ),
        ::emulator_server::BrowserVerdict::Forbid(_)
    )
}

/// Whether the api's own DEPLOYED records admit `req` and answer it by themselves.
///
/// The records read are the ones that answer the request — the api this endpoint resolves to,
/// the deployment its stage serves, the resource path that matches most specifically and the
/// method that serves the verb — through this plane's own resolution, so the method this asks
/// about is the method that then answers. Two things must hold of that method:
///
/// 1. it DECLARES the request's origin: a static `Access-Control-Allow-Origin` mapping on a
///    response it serves, naming the wildcard or that exact origin
///    ([`declared_allow_origins`]). That declaration is a statement made through the CONTROL
///    plane, which no browser reaches, so the api's owner has said which origins' pages its
///    answers are for — the same question a function URL's own address asks of its
///    `Cors$AllowOrigins`;
/// 2. serving it performs no call to anything outside this service
///    ([`performs_no_onward_call`]).
///
/// A request NO deployed method serves is admitted whatever the api declares, because what
/// answers it is the stage's own refusal — nothing is performed for it, and the endpoint's
/// recorded behaviour is that it answers such a preflight (`403` `Missing Authentication
/// Token`), which is how a browser tells a resource that declines a preflight from one that
/// answers it.
fn admitted_by_the_records<Eng: Send + Sync + 'static>(engine: &Eng, req: &RtRequest) -> bool {
    let Some(state) = crate::state::service_state(engine) else {
        return false;
    };
    let store = state.lock();
    let Some(resolved) = resolve(&store, &Addressed::of_request(req)) else {
        return false;
    };
    let Some(method) = served_by(&resolved, req) else {
        // No deployed method: what answers it is the stage's own refusal, which performs
        // nothing at all.
        return true;
    };
    performs_no_onward_call(Some(method)) && declares_the_requests_origin(method, req)
}

/// The DEPLOYED method that would serve `req` of the api `resolved` names, or `None` when the
/// request names no deployed stage, no matching resource path or no method for its verb — each
/// of which the stage answers with a refusal of its own rather than with a method's response.
fn served_by<'s>(resolved: &Resolved<'s, '_>, req: &RtRequest) -> Option<&'s MethodEntry> {
    let (stage_name, resource_path) = split_stage(resolved.invoke_path)?;
    let deployment = resolved
        .api
        .stages
        .get(stage_name)
        .and_then(|stage| resolved.api.deployments.get(&stage.deployment_id))?;
    let matched_path = match_resource_path(deployment, &resource_path)?;
    let (verb, _) = match_method(deployment, matched_path, req.method())?;
    deployment
        .resources
        .values()
        .find(|resource| resource.path == matched_path)
        .and_then(|resource| resource.methods.get(verb))
}

/// Whether `method` declares the origin `req` was sent from: one of the origins its served
/// `Access-Control-Allow-Origin` mappings name ([`declared_allow_origins`]), either the wildcard
/// or that exact origin, compared as an origin is — by the whole scheme, host and port.
///
/// A request carrying no `Origin` names no origin to declare, and the opaque origin a sandboxed
/// document sends ([`OPAQUE_ORIGIN`]) is no site's, so neither is admitted by a declaration:
/// what a wildcard admits is a page loaded from some site.
fn declares_the_requests_origin(method: &MethodEntry, req: &RtRequest) -> bool {
    let Some(origin) = req.headers().get(::http::header::ORIGIN.as_str()) else {
        return false;
    };
    if origin == OPAQUE_ORIGIN {
        return false;
    }
    declared_allow_origins(method)
        .iter()
        .any(|declared| *declared == EVERY_ORIGIN || *declared == origin)
}

/// The origins `method` declares its answers are for: the static literal of every
/// `Access-Control-Allow-Origin` response-header mapping the method SERVES.
///
/// A header is served only where the integration response maps it AND the method response of
/// the same status declares it, which is the pair [`super::mapped_response_headers`] sends a
/// mapped header on — so the declaration read here is the one a caller would be answered with,
/// never a mapping that reaches no response. The literal is read through this service's one
/// reading of a static mapping (`static_mapping_literal`); a mapping that names a value of the
/// call instead of a literal declares no origin, because what it resolves to is not knowable
/// before the call is served.
fn declared_allow_origins(method: &MethodEntry) -> Vec<&str> {
    let mut declared = Vec::new();
    let Some(integration) = method.integration.as_ref() else {
        return declared;
    };
    for (status, response) in integration.integration_responses.iter().flatten() {
        let Some(mapped) = response.response_parameters.as_ref() else {
            continue;
        };
        let by_the_method = method
            .method_responses
            .get(status)
            .and_then(|response| response.response_parameters.as_ref());
        for (key, value) in mapped {
            let Some(name) = key.strip_prefix(METHOD_RESPONSE_HEADER_PREFIX) else {
                continue;
            };
            if !name.eq_ignore_ascii_case(ALLOW_ORIGIN_HEADER) {
                continue;
            }
            if by_the_method.is_none_or(|declared| !declared.contains_key(key)) {
                continue;
            }
            if let Some(literal) = static_mapping_literal(value) {
                declared.push(literal);
            }
        }
    }
    declared
}

/// Whether serving `method` reaches nothing outside this service: a `MOCK` integration, whose
/// answer is the api's own records (the request template that selects a status, the integration
/// response that maps it and its template), or no integration at all, which the stage answers
/// with the configuration-error class without performing anything.
///
/// `None` is a verb no deployed method serves, answered by the stage's own refusal — nothing is
/// performed for it either.
fn performs_no_onward_call(method: Option<&MethodEntry>) -> bool {
    let Some(method) = method else {
        return true;
    };
    match method.integration.as_ref() {
        None => true,
        Some(integration) => integration.r#type.as_deref() == Some(MOCK_INTEGRATION_TYPE),
    }
}

/// [`super::serve`] from the seam that answers a cross-origin browser request, which carries NO
/// request context: every step is the same — the resolution, the authorization, the matched
/// method, its integration response, its template and its header mappings — and the one
/// difference is that the transport it is served over reaches nothing
/// ([`contained_transport`]), so the answer is the api's own records and nothing beyond them.
///
/// `identity` is this service's own vended identity, which the context the invoke is served
/// under names — the service's, not the request's, so it is the same identity a named invoke's
/// context carries.
///
/// An invoke this seam cannot serve at all — one on a runtime that cannot drive it, or one
/// arriving while it is already serving as many as it serves at once — is answered as a method
/// whose configuration could not serve the call, with the reason logged.
pub fn serve_without_transport<Eng: Send + Sync + 'static>(
    engine: &Arc<Eng>,
    identity: &ServiceIdentity,
    req: &RtRequest,
) -> RtResponse {
    announce_once();
    let (Some(head), Some(served_request)) = (request_head(req), req.try_clone()) else {
        tracing::warn!("this cross-origin invoke could not be rendered for the seam serving it");
        return unservable();
    };
    // The runtime is resolved BEFORE anything is served, because the whole serving is one
    // future: there is no half of it this seam can drive on a runtime that refuses the wait.
    let Some(handle) = drivable_runtime() else {
        tracing::warn!(
            "this cross-origin invoke reached no runtime that can drive it while this seam \
             waits for it"
        );
        return unservable();
    };
    let Some(permit) = InvokePermit::claim() else {
        tracing::warn!(
            in_flight = MAX_INVOKES_IN_FLIGHT,
            "as many cross-origin invokes are in flight from this seam as it serves at once, \
             so this one was not served"
        );
        return unservable();
    };
    // Owned, so the work below is a future of its own that the runtime can drive: the engine
    // handle, the identity, the request and its head move into it, and the context is built
    // inside it from them.
    let owned_engine = Arc::clone(engine);
    let owned_identity = identity.clone();
    let served = awaited(&handle, async move {
        let ctx = OperationContext::new(&head, &owned_identity, contained_transport());
        super::serve(&*owned_engine, &served_request, &ctx).await
    });
    drop(permit);
    match served {
        Some(response) => *response,
        None => {
            // The task serving the invoke panicked or was cancelled, which is a request that
            // produced no response. The reason stays in this emulator's own log.
            tracing::warn!("the task serving this cross-origin invoke produced no answer");
            unservable()
        }
    }
}

/// The transport a cross-origin browser request is served over: a handle onto an emulator with
/// NO service mounted, so a call made over it reaches nothing at all.
///
/// The context every step of the serving reads carries a transport, and the step that would use
/// one is the integration: an `AWS`/`AWS_PROXY` integration's call to another service, a
/// function invocation, an authorizer's. This is what withholds exactly those from a request a
/// browser made from another site — such an integration is reported as one that could not be
/// performed instead — while the resolution, the authorization the api's own records decide, the
/// `MOCK` integration a CORS method is wired to and every header mapping are served from the
/// store as they are for any other caller. It is built here, per request, rather than
/// remembered from some earlier call, so no request's own transport is ever lent to another
/// caller.
fn contained_transport() -> ::smithy_server_runtime::EmbeddedEmulator {
    ::smithy_server_runtime::EmbeddedEmulator::from_router(MultiServiceRouter::new())
}

/// Say ONCE, the first time this seam serves a request, that a browser from another site
/// reached a deployed stage of this emulator and what it was served from: the admission is the
/// api's own declaration, so a developer whose api declares an origin learns that pages from it
/// are being answered, and learns it at a level they see rather than from a missing refusal.
///
/// Once per process, because the sentence is about the standing arrangement rather than about
/// one request, and a per-request line on a data plane a browser drives would bury it.
fn announce_once() {
    static ANNOUNCED: ::std::sync::OnceLock<()> = ::std::sync::OnceLock::new();
    ANNOUNCED.get_or_init(|| {
        tracing::warn!(
            "a browser is calling a deployed stage of this emulator from another site; such a \
             request is served only where a deployed method declares that origin and answers \
             from the api's own records, and it reaches no other service of this emulator"
        );
    });
}

/// What this seam answers an invoke it could not serve at all: the class API Gateway reports for
/// a method whose configuration cannot serve the call, `500`
/// `{"message":"Internal server error"}` — rendered through the one funnel every refusal of this
/// plane is rendered through, with no api's own gateway responses read, because the resolution
/// that would name the api never ran.
fn unservable() -> RtResponse {
    refusal_response(None, API_CONFIGURATION_ERROR)
}

/// The head of the request being served, as the [`OperationContext`] it is served under reads
/// it: the method, the URI and every header the client sent.
///
/// `None` for a head the `http` crate will not build, which no request that reached this point
/// has — it arrived over that same crate's types.
fn request_head(req: &RtRequest) -> Option<http::request::Parts> {
    let mut builder = http::Request::builder()
        .method(req.method())
        .uri(req.uri());
    for (name, value) in req.headers().iter() {
        builder = builder.header(name, value);
    }
    Some(builder.body(()).ok()?.into_parts().0)
}

/// The runtime an invoke can be served on from a SYNCHRONOUS seam, or `None` when this process
/// is not on one.
///
/// It is the MULTI-THREAD runtime the emulator boots. A current-thread runtime is driven by the
/// one thread now inside the seam, which is therefore driving nothing while it waits: a task
/// spawned on it could not be polled and its timers would not advance, so the invoke is not
/// served from there at all rather than waited on. This is also what keeps [`awaited`]'s
/// `block_in_place` from the one runtime that refuses it.
///
/// A multi-thread runtime does not exist on `wasm32`, which has no OS threads for tokio's
/// `rt-multi-thread` feature to spawn: that build of this crate never carries the feature
/// `RuntimeFlavor::MultiThread` and `block_in_place` are gated behind, so this seam is never
/// drivable there and reports that directly instead of naming either item.
#[cfg(not(target_family = "wasm"))]
fn drivable_runtime() -> Option<::tokio::runtime::Handle> {
    let handle = ::tokio::runtime::Handle::try_current().ok()?;
    (handle.runtime_flavor() == ::tokio::runtime::RuntimeFlavor::MultiThread).then_some(handle)
}

#[cfg(target_family = "wasm")]
fn drivable_runtime() -> Option<::tokio::runtime::Handle> {
    None
}

/// Run `work` to completion on `handle` from a SYNCHRONOUS seam, or `None` for work that
/// produced no answer because the task performing it panicked or was cancelled.
///
/// Serving an invoke is asynchronous and the seam that asks for it is not, so the work is handed
/// to the runtime as a TASK rather than driven on the thread that is waiting for it. That is
/// what lets the deadlines inside it fire while this seam waits: the integration's own
/// `timeoutInMillis` is on the runtime's own timer, and the task stays cancellable.
/// `block_in_place` hands this worker's queue to a replacement thread while it waits, so the
/// runtime keeps serving every other request.
///
/// Never reached on `wasm32`: [`drivable_runtime`] never hands this seam a handle there, so the
/// `wasm32` build of this function below never runs and exists only so the crate still compiles
/// without tokio's `rt-multi-thread` feature.
#[cfg(not(target_family = "wasm"))]
fn awaited(
    handle: &::tokio::runtime::Handle,
    work: impl ::std::future::Future<Output = RtResponse> + Send + 'static,
) -> Option<Box<RtResponse>> {
    let task = handle.spawn(work);
    ::tokio::task::block_in_place(|| handle.block_on(task))
        .ok()
        .map(Box::new)
}

#[cfg(target_family = "wasm")]
fn awaited(
    _handle: &::tokio::runtime::Handle,
    _work: impl ::std::future::Future<Output = RtResponse> + Send + 'static,
) -> Option<Box<RtResponse>> {
    None
}

/// How many cross-origin invokes this seam serves AT ONCE, across the whole process.
///
/// Each one holds a worker of the runtime for as long as it takes to serve (the wait in
/// [`awaited`]), so this is what keeps a page that sends many of them from taking the runtime's
/// workers: an invoke that finds no permit is answered rather than queued. The count is the
/// router's own bound on a chain of in-process calls, so this seam holds no more of the runtime
/// at once than the framework already allows a request to.
const MAX_INVOKES_IN_FLIGHT: usize = ::smithy_server_runtime::CALLBACK_RECURSION_LIMIT as usize;

/// How many cross-origin invokes this seam currently has in flight.
static INVOKES_IN_FLIGHT: ::std::sync::atomic::AtomicUsize =
    ::std::sync::atomic::AtomicUsize::new(0);

/// One of the [`MAX_INVOKES_IN_FLIGHT`] invokes this seam serves at once, given back when it is
/// dropped — on every path, including one a served invoke panicked on.
struct InvokePermit;

impl InvokePermit {
    /// One permit, or `None` when this seam already has as many invokes in flight as it serves
    /// at once.
    fn claim() -> Option<Self> {
        let mut held = INVOKES_IN_FLIGHT.load(::std::sync::atomic::Ordering::Relaxed);
        loop {
            if held >= MAX_INVOKES_IN_FLIGHT {
                return None;
            }
            match INVOKES_IN_FLIGHT.compare_exchange_weak(
                held,
                held.saturating_add(1),
                ::std::sync::atomic::Ordering::AcqRel,
                ::std::sync::atomic::Ordering::Relaxed,
            ) {
                Ok(_) => return Some(Self),
                Err(current) => held = current,
            }
        }
    }
}

impl Drop for InvokePermit {
    fn drop(&mut self) {
        INVOKES_IN_FLIGHT.fetch_sub(1, ::std::sync::atomic::Ordering::AcqRel);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// One row of the table below: the case, the browser-set headers the request carries, and
    /// whether the front door refuses it.
    type Row = (
        &'static str,
        &'static [(&'static str, &'static str)],
        bool,
    );

    /// RULE: the front door's reading of a request's browser-set headers is what decides
    /// whether this plane can answer the invoke from the routing seam at all, and this module
    /// asks it the same question the router does.
    ///
    /// The rows span what that reading generalises over: a client that sets neither header (an
    /// SDK, a CLI, this emulator calling itself), a browser that classified its own request as
    /// same-origin or as no site's, and the three ways a request reads as another site's — a
    /// cross-site classification, a same-site one, and an `Origin` with no classification
    /// beside it, which is what an older browser's preflight carries.
    #[test]
    fn an_invoke_a_browser_sent_from_another_site_is_the_one_left_unnamed() {
        let cases: [Row; 7] = [
            ("a client that sets neither header", &[], false),
            (
                "a browser's own same-origin classification",
                &[
                    ("origin", "https://app.example"),
                    ("sec-fetch-site", "same-origin"),
                ],
                false,
            ),
            (
                "a browser's own no-site classification",
                &[("sec-fetch-site", "none")],
                false,
            ),
            (
                "a browser's own cross-site classification",
                &[
                    ("origin", "https://app.example"),
                    ("sec-fetch-site", "cross-site"),
                ],
                true,
            ),
            (
                "a browser's own same-site classification",
                &[
                    ("origin", "https://app.example"),
                    ("sec-fetch-site", "same-site"),
                ],
                true,
            ),
            (
                "an origin with no classification beside it",
                &[("origin", "https://app.example")],
                true,
            ),
            ("an opaque origin", &[("origin", "null")], true),
        ];
        for (case, headers, expected) in cases {
            let actual = refused_by_the_front_door(&request(headers));
            assert_eq!(
                actual, expected,
                "case {case:?}: expected the front door's refusal to be {expected}, got {actual}"
            );
        }
    }

    /// RULE: the api's records answer a request by themselves exactly where the method that
    /// would serve it performs no call outside this service — a `MOCK` integration, a method
    /// carrying no integration, or no deployed method at all — and not where its integration
    /// names a backend.
    ///
    /// The rows span every integration type this service's control plane accepts (`MOCK`, the
    /// two `crate::ops::put_integration::AWS_INTEGRATION_TYPES` and the two
    /// `HTTP_INTEGRATION_TYPES`), beside a method carrying no integration, a verb no method
    /// serves, and a type this emulator knows nothing about.
    #[test]
    fn the_records_answer_a_mock_method_and_no_method_by_themselves() {
        let cases: [(&str, Option<Option<&str>>, bool); 8] = [
            ("no deployed method", None, true),
            ("a method carrying no integration", Some(None), true),
            ("a MOCK integration", Some(Some("MOCK")), true),
            ("an AWS integration", Some(Some("AWS")), false),
            ("an AWS_PROXY integration", Some(Some("AWS_PROXY")), false),
            ("an HTTP integration", Some(Some("HTTP")), false),
            ("an HTTP_PROXY integration", Some(Some("HTTP_PROXY")), false),
            ("an integration type this emulator does not know", Some(Some("OTHER")), false),
        ];
        for (case, integration, expected) in cases {
            let method = integration.map(|integration| MethodEntry {
                integration: integration.map(|kind| GetIntegrationOutput {
                    r#type: Some(kind.to_string()),
                    ..Default::default()
                }),
                ..Default::default()
            });
            let actual = performs_no_onward_call(method.as_ref());
            assert_eq!(
                actual, expected,
                "case {case:?}: expected the records to answer it by themselves to be \
                 {expected}, got {actual}"
            );
        }
    }

    /// One row of the declaration table below: the case, the mapping the method's one
    /// integration response carries (its key, its value, and whether the method response of the
    /// same status declares that key) or none at all, the headers the request carries, and
    /// whether the method admits that request's origin.
    type DeclarationRow = (
        &'static str,
        Option<(&'static str, &'static str, bool)>,
        &'static [(&'static str, &'static str)],
        bool,
    );

    /// RULE: a method admits the origin a request was sent from exactly where a response it
    /// SERVES maps `Access-Control-Allow-Origin` to a static literal naming the wildcard or
    /// that exact origin — the api owner's own statement, made through the control plane.
    ///
    /// The rows span what that reading generalises over: the origin itself declared, the
    /// wildcard, another origin declared (which does not admit this one), a mapping the method
    /// response does not declare (so nothing is served and nothing is declared), a mapping that
    /// names a value of the call rather than a literal, another header's mapping, a method
    /// carrying no integration, the header name spelled in another case (one header, by HTTP's
    /// own comparison), the opaque origin against the wildcard, and a request carrying no
    /// origin at all.
    #[test]
    fn a_method_admits_the_origins_its_served_mapping_names() {
        const ALLOW_ORIGIN: &str = "method.response.header.Access-Control-Allow-Origin";
        let cases: [DeclarationRow; 10] = [
            (
                "the origin itself declared",
                Some((ALLOW_ORIGIN, "'https://app.example'", true)),
                &[("origin", "https://app.example")],
                true,
            ),
            (
                "the wildcard",
                Some((ALLOW_ORIGIN, "'*'", true)),
                &[("origin", "https://app.example")],
                true,
            ),
            (
                "another origin declared",
                Some((ALLOW_ORIGIN, "'https://other.example'", true)),
                &[("origin", "https://app.example")],
                false,
            ),
            (
                "a mapping the method response does not declare",
                Some((ALLOW_ORIGIN, "'https://app.example'", false)),
                &[("origin", "https://app.example")],
                false,
            ),
            (
                "a mapping that names a value of the call",
                Some((ALLOW_ORIGIN, "context.requestId", true)),
                &[("origin", "https://app.example")],
                false,
            ),
            (
                "another header's mapping",
                Some((
                    "method.response.header.Access-Control-Allow-Methods",
                    "'GET,OPTIONS'",
                    true,
                )),
                &[("origin", "https://app.example")],
                false,
            ),
            (
                "a method carrying no integration",
                None,
                &[("origin", "https://app.example")],
                false,
            ),
            (
                "the header name in another case",
                Some((
                    "method.response.header.access-control-allow-origin",
                    "'https://app.example'",
                    true,
                )),
                &[("origin", "https://app.example")],
                true,
            ),
            (
                "the opaque origin against the wildcard",
                Some((ALLOW_ORIGIN, "'*'", true)),
                &[("origin", "null")],
                false,
            ),
            (
                "no origin at all",
                Some((ALLOW_ORIGIN, "'*'", true)),
                &[],
                false,
            ),
        ];
        for (case, mapping, headers, expected) in cases {
            let method = method_with(mapping);
            let actual = declares_the_requests_origin(&method, &request(headers));
            assert_eq!(
                actual, expected,
                "case {case:?}: expected the method to admit the origin to be {expected}, got \
                 {actual}"
            );
        }
    }

    /// One method carrying `mapping` as the only response-parameter mapping of its one
    /// integration response, declared by the method response of the same status or not.
    fn method_with(mapping: Option<(&str, &str, bool)>) -> MethodEntry {
        let Some((key, value, declared_by_the_method)) = mapping else {
            return MethodEntry::default();
        };
        let response = GetIntegrationResponseOutput {
            status_code: Some("200".to_string()),
            response_parameters: Some(
                [(key.to_string(), value.to_string())].into_iter().collect(),
            ),
            ..Default::default()
        };
        let integration = GetIntegrationOutput {
            r#type: Some(MOCK_INTEGRATION_TYPE.to_string()),
            integration_responses: Some([("200".to_string(), response)].into_iter().collect()),
            ..Default::default()
        };
        let method_responses = if declared_by_the_method {
            [(
                "200".to_string(),
                crate::ops::types::GetMethodResponseOutput {
                    status_code: Some("200".to_string()),
                    response_parameters: Some([(key.to_string(), false)].into_iter().collect()),
                    response_models: None,
                },
            )]
            .into_iter()
            .collect()
        } else {
            Default::default()
        };
        MethodEntry {
            integration: Some(integration),
            method_responses,
            ..Default::default()
        }
    }

    /// One preflight carrying `headers`.
    fn request(headers: &[(&str, &str)]) -> RtRequest {
        let mut builder = ::http::Request::builder()
            .method("OPTIONS")
            .uri("https://127.0.0.1:1/_aws/execute-api/abc1230000/live/cors");
        for (name, value) in headers {
            builder = builder.header(*name, *value);
        }
        let request = builder
            .body(SdkBody::empty())
            .expect("the test request is well formed");
        RtRequest::try_from(request).expect("the test request is a runtime request")
    }
}
