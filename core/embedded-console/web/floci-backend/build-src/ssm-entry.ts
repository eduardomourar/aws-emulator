// SPDX-License-Identifier: CC0-1.0

import { SSMClient } from "@aws-sdk/client-ssm";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsParameterStoreAdapter } from "../src/adapter-aws/AwsParameterStoreAdapter";

const client = new SSMClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsParameterStoreAdapter(client)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleSsmRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
