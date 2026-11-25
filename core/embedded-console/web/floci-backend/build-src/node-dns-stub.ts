// SPDX-License-Identifier: CC0-1.0

// Stand-in for `node:dns/promises`: only reached from `AwsDsqlAdapter`'s interactive SQL
// browsing path (resolving the cluster host before opening a raw Postgres socket to it),
// which this host never calls -- see `dsql-data-client-stub.ts`.
export async function lookup(_host: string): Promise<{ address: string }> {
  throw new Error("DNS resolution is not supported by this host.");
}
