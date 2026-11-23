// SPDX-License-Identifier: CC0-1.0

import { Route53Client } from "@aws-sdk/client-route-53";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsRoute53Adapter } from "../src/adapter-aws/AwsRoute53Adapter";

const route53 = new Route53Client({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsRoute53Adapter(route53)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleRoute53Request(request: Request): Promise<Response> {
  return app.fetch(request);
}
