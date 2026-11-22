/** @module Interface wasi:http/client@0.3.0 **/
/**
 * @throws {ErrorCode} To return the error of the result, throw it, or an `Error` that has it as its `payload`.
 */
export function send(request: Request): Promise<Response>;
export type Request = import('./wasi-http-types.js').Request;
export type Response = import('./wasi-http-types.js').Response;
export type ErrorCode = import('./wasi-http-types.js').ErrorCode;
