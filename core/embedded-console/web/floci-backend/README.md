# Floci UI backend, in the browser

`secretsmanager.js`, `kms.js`, and `iam.js` are what replace Floci UI's own
Node/Bun backend (`@floci/api`) for this embedded build: each is a browser
bundle of that backend's *real* route/adapter source for one AWS service —
`routes/secretsmanager.ts` for Secrets Manager, `routes/clouds.ts` +
`AwsKmsAdapter`/`AwsIamAdapter` for KMS and IAM — with only the client
construction swapped to point at this emulator's single synthetic authority
(`emulator.local.invalid`) instead of a real network endpoint.

They are deliberately three separate bundles, not one. Floci's own
`aws.ts` and `cloudProxy.ts` each construct nearly every AWS SDK client (and,
for `cloudProxy.ts`, every Azure/GCP/OCI adapter too) as a module-level side
effect the moment anything imports them — so bundling more than one service
together, or going through Floci's generic multi-cloud wiring unmodified,
pulls in every other service's SDK client whether it's used or not. Each
bundle here aliases that fallback import away (see `build-src/*-stub.ts`) and
constructs only the one client it actually needs, so `kms.js` has no idea
IAM exists and vice versa. `router.js` is the one shared piece: it inspects
an incoming `/api/*` request's path and `import()`s whichever bundle answers
it, so a page that never opens the IAM screen never even downloads `iam.js`.

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
   ```
4. Copy `browser-bundle/dist/{secretsmanager,kms,iam}.js` back into this
   directory, overwriting the committed copies.

`vite` itself isn't a declared dependency of `packages/api` — it's only ever
installed transitively for `packages/frontend`. Either run the build from
there (`pnpm --filter @floci/frontend exec vite build --config ...`) or make
sure `packages/api/node_modules/vite` resolves to it.
