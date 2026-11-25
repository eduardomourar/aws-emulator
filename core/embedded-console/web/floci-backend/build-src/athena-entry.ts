// SPDX-License-Identifier: CC0-1.0

import { AthenaClient } from "@aws-sdk/client-athena";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsAthenaAdapter } from "../src/adapter-aws/AwsAthenaAdapter";

const client = new AthenaClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsAthenaAdapter(client)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleAthenaRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
