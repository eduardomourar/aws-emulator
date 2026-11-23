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
    ],
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "sqs-entry.ts"),
      formats: ["es"],
      fileName: () => "sqs.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
