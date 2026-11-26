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
import { CloudWatchLogsClient } from "@aws-sdk/client-cloudwatch-logs";
import { OpenSearchClient } from "@aws-sdk/client-opensearch";
import { EKSClient } from "@aws-sdk/client-eks";
import { ElasticLoadBalancingV2Client } from "@aws-sdk/client-elastic-load-balancing-v2";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { APIGatewayClient } from "@aws-sdk/client-api-gateway";
import { EC2Client } from "@aws-sdk/client-ec2";
import { LambdaClient } from "@aws-sdk/client-lambda";
import { SFNClient } from "@aws-sdk/client-sfn";
import { EventBridgeClient } from "@aws-sdk/client-eventbridge";
import { ApplicationAutoScalingClient } from "@aws-sdk/client-application-auto-scaling";
import { CloudFormationClient } from "@aws-sdk/client-cloudformation";
import { SSMClient } from "@aws-sdk/client-ssm";
import { ECSClient } from "@aws-sdk/client-ecs";
import { SchedulerClient } from "@aws-sdk/client-scheduler";
import { AppConfigClient } from "@aws-sdk/client-appconfig";
import { AthenaClient } from "@aws-sdk/client-athena";
import { SageMakerClient } from "@aws-sdk/client-sagemaker";
import { EventBridgeV2Client } from "@aws-sdk/client-eventbridgev2";
import { DSQLClient } from "@aws-sdk/client-dsql";
import { RDSClient } from "@aws-sdk/client-rds";
import { ElastiCacheClient } from "@aws-sdk/client-elasticache";
import { STSClient } from "@aws-sdk/client-sts";
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
import { AwsLogsAdapter } from "../src/adapter-aws/AwsLogsAdapter";
import { AwsOpenSearchAdapter } from "../src/adapter-aws/AwsOpenSearchAdapter";
import { AwsEksAdapter } from "../src/adapter-aws/AwsEksAdapter";
import { AwsLoadBalancingAdapter } from "../src/adapter-aws/AwsLoadBalancingAdapter";
import { AwsDynamoDbAdapter } from "../src/adapter-aws/AwsDynamoDbAdapter";
import { AwsApiGatewayAdapter } from "../src/adapter-aws/AwsApiGatewayAdapter";
import { createEksService } from "../src/services/eks";
import { createEc2Service } from "../src/services/ec2";
import { AwsComputeAdapter } from "../src/adapter-aws/AwsComputeAdapter";
import { AwsServerlessAdapter } from "../src/adapter-aws/AwsServerlessAdapter";
import { AwsStepFunctionsAdapter } from "../src/adapter-aws/AwsStepFunctionsAdapter";
import { AwsEventBridgeAdapter } from "../src/adapter-aws/AwsEventBridgeAdapter";
import { AwsApplicationAutoScalingAdapter } from "../src/adapter-aws/AwsApplicationAutoScalingAdapter";
import { AwsCloudFormationAdapter } from "../src/adapter-aws/AwsCloudFormationAdapter";
import { AwsParameterStoreAdapter } from "../src/adapter-aws/AwsParameterStoreAdapter";
import { AwsEcsAdapter } from "../src/adapter-aws/AwsEcsAdapter";
import { AwsSchedulerAdapter } from "../src/adapter-aws/AwsSchedulerAdapter";
import { AwsAppConfigAdapter } from "../src/adapter-aws/AwsAppConfigAdapter";
import { AwsAthenaAdapter } from "../src/adapter-aws/AwsAthenaAdapter";
import { AwsSageMakerAdapter } from "../src/adapter-aws/AwsSageMakerAdapter";
import { AwsEventBridgeV2Adapter } from "../src/adapter-aws/AwsEventBridgeV2Adapter";
import { AwsNetworkingAdapter } from "../src/adapter-aws/AwsNetworkingAdapter";
import { AwsDsqlAdapter } from "../src/adapter-aws/AwsDsqlAdapter";
import { AwsDatabaseAdapter } from "../src/adapter-aws/AwsDatabaseAdapter";
import { AwsElastiCacheAdapter } from "../src/adapter-aws/AwsElastiCacheAdapter";
import { createRdsService } from "../src/services/rds";
import { PostgresDataClient } from "./dsql-data-client-stub";
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
  new AwsLogsAdapter(new CloudWatchLogsClient(clientConfig)),
  new AwsOpenSearchAdapter(new OpenSearchClient(clientConfig)),
  new AwsEksAdapter(createEksService(new EKSClient(clientConfig))),
  new AwsLoadBalancingAdapter(new ElasticLoadBalancingV2Client(clientConfig)),
  new AwsDynamoDbAdapter(new DynamoDBClient(clientConfig)),
  new AwsApiGatewayAdapter(new APIGatewayClient(clientConfig)),
  new AwsComputeAdapter(
    createEc2Service(new EC2Client(clientConfig), new ElasticLoadBalancingV2Client(clientConfig)),
  ),
  new AwsServerlessAdapter(
    new LambdaClient(clientConfig),
    new S3Client({ ...clientConfig, forcePathStyle: true }),
    new DynamoDBClient(clientConfig),
    new SQSClient(clientConfig),
    new KinesisClient(clientConfig),
  ),
  new AwsStepFunctionsAdapter(new SFNClient(clientConfig)),
  new AwsEventBridgeAdapter(new EventBridgeClient(clientConfig)),
  new AwsApplicationAutoScalingAdapter(new ApplicationAutoScalingClient(clientConfig)),
  new AwsCloudFormationAdapter(new CloudFormationClient(clientConfig)),
  new AwsParameterStoreAdapter(new SSMClient(clientConfig)),
  new AwsEcsAdapter(new ECSClient(clientConfig)),
  new AwsSchedulerAdapter(new SchedulerClient(clientConfig)),
  new AwsAppConfigAdapter(new AppConfigClient(clientConfig)),
  new AwsAthenaAdapter(new AthenaClient(clientConfig)),
  new AwsSageMakerAdapter(new SageMakerClient(clientConfig)),
  new AwsEventBridgeV2Adapter(new EventBridgeV2Client(clientConfig)),
  new AwsNetworkingAdapter(createEc2Service(new EC2Client(clientConfig), new ElasticLoadBalancingV2Client(clientConfig))),
  new AwsDsqlAdapter(
    new DSQLClient(clientConfig),
    new STSClient(clientConfig),
    null,
    new PostgresDataClient(),
  ),
  new AwsDatabaseAdapter(createRdsService(new RDSClient(clientConfig)), new RDSClient(clientConfig)),
  new AwsElastiCacheAdapter(new ElastiCacheClient(clientConfig)),
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
