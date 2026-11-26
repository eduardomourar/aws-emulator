// SPDX-License-Identifier: CC0-1.0

import { SQSClient } from "@aws-sdk/client-sqs";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsSqsAdapter } from "../src/adapter-aws/AwsSqsAdapter";

const sqs = new SQSClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsSqsAdapter(sqs)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleSqsRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
