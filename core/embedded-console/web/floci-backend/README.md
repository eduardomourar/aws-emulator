# Floci UI backend, in the browser

`secretsmanager.js`, `kms.js`, `iam.js`, `codebuild.js`, `cloudwatch.js`,
`cognitoidentityprovider.js`, `kinesis.js`, `paymentcryptography.js`,
`sqs.js`, `xray.js`, and `ecr.js` are what replace Floci UI's own Node/Bun
backend (`@floci/api`) for this embedded build: each is a browser bundle of
that backend's *real* route/adapter source for one AWS service —
`routes/secretsmanager.ts` for Secrets Manager, `routes/clouds.ts` +
`AwsKmsAdapter`/`AwsIamAdapter`/`AwsCodeBuildAdapter`/`AwsCloudWatchAdapter`/
`AwsCognitoAdapter`/`AwsKinesisAdapter`/`AwsPaymentCryptographyAdapter`/
`AwsSqsAdapter`/`AwsXrayAdapter`/`AwsRegistryAdapter` for the rest — with
only the client construction swapped to point at this emulator's single
synthetic authority (`emulator.local.invalid`) instead of a real network
endpoint. Each one answers requests to its service's own Floci catalog key,
which is not the same string as its AWS SigV4 signing name
(`../external-dispatch-bridge.js` matches on the latter): `identity` for
IAM, `cicd` for CodeBuild, `cloudwatch` for CloudWatch, `cognito` for
Cognito, `streams` for Kinesis, `messaging` for SQS, `registry` for ECR —
`paymentcryptography` and `xray` happen to match their own signing names —
see `router.js`'s own prefix constants.

Aurora DSQL also has a Floci adapter (`AwsDsqlAdapter`), but it opens a real
Postgres connection over `node:net`/`node:dns` to run the cluster's SQL data
plane directly — not something a browser can do at all, regardless of what's
injected into it — so it has no browser bundle here and no wiring in
`router.js` or `../external-dispatch-bridge.js`, even though
`core/embedded-dsql` itself builds and transpiles fine. ECR has no `Aws*Ecr*`
adapter name; it's `AwsRegistryAdapter` (catalog key `registry`) in Floci's
own source.

`catalog.js` is the one exception to "separate bundles, not one" below: it
registers every adapter this build supports (KMS, IAM, CodeBuild,
CloudWatch, Cognito, Secrets Manager, Kinesis, Payment Cryptography, SQS,
X-Ray, ECR), because the registry-dependent generic routes it answers —
`GET /api/clouds`, `GET /api/clouds/aws/status`, `GET /api/clouds/aws/services`
— need to see all of them to report the catalog and connection status
correctly. It never answers a `/services/:service/resources` call itself;
`router.js` sends those to the matching dedicated bundle.

They are deliberately separate bundles otherwise. Floci's own `aws.ts` and
`cloudProxy.ts` each construct nearly every AWS SDK client (and, for
`cloudProxy.ts`, every Azure/GCP/OCI adapter too) as a module-level side
effect the moment anything imports them — so bundling more than one service
together, or going through Floci's generic multi-cloud wiring unmodified,
pulls in every other service's SDK client whether it's used or not. Each
bundle here aliases that fallback import away (see `build-src/*-stub.ts`) and
constructs only the clients it actually needs. `router.js` is the one shared
piece: it inspects an incoming `/api/*` request's path and `import()`s
whichever bundle answers it, so a page that never opens the IAM screen never
even downloads `iam.js`.

`routes/clouds.ts` also has an unconditional `export default createCloudRoutes()`
at its own bottom — called with no arguments, as a side effect of merely
importing the module, regardless of what's actually imported from it. With
no injected service, that falls through to `resolveScopedCloud()`, whose
default parameter reads `process.env` directly. `process` doesn't exist in a
browser, so that otherwise-unused call throws there. Every config for a
bundle that imports `clouds.ts` (`kms`, `iam`, `codebuild`, `cloudwatch`,
`cognitoidentityprovider`, `catalog` — not `secretsmanager`, which never
imports it) defines `process.env` as `({})` to make that dead call harmless
instead of fatal.

## The dispatch that answers `emulator.local.invalid`

Every bundle's AWS SDK client points at one shared synthetic authority,
`emulator.local.invalid`. `../external-dispatch-bridge.js` answers it by
reading the SigV4 credential scope out of the request's own `Authorization`
header and calling whichever real component's authority claims that service
name — directly, in the same patched-`fetch` call, no intermediate wasm
component involved.

`core/embedded-router` did this same dispatch as its own wasm component
instead, originally: a `wasi:http` SERVER that, to answer a request, made an
outgoing CLIENT call to the real target component. That's a nested async
wasm call — a server's own handler making another outgoing call while still
answering the first — and it reproducibly traps
(`wasm trap: cannot enter component instance`, a wit-bindgen JSPI assertion
failure) on this toolchain, the same limitation that already made
`embedded-console-service`'s relay dead code earlier in this project's
history. `embedded-router`'s crate still exists as the authoritative
reference for the signing-name-to-authority table, but it's not part of any
live request path — `build.rs` doesn't build it.

Moving the dispatch into the browser avoids the nested-call trap, but
surfaced a second, narrower limitation: two calls *into the same component
instance* at once — not two different components, which is fine — also
traps (`wasm trap: wasm \`unreachable\` instruction executed`), confirmed by
direct testing. React Query alone routinely fires more than one request to
the same authority at once (a status poll racing a resource list, say), so
`external-dispatch-bridge.js` serializes calls per authority: a call to an
idle authority runs immediately, the next call to that *same* authority
waits for it. Draining each response's body fully before considering that
queue slot done matters here — `fetch()`'s own promise resolves once headers
arrive, while the wasm side can still be streaming the body, so waiting on
just that promise let the next queued call start too early and hit the same
trap this queue exists to prevent.

## Rebuilding

These bundles are vendored build output, the same way `web/jco-out-*/` is a
vendored build output of the Rust `embedded-*` crates — regenerate them when
Floci UI's upstream route/adapter source changes, don't hand-edit them.

1. Clone `floci-io/floci-ui` and `pnpm install` at its root.
2. Copy this directory's `build-src/*.ts` into `packages/api/browser-bundle/`
   in that clone.
3. From `packages/api/`, run each config:
   ```
   vite build --config browser-bundle/vite.secretsmanager.config.ts
   vite build --config browser-bundle/vite.kms.config.ts
   vite build --config browser-bundle/vite.iam.config.ts
   vite build --config browser-bundle/vite.codebuild.config.ts
   vite build --config browser-bundle/vite.cloudwatch.config.ts
   vite build --config browser-bundle/vite.cognitoidentityprovider.config.ts
   vite build --config browser-bundle/vite.kinesis.config.ts
   vite build --config browser-bundle/vite.paymentcryptography.config.ts
   vite build --config browser-bundle/vite.sqs.config.ts
   vite build --config browser-bundle/vite.xray.config.ts
   vite build --config browser-bundle/vite.ecr.config.ts
   vite build --config browser-bundle/vite.catalog.config.ts
   ```
   `vite` isn't resolvable from `packages/api` on its own (see below) — if
   the build fails with `Cannot find package 'vite'`, symlink it in first:
   `ln -s ../../frontend/node_modules/vite packages/api/node_modules/vite`.
4. Copy `browser-bundle/dist/{secretsmanager,kms,iam,codebuild,cloudwatch,cognitoidentityprovider,kinesis,paymentcryptography,sqs,xray,ecr,catalog}.js`
   back into this directory, overwriting the committed copies.

`vite` itself isn't a declared dependency of `packages/api` — it's only ever
installed transitively for `packages/frontend`. Either run the build from
there (`pnpm --filter @floci/frontend exec vite build --config ...`) or make
sure `packages/api/node_modules/vite` resolves to it.
