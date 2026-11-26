// SPDX-License-Identifier: CC0-1.0

// Stand-in for `AwsDsqlAdapter`'s real `PostgresDataClient`, which opens a raw Postgres
// TCP connection to the cluster's data endpoint (the `pg` driver, Node-only) to run the
// SQL explorer's queries: no browser can open that socket at all, so this host has no
// interactive SQL browsing for a DSQL cluster, only the real cluster lifecycle
// (list/create/update/delete), which never calls this.
import type { SqlDataClient, SqlDataConnection } from "../src/adapter-azure/MssqlDataClient";

// Named `PostgresDataClient` to match what the real module (aliased to this file for
// every build target) exports — `AwsDsqlAdapter.ts`'s own import names it that way.
export class PostgresDataClient implements SqlDataClient {
  async query(_connection: SqlDataConnection, _query: string): Promise<never> {
    throw new Error("Interactive SQL browsing is not supported by this host: no browser can open a raw database socket.");
  }
}
