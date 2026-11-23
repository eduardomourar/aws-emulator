// SPDX-License-Identifier: CC0-1.0

import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsCloudFrontAdapter } from "../src/adapter-aws/AwsCloudFrontAdapter";

const cloudfront = new CloudFrontClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsCloudFrontAdapter(cloudfront)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleCloudFrontRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
