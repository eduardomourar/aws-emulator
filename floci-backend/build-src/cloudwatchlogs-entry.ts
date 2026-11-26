// SPDX-License-Identifier: CC0-1.0

import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsLogsAdapter } from "../src/adapter-aws/AwsLogsAdapter";

const logs = new CloudWatchLogsClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsLogsAdapter(logs)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleCloudWatchLogsRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
