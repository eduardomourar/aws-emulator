// SPDX-License-Identifier: CC0-1.0

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsDynamoDbAdapter } from "../src/adapter-aws/AwsDynamoDbAdapter";

const dynamodb = new DynamoDBClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsDynamoDbAdapter(dynamodb)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleDynamoDbRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
