// SPDX-License-Identifier: CC0-1.0

import { SFNClient } from "@aws-sdk/client-sfn";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsStepFunctionsAdapter } from "../src/adapter-aws/AwsStepFunctionsAdapter";

const sfn = new SFNClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsStepFunctionsAdapter(sfn)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleSfnRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
