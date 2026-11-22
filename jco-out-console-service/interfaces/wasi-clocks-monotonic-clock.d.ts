/** @module Interface wasi:clocks/monotonic-clock@0.3.0 **/
export function now(): Mark;
export function waitFor(howLong: Duration): Promise<void> | void;
export type Mark = bigint;
export type Duration = import('./wasi-clocks-types.js').Duration;
