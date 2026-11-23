/** @module Interface wasi:clocks/system-clock@0.3.0 **/
export function now(): Instant;
export interface Instant {
  seconds: bigint,
  nanoseconds: number,
}
