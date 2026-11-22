import { monotonicClock } from "@bytecodealliance/preview2-shim/clocks";
function now() {
    return monotonicClock.now();
}
function getResolution() {
    return monotonicClock.resolution();
}
function waitUntil(when) {
    const pollable = monotonicClock.subscribeInstant(when);
    if (!pollable.ready()) {
        return pollable.block();
    }
}
function waitFor(howLong) {
    const pollable = monotonicClock.subscribeDuration(howLong);
    if (!pollable.ready()) {
        return pollable.block();
    }
}
export default {
    now,
    getResolution,
    waitUntil,
    waitFor,
};
