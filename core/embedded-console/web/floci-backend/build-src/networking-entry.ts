// SPDX-License-Identifier: CC0-1.0

import { EC2Client } from "@aws-sdk/client-ec2";
import { ElasticLoadBalancingV2Client } from "@aws-sdk/client-elastic-load-balancing-v2";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsNetworkingAdapter } from "../src/adapter-aws/AwsNetworkingAdapter";
import { createEc2Service } from "../src/services/ec2";

const clientConfig = {
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
};

const registry = new CloudAdapterRegistry([
  new AwsNetworkingAdapter(
    createEc2Service(new EC2Client(clientConfig), new ElasticLoadBalancingV2Client(clientConfig)),
  ),
]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleNetworkingRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
