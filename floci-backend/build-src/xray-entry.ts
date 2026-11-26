// SPDX-License-Identifier: CC0-1.0

import { XRayClient } from "@aws-sdk/client-xray";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsXrayAdapter } from "../src/adapter-aws/AwsXrayAdapter";

const region = "us-east-1";
const xray = new XRayClient({
  region,
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsXrayAdapter(xray, region)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  region,
);
const app = createCloudRoutes(service);

export async function handleXrayRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
