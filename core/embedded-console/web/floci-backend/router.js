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
const CATALOG_EXACT_PATHS = new Set(["/api/clouds", "/api/clouds/aws/status", "/api/clouds/aws/services"]);

export async function handleApiRequest(request) {
  const { pathname } = new URL(request.url);

  if (CATALOG_EXACT_PATHS.has(pathname)) {
    const { handleCatalogRequest } = await import("./catalog.js");
    return handleCatalogRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(SECRETSMANAGER_PREFIX)) {
    const { handleSecretsManagerRequest } = await import("./secretsmanager.js");
    return handleSecretsManagerRequest(withStrippedPrefix(request, SECRETSMANAGER_PREFIX));
  }
  if (pathname.startsWith(KMS_PREFIX)) {
    const { handleKmsRequest } = await import("./kms.js");
    return handleKmsRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(IAM_PREFIX)) {
    const { handleIamRequest } = await import("./iam.js");
    return handleIamRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(CODEBUILD_PREFIX)) {
    const { handleCodeBuildRequest } = await import("./codebuild.js");
    return handleCodeBuildRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(CLOUDWATCH_PREFIX)) {
    const { handleCloudWatchRequest } = await import("./cloudwatch.js");
    return handleCloudWatchRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(COGNITO_PREFIX)) {
    const { handleCognitoIdentityProviderRequest } = await import("./cognitoidentityprovider.js");
    return handleCognitoIdentityProviderRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(KINESIS_PREFIX)) {
    const { handleKinesisRequest } = await import("./kinesis.js");
    return handleKinesisRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(PAYMENTCRYPTOGRAPHY_PREFIX)) {
    const { handlePaymentCryptographyRequest } = await import("./paymentcryptography.js");
    return handlePaymentCryptographyRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(SQS_PREFIX)) {
    const { handleSqsRequest } = await import("./sqs.js");
    return handleSqsRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(XRAY_PREFIX)) {
    const { handleXrayRequest } = await import("./xray.js");
    return handleXrayRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }
  if (pathname.startsWith(ECR_PREFIX)) {
    const { handleEcrRequest } = await import("./ecr.js");
    return handleEcrRequest(withStrippedPrefix(request, CLOUDS_PREFIX));
  }

  return new Response("Not Found", { status: 404 });
}
