// SPDX-License-Identifier: CC0-1.0

import { KMSClient } from "@aws-sdk/client-kms";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsKmsAdapter } from "../src/adapter-aws/AwsKmsAdapter";

const kms = new KMSClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsKmsAdapter(kms)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleKmsRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
