// SPDX-License-Identifier: CC0-1.0

// Stand-in for `../cloudProxy` when bundling a single AWS service for the
// browser: `routes/clouds.ts` imports `serviceForAccount` at module scope as
// a constructor-default fallback, and the real module constructs every
// adapter across all four clouds. Every per-service entry here always passes
// its own pre-built `CloudProxyService` to `createCloudRoutes` directly, so
// this fallback is declared but never called.
import type { CloudProxyService } from "../src/service/CloudProxyService";

export function serviceForAccount(): CloudProxyService {
  throw new Error("serviceForAccount stub should never be called: pass an explicit CloudProxyService instead");
}
