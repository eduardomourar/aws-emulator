// SPDX-License-Identifier: CC0-1.0

import { OpenSearchClient } from "@aws-sdk/client-opensearch";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsOpenSearchAdapter } from "../src/adapter-aws/AwsOpenSearchAdapter";

const opensearch = new OpenSearchClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsOpenSearchAdapter(opensearch)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleOpenSearchRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
