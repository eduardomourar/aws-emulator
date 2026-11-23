// SPDX-License-Identifier: CC0-1.0

// Secrets Manager, KMS, STS and IAM are each their own compiled wasm
// component again (`core/embedded-{secretsmanager,kms,sts,iam}`), the same
// split as before, for the size reasons `.agents/05-...md` describes. What's
// new is `core/embedded-router`: a fifth component that registers no service
// of its own and answers the ONE synthetic authority
// (`emulator.local.invalid`) every console bundle's AWS SDK client is
// actually pointed at, forwarding each request on to whichever of the other
// four answers it — the single front door `.agents/13-...md` asked for,
// decided by the SigV4 credential scope in the request's own `Authorization`
// header (see `core/embedded-router/src/wasi_http.rs`).
//
// None of this is a real network peer: every one of these five components
// still only exports `wasi:http/handler@0.3.0`, so `globalThis.fetch` is
// patched exactly once for the whole page to route a call to any of their
// synthetic authorities into a `P3InMemoryHttpClient` instead of the
// network — including the ROUTER's own outgoing calls to its siblings, which
// cross this same boundary.
//
// The same patch also answers the Floci UI frontend's own same-origin
// `/api/*` calls: those never reach any of these synthetic authorities at
// all (Floci's frontend calls `/api/secretsmanager/...` etc. directly,
// same-origin), so they're matched on path instead of hostname and handed to
// `floci-backend/router.js` (a browser-side dispatcher of a different kind —
// across Floci's own per-service backend bundles, not wasm components),
// which dispatches each one to whichever per-service bundle answers it. That
// bundle's own AWS SDK client then signs a request to `emulator.local.invalid`,
// landing back on the wasm router above.

import { P3InMemoryHttpClient as InMemoryHttpClient } from "./p3-in-memory-http.js";
import { handler as routerIncomingHandler } from "./jco-out-router/aws_emulator_embedded_router.js";
import { handler as secretsmanagerIncomingHandler } from "./jco-out-secretsmanager/aws_emulator_embedded_secretsmanager.js";
import { handler as kmsIncomingHandler } from "./jco-out-kms/aws_emulator_embedded_kms.js";
import { handler as stsIncomingHandler } from "./jco-out-sts/aws_emulator_embedded_sts.js";
import { handler as iamIncomingHandler } from "./jco-out-iam/aws_emulator_embedded_iam.js";
import { handleApiRequest } from "./floci-backend/router.js";

const clientsByAuthority = {
  "emulator.local.invalid": new InMemoryHttpClient(routerIncomingHandler),
  "secretsmanager.local.invalid": new InMemoryHttpClient(secretsmanagerIncomingHandler),
  "kms.local.invalid": new InMemoryHttpClient(kmsIncomingHandler),
  "sts.local.invalid": new InMemoryHttpClient(stsIncomingHandler),
  "iam.local.invalid": new InMemoryHttpClient(iamIncomingHandler),
};

const realFetch = globalThis.fetch.bind(globalThis);

globalThis.fetch = (input, init) => {
  const request = input instanceof Request ? input : new Request(input, init);
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api/")) {
    return handleApiRequest(request);
  }
  const client = clientsByAuthority[url.hostname];
  if (client) {
    return client.fetch(request);
  }
  return realFetch(input, init);
};
