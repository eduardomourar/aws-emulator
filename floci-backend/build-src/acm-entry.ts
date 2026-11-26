// SPDX-License-Identifier: CC0-1.0

import { ACMClient } from "@aws-sdk/client-acm";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsAcmAdapter } from "../src/adapter-aws/AwsAcmAdapter";

const acm = new ACMClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsAcmAdapter(acm)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleAcmRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
