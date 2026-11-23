// SPDX-License-Identifier: CC0-1.0

import { PaymentCryptographyClient } from "@aws-sdk/client-payment-cryptography";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsPaymentCryptographyAdapter } from "../src/adapter-aws/AwsPaymentCryptographyAdapter";

const paymentCryptography = new PaymentCryptographyClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

const registry = new CloudAdapterRegistry([new AwsPaymentCryptographyAdapter(paymentCryptography)]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handlePaymentCryptographyRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
