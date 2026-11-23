// SPDX-License-Identifier: CC0-1.0

// Stand-in for `./runtimeProbe` when bundling a single AWS service for the
// browser: `CloudProxyService.ts` imports `runtimeProbes` at module scope for
// its constructor's default parameter, and the real module pulls in the
// Azure/GCP/OCI client modules just to build that default — even when every
// caller here always passes its own explicit `probes` argument instead. This
// stub breaks that transitive pull-in; its exports are declared, not called.
export type RuntimeProbe = () => Promise<void>;

const noop: RuntimeProbe = async () => {};

export const runtimeProbes: Record<"aws" | "azure" | "gcp" | "oci", RuntimeProbe> = {
  aws: noop,
  azure: noop,
  gcp: noop,
  oci: noop,
};

export function endpointFor(): string | null {
  return null;
}
