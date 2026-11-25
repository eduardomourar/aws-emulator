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
export const s3 = undefined as never;
export const dynamodb = undefined as never;
export const apiGateway = undefined as never;
export const lambda = undefined as never;
export const cloudformation = undefined as never;
// `AwsDsqlAdapter`'s own `flociApiEndpoint` default parameter; never read since every
// entry here passes its own client and endpoint explicitly.
export const endpoint = undefined as never;
// `services/eks.ts`'s `createEksService`, `services/ec2.ts`'s `createEc2Service` and
// `AwsDsqlAdapter`'s own `dsql`/`sts` default parameters; never read since every entry
// here passes its own client explicitly.
export const awsClients = {
  eks: undefined as never,
  ec2: undefined as never,
  elbv2: undefined as never,
  dsql: undefined as never,
  sts: undefined as never,
};
