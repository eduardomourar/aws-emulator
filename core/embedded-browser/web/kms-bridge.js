// SPDX-License-Identifier: CC0-1.0

// Satisfies the "core" component's `aws-emulator:callback/dispatch` import by
// calling straight into the separately-compiled, separately-cached KMS component.
// Loaded via the importmap entry for the bare specifier `aws-emulator:callback/dispatch`
// that jco's transpile of the "core" component statically imports.
import { dispatch as kmsDispatch } from "./jco-out-kms/kms-emulator.js";

export function dispatch(request) {
  return kmsDispatch.dispatch(request);
}
