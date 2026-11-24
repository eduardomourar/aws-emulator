// SPDX-License-Identifier: CC0-1.0

import { APIGatewayClient } from "@aws-sdk/client-api-gateway";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsApiGatewayAdapter } from "../src/adapter-aws/AwsApiGatewayAdapter";

const apiGateway = new APIGatewayClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsApiGatewayAdapter(apiGateway)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleApiGatewayRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
