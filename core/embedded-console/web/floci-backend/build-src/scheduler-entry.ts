// SPDX-License-Identifier: CC0-1.0

import { SchedulerClient } from "@aws-sdk/client-scheduler";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsSchedulerAdapter } from "../src/adapter-aws/AwsSchedulerAdapter";

const client = new SchedulerClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsSchedulerAdapter(client)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleSchedulerRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
