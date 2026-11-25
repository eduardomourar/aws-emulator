// SPDX-License-Identifier: CC0-1.0

import { AppConfigClient } from "@aws-sdk/client-appconfig";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsAppConfigAdapter } from "../src/adapter-aws/AwsAppConfigAdapter";

const client = new AppConfigClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsAppConfigAdapter(client)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleAppConfigRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
