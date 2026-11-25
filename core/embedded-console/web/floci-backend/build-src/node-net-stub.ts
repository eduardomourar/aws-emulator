// SPDX-License-Identifier: CC0-1.0

// Stand-in for `node:net`: only reached from `AwsDsqlAdapter`'s interactive SQL browsing
// path, which this host never calls -- see `dsql-data-client-stub.ts`. `isIP` just needs
// to be callable; returning 0 (not an IP) always sends that path to `lookup` instead,
// which itself refuses.
export function isIP(_host: string): number {
  return 0;
}
