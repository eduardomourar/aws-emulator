// SPDX-License-Identifier: CC0-1.0

import { CodeBuildClient } from "@aws-sdk/client-codebuild";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsCodeBuildAdapter } from "../src/adapter-aws/AwsCodeBuildAdapter";

const codebuild = new CodeBuildClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsCodeBuildAdapter(codebuild)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleCodeBuildRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
