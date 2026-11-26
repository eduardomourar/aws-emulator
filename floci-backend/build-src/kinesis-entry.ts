// SPDX-License-Identifier: CC0-1.0

import { KinesisClient } from "@aws-sdk/client-kinesis";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsKinesisAdapter } from "../src/adapter-aws/AwsKinesisAdapter";

const kinesis = new KinesisClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsKinesisAdapter(kinesis)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleKinesisRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
