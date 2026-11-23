// SPDX-License-Identifier: CC0-1.0

// Stand-in for `../aws` when bundling a single service for the browser: each
// per-service module always passes its own client explicitly, so this
// fallback value is declared but never read. Aliased in so importing a route
// module doesn't drag in `aws.ts`'s eager construction of every AWS SDK
// client.
export const secretsManager = undefined as never;
export const iam = undefined as never;
export const kms = undefined as never;
export const kinesis = undefined as never;
export const sqs = undefined as never;
