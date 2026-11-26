// SPDX-License-Identifier: CC0-1.0

import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsCognitoAdapter } from "../src/adapter-aws/AwsCognitoAdapter";

const cognito = new CognitoIdentityProviderClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsCognitoAdapter(cognito)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleCognitoIdentityProviderRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
