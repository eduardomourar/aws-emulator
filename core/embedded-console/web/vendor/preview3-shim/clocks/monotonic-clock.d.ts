import type { Mark, Duration } from "../../../types/interfaces/wasi-clocks-monotonic-clock.d.ts";
declare function now(): Mark;
declare function getResolution(): Duration;
declare function waitUntil(when: Mark): void | Promise<void>;
declare function waitFor(howLong: Duration): void | Promise<void>;
declare const _default: {
    now: typeof now;
    getResolution: typeof getResolution;
    waitUntil: typeof waitUntil;
    waitFor: typeof waitFor;
};
export default _default;
export type * from "../../../types/interfaces/wasi-clocks-monotonic-clock.d.ts";
