// SPDX-License-Identifier: CC0-1.0

import { RDSClient } from "@aws-sdk/client-rds";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsDatabaseAdapter } from "../src/adapter-aws/AwsDatabaseAdapter";
import { createRdsService } from "../src/services/rds";

const clientConfig = {
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
};

const registry = new CloudAdapterRegistry([
  new AwsDatabaseAdapter(createRdsService(new RDSClient(clientConfig)), new RDSClient(clientConfig)),
]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleRdsRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
