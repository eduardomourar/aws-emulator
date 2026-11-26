// SPDX-License-Identifier: CC0-1.0

import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { createSecretsManagerRouter } from "../src/routes/secretsmanager";

const client = new SecretsManagerClient({
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
});

export async function handleSecretsManagerRequest(request: Request): Promise<Response> {
  const app = createSecretsManagerRouter(client);
  return app.fetch(request);
}
