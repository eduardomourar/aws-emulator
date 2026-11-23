// SPDX-License-Identifier: CC0-1.0

import { IAMClient } from "@aws-sdk/client-iam";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsIamAdapter } from "../src/adapter-aws/AwsIamAdapter";

const iam = new IAMClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsIamAdapter(iam)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleIamRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
