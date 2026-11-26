// SPDX-License-Identifier: CC0-1.0

import { S3Client } from "@aws-sdk/client-s3";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsStorageAdapter } from "../src/adapter-aws/AwsStorageAdapter";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
  // Without this, the SDK addresses a bucket as a subdomain
  // (`<bucket>.emulator.local.invalid`) instead of a path under the one
  // synthetic authority every component answers at, so no routing rule here
  // ever matches it.
  forcePathStyle: true,
});

const registry = new CloudAdapterRegistry([new AwsStorageAdapter(s3)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleS3Request(request: Request): Promise<Response> {
  return app.fetch(request);
}
