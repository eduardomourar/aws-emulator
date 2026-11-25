// SPDX-License-Identifier: CC0-1.0

import { DSQLClient } from "@aws-sdk/client-dsql";
import { STSClient } from "@aws-sdk/client-sts";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsDsqlAdapter } from "../src/adapter-aws/AwsDsqlAdapter";
import { PostgresDataClient } from "./dsql-data-client-stub";

const clientConfig = {
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
};

const registry = new CloudAdapterRegistry([
  new AwsDsqlAdapter(
    new DSQLClient(clientConfig),
    new STSClient(clientConfig),
    null,
    new PostgresDataClient(),
  ),
]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleDsqlRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
