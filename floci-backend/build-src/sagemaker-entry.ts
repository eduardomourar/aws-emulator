// SPDX-License-Identifier: CC0-1.0

import { SageMakerClient } from "@aws-sdk/client-sagemaker";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsSageMakerAdapter } from "../src/adapter-aws/AwsSageMakerAdapter";

const client = new SageMakerClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsSageMakerAdapter(client)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleSageMakerRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
