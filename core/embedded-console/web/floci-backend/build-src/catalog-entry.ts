// SPDX-License-Identifier: CC0-1.0

// Answers the registry-dependent generic routes `createCloudRoutes` mounts —
// `GET /`, `GET /:cloud/services`, `GET /:cloud/status` — which need to see
// every adapter this embedded build supports to report them, unlike the
// per-service bundles (`kms.js`, `iam.js`, ...), which each only construct
// the one client their own resource operations need. This bundle never
// answers a `/:cloud/services/:service/...` resource route itself —
// `router.js` sends those to the matching dedicated bundle instead.

import { KMSClient } from "@aws-sdk/client-kms";
import { IAMClient } from "@aws-sdk/client-iam";
import { CodeBuildClient } from "@aws-sdk/client-codebuild";
import { CloudWatchClient } from "@aws-sdk/client-cloudwatch";
import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";
import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";
import { KinesisClient } from "@aws-sdk/client-kinesis";
import { PaymentCryptographyClient } from "@aws-sdk/client-payment-cryptography";
import { SQSClient } from "@aws-sdk/client-sqs";
import { XRayClient } from "@aws-sdk/client-xray";
import { ECRClient } from "@aws-sdk/client-ecr";
import { SNSClient } from "@aws-sdk/client-sns";
import { ACMClient } from "@aws-sdk/client-acm";
import { Route53Client } from "@aws-sdk/client-route-53";
import { CloudFrontClient } from "@aws-sdk/client-cloudfront";
import { S3Client } from "@aws-sdk/client-s3";
import { createCloudRoutes } from "../src/routes/clouds";
import { CloudAdapterRegistry } from "../src/registry/CloudAdapterRegistry";
import { CloudProxyService } from "../src/service/CloudProxyService";
import { AwsKmsAdapter } from "../src/adapter-aws/AwsKmsAdapter";
import { AwsIamAdapter } from "../src/adapter-aws/AwsIamAdapter";
import { AwsCodeBuildAdapter } from "../src/adapter-aws/AwsCodeBuildAdapter";
import { AwsCloudWatchAdapter } from "../src/adapter-aws/AwsCloudWatchAdapter";
import { AwsCognitoAdapter } from "../src/adapter-aws/AwsCognitoAdapter";
import { AwsKinesisAdapter } from "../src/adapter-aws/AwsKinesisAdapter";
import { AwsPaymentCryptographyAdapter } from "../src/adapter-aws/AwsPaymentCryptographyAdapter";
import { AwsSqsAdapter } from "../src/adapter-aws/AwsSqsAdapter";
import { AwsXrayAdapter } from "../src/adapter-aws/AwsXrayAdapter";
import { AwsRegistryAdapter } from "../src/adapter-aws/AwsRegistryAdapter";
import { AwsSnsAdapter } from "../src/adapter-aws/AwsSnsAdapter";
import { AwsAcmAdapter } from "../src/adapter-aws/AwsAcmAdapter";
import { AwsRoute53Adapter } from "../src/adapter-aws/AwsRoute53Adapter";
import { AwsCloudFrontAdapter } from "../src/adapter-aws/AwsCloudFrontAdapter";
import { AwsStorageAdapter } from "../src/adapter-aws/AwsStorageAdapter";
// `AwsSecretsAdapter` isn't here for its resource operations — Secrets
// Manager's real CRUD goes through `secretsmanager.js`'s dedicated legacy
// route (`routeByCloud: {aws: '/secretsmanager'}` in Floci's own service
// catalog), the same as upstream. It's registered here purely so
// `services()`'s catalog listing finds an adapter for the `secrets` key and
// reports `available` instead of `coming_soon` — `CloudProxyService.services()`
// derives availability from `this.registry.get(cloud, entry.service)` alone
// when no `legacyAvailability` override exists, and Secrets Manager's
// catalog entry doesn't set one (matching upstream, where a real
// `AwsSecretsAdapter` is registered in the generic catalog too).
import { AwsSecretsAdapter } from "../src/adapter-aws/AwsSecretsAdapter";

const clientConfig = {
  region: "us-east-1",
  credentials: { accessKeyId: "test", secretAccessKey: "test" },
  endpoint: "https://emulator.local.invalid",
};

const registry = new CloudAdapterRegistry([
  new AwsKmsAdapter(new KMSClient(clientConfig)),
  new AwsIamAdapter(new IAMClient(clientConfig)),
  new AwsCodeBuildAdapter(new CodeBuildClient(clientConfig)),
  new AwsCloudWatchAdapter(new CloudWatchClient(clientConfig)),
  new AwsCognitoAdapter(new CognitoIdentityProviderClient(clientConfig)),
  new AwsSecretsAdapter(new SecretsManagerClient(clientConfig)),
  new AwsKinesisAdapter(new KinesisClient(clientConfig)),
  new AwsPaymentCryptographyAdapter(new PaymentCryptographyClient(clientConfig)),
  new AwsSqsAdapter(new SQSClient(clientConfig)),
  new AwsXrayAdapter(new XRayClient(clientConfig), clientConfig.region),
  new AwsRegistryAdapter(new ECRClient(clientConfig)),
  new AwsSnsAdapter(new SNSClient(clientConfig)),
  new AwsAcmAdapter(new ACMClient(clientConfig)),
  new AwsRoute53Adapter(new Route53Client(clientConfig)),
  new AwsCloudFrontAdapter(new CloudFrontClient(clientConfig)),
  // `forcePathStyle` keeps a bucket addressed as a path under the one synthetic
  // authority every component answers at, instead of as a `<bucket>.`subdomain.
  new AwsStorageAdapter(new S3Client({ ...clientConfig, forcePathStyle: true })),
]);
const service = new CloudProxyService(
  registry,
  { aws: async () => {}, azure: async () => {}, gcp: async () => {}, oci: async () => {} },
  "aws",
  "us-east-1",
);
const app = createCloudRoutes(service);

export async function handleCatalogRequest(request: Request): Promise<Response> {
  return app.fetch(request);
}
