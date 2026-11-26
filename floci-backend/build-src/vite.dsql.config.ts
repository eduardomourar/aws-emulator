// SPDX-License-Identifier: CC0-1.0

import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  define: { "process.env": "({})" },
  resolve: {
    alias: [
      { find: "../aws", replacement: path.resolve(__dirname, "aws-stub.ts") },
      { find: "../cloudProxy", replacement: path.resolve(__dirname, "cloudproxy-stub.ts") },
      { find: "./runtimeProbe", replacement: path.resolve(__dirname, "runtimeprobe-stub.ts") },
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
      entry: path.resolve(__dirname, "dsql-entry.ts"),
      formats: ["es"],
      fileName: () => "dsql.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
