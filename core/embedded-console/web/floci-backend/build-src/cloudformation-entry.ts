// SPDX-License-Identifier: CC0-1.0

import { CloudFormationClient } from "@aws-sdk/client-cloudformation";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsCloudFormationAdapter } from "../src/adapter-aws/AwsCloudFormationAdapter";

const cloudformation = new CloudFormationClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsCloudFormationAdapter(cloudformation)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleCloudFormationRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
