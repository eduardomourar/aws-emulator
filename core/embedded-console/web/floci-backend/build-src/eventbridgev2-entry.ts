// SPDX-License-Identifier: CC0-1.0

import { EventBridgeV2Client } from "@aws-sdk/client-eventbridgev2";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsEventBridgeV2Adapter } from "../src/adapter-aws/AwsEventBridgeV2Adapter";

const client = new EventBridgeV2Client({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsEventBridgeV2Adapter(client)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleEventBridgeV2Request(request: Request): Promise<Response> {
  return app.fetch(request);
}
