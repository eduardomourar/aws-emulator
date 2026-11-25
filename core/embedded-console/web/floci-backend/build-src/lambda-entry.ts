// SPDX-License-Identifier: CC0-1.0

import { LambdaClient } from "@aws-sdk/client-lambda";
import { S3Client } from "@aws-sdk/client-s3";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { SQSClient } from "@aws-sdk/client-sqs";
import { KinesisClient } from "@aws-sdk/client-kinesis";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsServerlessAdapter } from "../src/adapter-aws/AwsServerlessAdapter";

const clientConfig = {
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
};

const registry = new CloudAdapterRegistry([
  new AwsServerlessAdapter(
    new LambdaClient(clientConfig),
    new S3Client({ ...clientConfig, forcePathStyle: true }),
    new DynamoDBClient(clientConfig),
    new SQSClient(clientConfig),
    new KinesisClient(clientConfig),
  ),
]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleLambdaRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
