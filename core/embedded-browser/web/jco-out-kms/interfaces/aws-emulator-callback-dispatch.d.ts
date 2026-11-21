/** @module Interface aws-emulator:callback/dispatch@0.1.0 **/
export function dispatch(request: HttpRequest): HttpResponse;
export interface HttpHeader {
  name: string,
  value: string,
}
export interface HttpRequest {
  method: string,
  uri: string,
  headers: Array<HttpHeader>,
  body: Uint8Array,
}
export interface HttpResponse {
  status: number,
  headers: Array<HttpHeader>,
  body: Uint8Array,
}
