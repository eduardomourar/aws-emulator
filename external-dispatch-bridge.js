// SPDX-License-Identifier: CC0-1.0

// Secrets Manager's component reaches KMS, and (via `embedded-console-service`'s
// internal relay) IAM, over the standard `wasi:http/outgoing-handler` import —
// still `wasi:http/outgoing-handler@0.2.12` on the CALLING side even after the
// wasip3 migration (`embedded-console`'s outgoing-call code stayed on raw
// `wit-bindgen`, deliberately, per the preview2-shim reactor-nesting deadlock
// documented in that crate), so `preview2-shim`'s default implementation of
// that import is still what ends in a genuine `globalThis.fetch(...)` call. The
// SERVERS on the other end of that call (`embedded-kms`/`embedded-iam`/
// `embedded-console-service`) now export `wasi:http/handler@0.3.0`, so the
// client side of this bridge is `P3InMemoryHttpClient`, not the old preview2
// `InMemoryHttpClient`. A host decides where the intercepted `fetch` call
// actually goes; here, since nothing else on this page ever calls `fetch`,
// intercepting it for the placeholder authorities the Rust side sends requests
// to is enough to route each one into the right separately-compiled component
// instead of the network — no WIT-level plumbing to hand-write, no composition
// tool.
//
// Three authorities, one shared `fetch` patch (the console-service component's
// OWN outgoing call to IAM flows back through this SAME patch, since `fetch` is
// patched exactly once for the whole page, however many components end up
// nested in the call):
//
// - `kms.local.invalid` — Secrets Manager's envelope crypto calling KMS directly.
// - `console.local.invalid` — Secrets Manager's authorization fallback calling
//   `embedded-console-service`'s internal relay.
// - `iam.local.invalid` — that same relay's own call onward to IAM.

import { P3InMemoryHttpClient as InMemoryHttpClient } from "./p3-in-memory-http.js";
import { handler as kmsIncomingHandler } from "./jco-out-kms/aws_emulator_embedded_kms.js";
import { handler as consoleIncomingHandler } from "./jco-out-console-service/aws_emulator_embedded_console_service.js";
import { handler as iamIncomingHandler } from "./jco-out-iam/aws_emulator_embedded_iam.js";

const clientsByAuthority = {
  "kms.local.invalid": new InMemoryHttpClient(kmsIncomingHandler),
  "console.local.invalid": new InMemoryHttpClient(consoleIncomingHandler),
  "iam.local.invalid": new InMemoryHttpClient(iamIncomingHandler),
};

const realFetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = (input, init) => {
  const request = input instanceof Request ? input : new Request(input, init);
  const url = new URL(request.url);
  const client = clientsByAuthority[url.hostname];
  if (client) {
    return client.fetch(request);
  }
  return realFetch(input, init);
};
