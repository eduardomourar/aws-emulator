// SPDX-License-Identifier: CC0-1.0

import { EKSClient } from "@aws-sdk/client-eks";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsEksAdapter } from "../src/adapter-aws/AwsEksAdapter";
import { createEksService } from "../src/services/eks";

const eks = new EKSClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsEksAdapter(createEksService(eks))]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleEksRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
