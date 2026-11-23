// SPDX-License-Identifier: CC0-1.0

// Stand-in for `node:crypto` when bundling for the browser: a browser has no
// such module, but it has the same function under the Web Crypto API, which
// every target this build runs in (a real browser, or this project's own
// `wasi:http`-backed fetch shim) already provides as a global.
export function randomUUID(): string {
  return crypto.randomUUID();
}
