// SPDX-License-Identifier: CC0-1.0

// Secrets Manager, KMS, STS, IAM, CloudWatch, CodeBuild and Cognito are each
// their own compiled wasm component (`core/embedded-{secretsmanager,kms,...}`),
// the same split as before, for the size reasons `.agents/05-...md`
// describes. Every console bundle's AWS SDK client is pointed at one shared
// synthetic authority, `emulator.local.invalid` — the single front door
// `.agents/13-...md` asked for — but unlike an earlier version of this file,
// that authority is answered HERE, in this patch, by inspecting the SigV4
// credential scope in the request's own `Authorization` header and calling
// whichever real component's authority claims that service name directly.
//
// `core/embedded-router` did this same dispatch in Rust instead, as its own
// wasm component: a wasi:http SERVER that, to answer a request, made an
// outgoing CLIENT call to the real target component. That's a nested async
// wasm call — a server's own handler making another outgoing call while
// still answering the first — and it reproducibly traps
// (`wasm trap: cannot enter component instance`, a wit-bindgen JSPI
// assertion failure) on every call that needs it, the same documented
// limitation that already made `embedded-console-service`'s relay dead code
// earlier in this project's history. Doing the dispatch here instead avoids
// it entirely: every component this patch calls still only ever answers a
// SINGLE, un-nested incoming request, since the browser — not another wasm
// component — is the one deciding where each request goes.
//
// None of this is a real network peer: every component still only exports
// `wasi:http/handler@0.3.0`, so `globalThis.fetch` is patched to route a
// call to any of their synthetic authorities into a `P3InMemoryHttpClient`
// instead of the network.
//
// The same patch also answers the Floci UI frontend's own same-origin
// `/api/*` calls: those never reach any of these synthetic authorities at
// all (Floci's frontend calls `/api/secretsmanager/...` etc. directly,
// same-origin), so they're matched on path instead of hostname and handed to
// `floci-backend/router.js`, which dispatches each one to whichever
// per-service bundle answers it. That bundle's own AWS SDK client then
// signs a request to `emulator.local.invalid`, landing back on this same
// patch, which resolves it to a real component by SigV4 scope as above.
//
// The `globalThis.fetch` assignment below is the FIRST thing this module
// does, synchronously, before importing anything else. Every wasm component
// handler and the Floci dispatcher are loaded lazily, inside the fetch
// patch itself, via dynamic `import()`. This isn't just about not paying
// for a component a page never opens — it's required for correctness here:
// several jco-transpiled component modules perform
// `WebAssembly.instantiate`-driven top-level async work, and importing them
// eagerly at this module's own top level would make evaluating THIS module
// asynchronous too. The very next `<script type="module">` tag (Floci's own
// bundle) can begin firing `fetch()` calls before an async top level like
// that resolves — module execution order across sibling `<script>` tags
// only guarantees each script's synchronous top-level code runs in order,
// not that an awaited import chain finishes first. A page that fires its
// first API call before the patch is installed falls straight through to
// the real network and 404s against the static file server, which looks
// identical to the patch never having run at all.

// (SigV4 signing name, synthetic authority of the component that answers
// it). The signing name is a fixed property of each service's AWS SDK
// client (its default `signingName`), not something a caller configures, so
// this table only needs to grow when a new service's `embedded-*` component
// is added behind the front door. Mirrors
// `core/embedded-router/src/wasi_http.rs`'s own table — that Rust component
// is no longer wired into any live request path (see the header comment
// above), but its source stays as the authoritative reference for this
// mapping and for why the dispatch moved here.
const AUTHORITY_BY_SERVICE = {
  secretsmanager: "secretsmanager.local.invalid",
  kms: "kms.local.invalid",
  sts: "sts.local.invalid",
  iam: "iam.local.invalid",
  monitoring: "cloudwatch.local.invalid",
  codebuild: "codebuild.local.invalid",
  "cognito-idp": "cognitoidentityprovider.local.invalid",
  kinesis: "kinesis.local.invalid",
  "payment-cryptography": "paymentcryptography.local.invalid",
  sqs: "sqs.local.invalid",
  xray: "xray.local.invalid",
  ecr: "ecr.local.invalid",
  sns: "sns.local.invalid",
  acm: "acm.local.invalid",
  route53: "route53.local.invalid",
  cloudfront: "cloudfront.local.invalid",
  s3: "s3.local.invalid",
};

const AUTHORITY_MODULES = {
  "secretsmanager.local.invalid": () => import("./jco-out-secretsmanager/aws_emulator_embedded_secretsmanager.js"),
  "kms.local.invalid": () => import("./jco-out-kms/aws_emulator_embedded_kms.js"),
  "sts.local.invalid": () => import("./jco-out-sts/aws_emulator_embedded_sts.js"),
  "iam.local.invalid": () => import("./jco-out-iam/aws_emulator_embedded_iam.js"),
  "cloudwatch.local.invalid": () => import("./jco-out-cloudwatch/aws_emulator_embedded_cloudwatch.js"),
  "codebuild.local.invalid": () => import("./jco-out-codebuild/aws_emulator_embedded_codebuild.js"),
  "cognitoidentityprovider.local.invalid": () =>
    import("./jco-out-cognitoidentityprovider/aws_emulator_embedded_cognitoidentityprovider.js"),
  "kinesis.local.invalid": () => import("./jco-out-kinesis/aws_emulator_embedded_kinesis.js"),
  "paymentcryptography.local.invalid": () =>
    import("./jco-out-paymentcryptography/aws_emulator_embedded_paymentcryptography.js"),
  "sqs.local.invalid": () => import("./jco-out-sqs/aws_emulator_embedded_sqs.js"),
  "xray.local.invalid": () => import("./jco-out-xray/aws_emulator_embedded_xray.js"),
  "ecr.local.invalid": () => import("./jco-out-ecr/aws_emulator_embedded_ecr.js"),
  "sns.local.invalid": () => import("./jco-out-sns/aws_emulator_embedded_sns.js"),
  "acm.local.invalid": () => import("./jco-out-acm/aws_emulator_embedded_acm.js"),
  "route53.local.invalid": () => import("./jco-out-route53/aws_emulator_embedded_route53.js"),
  "cloudfront.local.invalid": () => import("./jco-out-cloudfront/aws_emulator_embedded_cloudfront.js"),
  "s3.local.invalid": () => import("./jco-out-s3/aws_emulator_embedded_s3.js"),
};

const clientsByAuthority = new Map();

async function clientFor(authority) {
  let client = clientsByAuthority.get(authority);
  if (!client) {
    const [{ P3InMemoryHttpClient }, { handler }] = await Promise.all([
      import("./p3-in-memory-http.js"),
      AUTHORITY_MODULES[authority](),
    ]);
    client = new P3InMemoryHttpClient(handler);
    clientsByAuthority.set(authority, client);
  }
  return client;
}

// Two calls into the SAME wasm component instance, in flight at once, trap
// (`wasm trap: wasm \`unreachable\` instruction executed` — confirmed by
// direct testing, not from any single call's own content). Two DIFFERENT
// components tolerate concurrency fine; it's specifically the same instance
// that doesn't. React Query alone routinely fires several requests to the
// same authority at once (a status poll racing a resource list, for
// instance), so this serializes calls PER AUTHORITY — a call to a
// authority with nothing currently in flight runs immediately; the next
// call to that SAME authority waits for it, whatever authority some OTHER
// in-flight call is using.
const queueTailByAuthority = new Map();

function callAuthority(authority, request) {
  const previous = queueTailByAuthority.get(authority) ?? Promise.resolve();
  const next = previous
    .then(() => clientFor(authority))
    .then((client) => client.fetch(request))
    .then(async (response) => {
      // `fetch()` resolves once headers arrive; the body can still be streaming
      // out of the wasm side after that. Draining it fully here — before this
      // queue slot is considered done — is what actually keeps two calls into
      // the same component from overlapping; waiting on the `fetch()` promise
      // alone let the next queued call start while the previous one's wasm
      // instance was still mid-response, hitting the exact same trap this
      // queue exists to prevent.
      const body = await response.arrayBuffer();
      return new Response(body, { status: response.status, statusText: response.statusText, headers: response.headers });
    });
  queueTailByAuthority.set(
    authority,
    next.catch(() => {}),
  );
  return next;
}

/// The real synthetic authority to answer `request`, read from the SigV4
/// credential scope in its `Authorization` header
/// (`AWS4-HMAC-SHA256 Credential=<key>/<date>/<region>/<service>/aws4_request, ...`)
/// — the one signal every signed AWS request carries regardless of wire
/// protocol. `null` if the header is missing, malformed, or names a service
/// with no component behind the front door.
function authorityForSignedRequest(request) {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const afterCredential = header.split("Credential=")[1];
  if (!afterCredential) return null;
  const scope = afterCredential.split(/[,\s]/)[0];
  const service = scope.split("/")[3];
  return AUTHORITY_BY_SERVICE[service] ?? null;
}

const realFetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = (input, init) => {
  const request = input instanceof Request ? input : new Request(input, init);
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    return import("./floci-backend/router.js").then(({ handleApiRequest }) => handleApiRequest(request));
  }
  if (url.hostname === "emulator.local.invalid") {
    const authority = authorityForSignedRequest(request);
    if (authority) {
      return callAuthority(authority, request);
    }
    return Promise.resolve(
      new Response(
        JSON.stringify({
          __type: "UnknownOperationException",
          message: "no service behind this front door claims this request",
        }),
        { status: 400, headers: { "content-type": "application/json" } },
      ),
    );
  }
  if (Object.hasOwn(AUTHORITY_MODULES, url.hostname)) {
    return callAuthority(url.hostname, request);
  }
  return realFetch(input, init);
};
