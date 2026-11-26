// SPDX-License-Identifier: CC0-1.0

import { SNSClient } from "@aws-sdk/client-sns";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsSnsAdapter } from "../src/adapter-aws/AwsSnsAdapter";

const sns = new SNSClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsSnsAdapter(sns)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleSnsRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
