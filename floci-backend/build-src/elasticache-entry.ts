// SPDX-License-Identifier: CC0-1.0

import { ElastiCacheClient } from "@aws-sdk/client-elasticache";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsElastiCacheAdapter } from "../src/adapter-aws/AwsElastiCacheAdapter";

const elasticache = new ElastiCacheClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsElastiCacheAdapter(elasticache)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleElastiCacheRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
