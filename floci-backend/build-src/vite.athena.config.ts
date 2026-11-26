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
    ],
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
    emptyOutDir: false,
    lib: {
      entry: path.resolve(__dirname, "athena-entry.ts"),
      formats: ["es"],
      fileName: () => "athena.js",
    },
    rollupOptions: {
      output: { inlineDynamicImports: true },
    },
  },
});
