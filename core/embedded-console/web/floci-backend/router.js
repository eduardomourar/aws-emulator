// SPDX-License-Identifier: CC0-1.0

// One small dispatcher in front of several independently built,
// independently tree-shaken per-service modules (`secretsmanager.js`,
// `kms.js`, `iam.js`, ... — see this directory's README for how they're
// built from Floci UI's own route/adapter source). Each module only pulls
// in that one service's AWS SDK client; none of them import each other or
// Floci's generic multi-cloud catalog wiring, so loading one never
// downloads or evaluates another's code. Dynamic `import()` here means a
// page that never opens the IAM screen never even fetches `iam.js`.
//
// `catalog.js` is the one exception: the registry-dependent generic routes
// (list clouds, list a cloud's services, a cloud's connection status) need
// to see every adapter this build supports to answer correctly, so it's a
// single bundle importing all of them — see its own header comment. A
// `/:cloud/services/:service/...` resource route never goes there; it's
// matched to its own dedicated bundle below, same as always. The generic
// matches run first since they're exact paths, not prefixes a service path
// would also satisfy.
//
// Every bundle's Hono app is `routes/clouds.ts`'s or `routes/secretsmanager.ts`'s
// own export, UNMOUNTED — its routes are declared relative to wherever
// `@floci/api`'s real `app.ts` would normally mount it (`/api/clouds`,
// `/api/secretsmanager`), not to the real page's `/api/*` origin. Calling
// `app.fetch(request)` with the request's real, full pathname (e.g.
// `/api/clouds/aws/services/kms/resources`) against a route declared as
// `/:cloud/services/:service/resources` simply doesn't match anything — Hono
// has no mount point to account for here, since `app.route()` was never
// called. `withStrippedPrefix` below reproduces exactly what `app.route()`
// does: strip the mount prefix before matching.
function withStrippedPrefix(request, prefix) {
  const url = new URL(request.url);
  url.pathname = url.pathname.slice(prefix.length) || "/";
  return new Request(url, request);
}

// A plain `pathname.startsWith(prefix)` false-matches a service whose own segment is a
// prefix of another's (e.g. `.../services/eventsv2/...` passes `startsWith(".../events")`,
// since "eventsv2" itself starts with "events") — confirmed by a real 501 "no adapter
// registered for aws/eventsv2" because that request landed on `events`'s own dedicated
// bundle instead. Requiring the next character to be "/" or nothing (the prefix is the
// WHOLE next path segment) rules that out.
function matchesPrefix(pathname, prefix) {
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

const SECRETSMANAGER_PREFIX = "/api/secretsmanager";
const CLOUDS_PREFIX = "/api/clouds";
const KMS_PREFIX = "/api/clouds/aws/services/kms";
const IAM_PREFIX = "/api/clouds/aws/services/identity";
const CODEBUILD_PREFIX = "/api/clouds/aws/services/cicd";
const CLOUDWATCH_PREFIX = "/api/clouds/aws/services/cloudwatch";
const COGNITO_PREFIX = "/api/clouds/aws/services/cognito";
const KINESIS_PREFIX = "/api/clouds/aws/services/streams";
const PAYMENTCRYPTOGRAPHY_PREFIX = "/api/clouds/aws/services/paymentcryptography";
const SQS_PREFIX = "/api/clouds/aws/services/messaging";
const XRAY_PREFIX = "/api/clouds/aws/services/xray";
const ECR_PREFIX = "/api/clouds/aws/services/registry";
const SNS_PREFIX = "/api/clouds/aws/services/sns";
const ACM_PREFIX = "/api/clouds/aws/services/certificates";
const ROUTE53_PREFIX = "/api/clouds/aws/services/dns";
const CLOUDFRONT_PREFIX = "/api/clouds/aws/services/cdn";
const S3_PREFIX = "/api/clouds/aws/services/storage";
const CLOUDWATCHLOGS_PREFIX = "/api/clouds/aws/services/logs";
const OPENSEARCH_PREFIX = "/api/clouds/aws/services/search";
const EKS_PREFIX = "/api/clouds/aws/services/k8s";
const ELASTICLOADBALANCINGV2_PREFIX = "/api/clouds/aws/services/loadbalancing";
const DYNAMODB_PREFIX = "/api/clouds/aws/services/nosql";
const APIGATEWAY_PREFIX = "/api/clouds/aws/services/apigateway";
const EC2_PREFIX = "/api/clouds/aws/services/compute";
const LAMBDA_PREFIX = "/api/clouds/aws/services/serverless";
const SFN_PREFIX = "/api/clouds/aws/services/workflows";
const EVENTBRIDGE_PREFIX = "/api/clouds/aws/services/events";
const APPLICATIONAUTOSCALING_PREFIX = "/api/clouds/aws/services/autoscaling";
const CLOUDFORMATION_PREFIX = "/api/clouds/aws/services/iac";
const SSM_PREFIX = "/api/clouds/aws/services/parameters";
const ECS_PREFIX = "/api/clouds/aws/services/containers";
const SCHEDULER_PREFIX = "/api/clouds/aws/services/scheduler";
const APPCONFIG_PREFIX = "/api/clouds/aws/services/configuration";
const ATHENA_PREFIX = "/api/clouds/aws/services/analytics";
const SAGEMAKER_PREFIX = "/api/clouds/aws/services/sagemaker";
const EVENTBRIDGEV2_PREFIX = "/api/clouds/aws/services/eventsv2";
const CATALOG_EXACT_PATHS = new Set(["/api/clouds", "/api/clouds/aws/status", "/api/clouds/aws/services"]);

export async function handleApiRequest(request) {
  const { pathname } = new URL(request.url);

  if (CATALOG_EXACT_PATHS.has(pathname)) {
    const { handleCatalogRequest } = await import("./catalog.js");
    return handleCatalogRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, SECRETSMANAGER_PREFIX)) {
    const { handleSecretsManagerRequest } = await import("./secretsmanager.js");
    return handleSecretsManagerRequest(withStrippedPrefix(request, SECRETSMANAGER_PREFIX));
  }
  if (matchesPrefix(pathname, KMS_PREFIX)) {
    const { handleKmsRequest } = await import("./kms.js");
    return handleKmsRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, IAM_PREFIX)) {
    const { handleIamRequest } = await import("./iam.js");
    return handleIamRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, CODEBUILD_PREFIX)) {
    const { handleCodeBuildRequest } = await import("./codebuild.js");
    return handleCodeBuildRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, CLOUDWATCH_PREFIX)) {
    const { handleCloudWatchRequest } = await import("./cloudwatch.js");
    return handleCloudWatchRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, COGNITO_PREFIX)) {
    const { handleCognitoIdentityProviderRequest } = await import("./cognitoidentityprovider.js");
    return handleCognitoIdentityProviderRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, KINESIS_PREFIX)) {
    const { handleKinesisRequest } = await import("./kinesis.js");
    return handleKinesisRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, PAYMENTCRYPTOGRAPHY_PREFIX)) {
    const { handlePaymentCryptographyRequest } = await import("./paymentcryptography.js");
    return handlePaymentCryptographyRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, SQS_PREFIX)) {
    const { handleSqsRequest } = await import("./sqs.js");
    return handleSqsRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, XRAY_PREFIX)) {
    const { handleXrayRequest } = await import("./xray.js");
    return handleXrayRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, ECR_PREFIX)) {
    const { handleEcrRequest } = await import("./ecr.js");
    return handleEcrRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, SNS_PREFIX)) {
    const { handleSnsRequest } = await import("./sns.js");
    return handleSnsRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, ACM_PREFIX)) {
    const { handleAcmRequest } = await import("./acm.js");
    return handleAcmRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, ROUTE53_PREFIX)) {
    const { handleRoute53Request } = await import("./route53.js");
    return handleRoute53Request(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, CLOUDFRONT_PREFIX)) {
    const { handleCloudFrontRequest } = await import("./cloudfront.js");
    return handleCloudFrontRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, S3_PREFIX)) {
    const { handleS3Request } = await import("./s3.js");
    return handleS3Request(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, CLOUDWATCHLOGS_PREFIX)) {
    const { handleCloudWatchLogsRequest } = await import("./cloudwatchlogs.js");
    return handleCloudWatchLogsRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, OPENSEARCH_PREFIX)) {
    const { handleOpenSearchRequest } = await import("./opensearch.js");
    return handleOpenSearchRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, EKS_PREFIX)) {
    const { handleEksRequest } = await import("./eks.js");
    return handleEksRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, ELASTICLOADBALANCINGV2_PREFIX)) {
    const { handleElasticLoadBalancingV2Request } = await import("./elasticloadbalancingv2.js");
    return handleElasticLoadBalancingV2Request(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, DYNAMODB_PREFIX)) {
    const { handleDynamoDbRequest } = await import("./dynamodb.js");
    return handleDynamoDbRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, APIGATEWAY_PREFIX)) {
    const { handleApiGatewayRequest } = await import("./apigateway.js");
    return handleApiGatewayRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, EC2_PREFIX)) {
    const { handleEc2Request } = await import("./ec2.js");
    return handleEc2Request(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, LAMBDA_PREFIX)) {
    const { handleLambdaRequest } = await import("./lambda.js");
    return handleLambdaRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, SFN_PREFIX)) {
    const { handleSfnRequest } = await import("./sfn.js");
    return handleSfnRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, EVENTBRIDGE_PREFIX)) {
    const { handleEventBridgeRequest } = await import("./eventbridge.js");
    return handleEventBridgeRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, APPLICATIONAUTOSCALING_PREFIX)) {
    const { handleApplicationAutoScalingRequest } = await import("./applicationautoscaling.js");
    return handleApplicationAutoScalingRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, CLOUDFORMATION_PREFIX)) {
    const { handleCloudFormationRequest } = await import("./cloudformation.js");
    return handleCloudFormationRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, SSM_PREFIX)) {
    const { handleSsmRequest } = await import("./ssm.js");
    return handleSsmRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, ECS_PREFIX)) {
    const { handleEcsRequest } = await import("./ecs.js");
    return handleEcsRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, SCHEDULER_PREFIX)) {
    const { handleSchedulerRequest } = await import("./scheduler.js");
    return handleSchedulerRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, APPCONFIG_PREFIX)) {
    const { handleAppConfigRequest } = await import("./appconfig.js");
    return handleAppConfigRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, ATHENA_PREFIX)) {
    const { handleAthenaRequest } = await import("./athena.js");
    return handleAthenaRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, SAGEMAKER_PREFIX)) {
    const { handleSageMakerRequest } = await import("./sagemaker.js");
    return handleSageMakerRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (matchesPrefix(pathname, EVENTBRIDGEV2_PREFIX)) {
    const { handleEventBridgeV2Request } = await import("./eventbridgev2.js");
    return handleEventBridgeV2Request(withStrippedPrefix(request, CLOUDS_PREFIX));
  }

  return new Response("Not Found", { status: 404 });
}
