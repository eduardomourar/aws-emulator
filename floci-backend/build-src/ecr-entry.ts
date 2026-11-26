// SPDX-License-Identifier: CC0-1.0

import { ECRClient } from "@aws-sdk/client-ecr";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsRegistryAdapter } from "../src/adapter-aws/AwsRegistryAdapter";

const ecr = new ECRClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsRegistryAdapter(ecr)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleEcrRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
