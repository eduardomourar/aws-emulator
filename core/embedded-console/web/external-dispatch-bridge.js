// SPDX-License-Identifier: CC0-1.0

// Secrets Manager's component reaches KMS, and (via `embedded-console-service`'s
// internal relay) IAM, over the standard `wasi:http/outgoing-handler` import,
// exactly as it would a real network peer — `preview2-shim`'s default
// implementation of that import ends in a genuine `globalThis.fetch(...)` call.
// A host decides where that call actually goes; here, since nothing else on this
// page ever calls `fetch`, intercepting it for the placeholder authorities the
// Rust side sends requests to is enough to route each one into the right
// separately-compiled component instead of the network — no WIT-level plumbing
// to hand-write, no composition tool.
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

import { InMemoryHttpClient } from "./vendor/preview2-shim/in-memory-http.js";
import { incomingHandler as kmsIncomingHandler } from "./jco-out-kms/aws_emulator_embedded_kms.js";
import { incomingHandler as consoleIncomingHandler } from "./jco-out-console-service/aws_emulator_embedded_console_service.js";
import { incomingHandler as iamIncomingHandler } from "./jco-out-iam/aws_emulator_embedded_iam.js";

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
