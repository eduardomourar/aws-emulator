/** @module Interface wasi:cli/environment@0.3.0 **/
export function getEnvironment(): Array<[string, string]>;
export function getArguments(): Array<string>;
