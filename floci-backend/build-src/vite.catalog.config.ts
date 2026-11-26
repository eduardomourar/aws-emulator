// SPDX-License-Identifier: CC0-1.0

import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  // `routes/clouds.ts` unconditionally evaluates `export default createCloudRoutes()`
  // at module top level the instant it's imported, regardless of what we actually
  // import from it. With no injected service, that call falls through to
  // `resolveScopedCloud()`, whose default parameter reads `process.env` directly —
  // harmless in Node (where this was first verified), but `process` does not exist
  // in a browser at all, so that unused call throws there instead of returning null.
  define: { "process.env": "({})" },
  resolve: {
    alias: [
      { find: "../aws", replacement: path.resolve(__dirname, "aws-stub.ts") },
      { find: "../cloudProxy", replacement: path.resolve(__dirname, "cloudproxy-stub.ts") },
      { find: "./runtimeProbe", replacement: path.resolve(__dirname, "runtimeprobe-stub.ts") },
      // `AwsRoute53Adapter.create` calls `node:crypto`'s `randomUUID` for a hosted
      // zone's `CallerReference`: no such module in a browser, but the same function
      // under the Web Crypto API, which every target this build runs in already has.
      { find: "node:crypto", replacement: path.resolve(__dirname, "node-crypto-stub.ts") },
      // `AwsDsqlAdapter`'s interactive SQL browsing path (never called for basic cluster
      // CRUD) resolves the cluster host and opens a raw Postgres socket to it, neither of
      // which exists in a browser — see `dsql-data-client-stub.ts`.
      { find: "node:dns/promises", replacement: path.resolve(__dirname, "node-dns-stub.ts") },
      { find: "node:net", replacement: path.resolve(__dirname, "node-net-stub.ts") },
      {
        find: "../adapter-azure/PostgresDataClient",
        replacement: path.resolve(__dirname, "dsql-data-client-stub.ts"),
      },
    ],
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "catalog-entry.ts"),
      formats: ["es"],
      fileName: () => "catalog.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
