// SPDX-License-Identifier: CC0-1.0

// One small dispatcher in front of three independently built, independently
// tree-shaken per-service modules (`secretsmanager.js`, `kms.js`, `iam.js` —
// see this directory's README for how they're built from Floci UI's own
// route/adapter source). Each module only pulls in that one service's AWS
// SDK client; none of them import each other or Floci's generic multi-cloud
// catalog wiring, so loading one never downloads or evaluates another's
// code. Dynamic `import()` here means a page that never opens the IAM screen
// never even fetches `iam.js`.
const SECRETSMANAGER_PREFIX = "/api/secretsmanager";
const KMS_PREFIX = "/api/clouds/aws/services/kms";
const IAM_PREFIX = "/api/clouds/aws/services/identity";

export async function handleApiRequest(request) {
  const { pathname } = new URL(request.url);

  if (pathname.startsWith(SECRETSMANAGER_PREFIX)) {
    const { handleSecretsManagerRequest } = await import("./secretsmanager.js");
    return handleSecretsManagerRequest(request);
  }
  if (pathname.startsWith(KMS_PREFIX)) {
    const { handleKmsRequest } = await import("./kms.js");
    return handleKmsRequest(request);
  }
  if (pathname.startsWith(IAM_PREFIX)) {
    const { handleIamRequest } = await import("./iam.js");
    return handleIamRequest(request);
  }

  return new Response("Not Found", { status: 404 });
}
