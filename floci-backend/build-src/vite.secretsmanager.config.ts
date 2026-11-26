// SPDX-License-Identifier: CC0-1.0

import { defineConfig } from "vite";
import path from "node:path";

export default defineConfig({
  resolve: {
    alias: [
      // `routes/secretsmanager.ts` imports `../aws` as a fallback-default
      // client; this entry always passes its own client explicitly, so the
      // real `aws.ts` (which eagerly constructs all ~38 AWS SDK clients as a
      // module side effect) is never needed. Vite's alias matching is
      // against the literal import specifier text, not a resolved path, so
      // the key has to be exactly what the source writes.
      { find: "../aws", replacement: path.resolve(__dirname, "aws-stub.ts") },
    ],
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "secretsmanager-entry.ts"),
      formats: ["es"],
      fileName: () => "secretsmanager.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
