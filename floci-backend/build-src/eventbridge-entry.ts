// SPDX-License-Identifier: CC0-1.0

import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsEventBridgeAdapter } from "../src/adapter-aws/AwsEventBridgeAdapter";

const eventbridge = new EventBridgeClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsEventBridgeAdapter(eventbridge)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleEventBridgeRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
