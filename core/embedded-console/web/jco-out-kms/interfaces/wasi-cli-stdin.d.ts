/** @module Interface wasi:cli/stdin@0.3.0 **/
export function readViaStream(): [AsyncIterable<number>, PromiseLike<Result<void, ErrorCode>> & { [Symbol.dispose]?(): void }];
export type ErrorCode = import('./wasi-cli-types.js').ErrorCode;
export type Result<T, E> = { tag: 'ok', val: T } | { tag: 'err', val: E };
