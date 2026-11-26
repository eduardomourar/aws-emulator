// SPDX-License-Identifier: CC0-1.0

import { ApplicationAutoScalingClient } from "@aws-sdk/client-application-auto-scaling";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsApplicationAutoScalingAdapter } from "../src/adapter-aws/AwsApplicationAutoScalingAdapter";

const applicationAutoScaling = new ApplicationAutoScalingClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsApplicationAutoScalingAdapter(applicationAutoScaling)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleApplicationAutoScalingRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
