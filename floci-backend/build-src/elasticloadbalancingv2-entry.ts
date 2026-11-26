// SPDX-License-Identifier: CC0-1.0

import { ElasticLoadBalancingV2Client } from "@aws-sdk/client-elastic-load-balancing-v2";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsLoadBalancingAdapter } from "../src/adapter-aws/AwsLoadBalancingAdapter";

const elb = new ElasticLoadBalancingV2Client({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsLoadBalancingAdapter(elb)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleElasticLoadBalancingV2Request(request: Request): Promise<Response> {
  return app.fetch(request);
}
