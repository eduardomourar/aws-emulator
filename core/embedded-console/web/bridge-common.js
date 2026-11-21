// SPDX-License-Identifier: CC0-1.0

// Shared AWS-SDK-JS `HttpHandler` that bridges straight into a `jco`-transpiled
// `wasi:http` component's `incoming-handler` export — no network call ever leaves
// the page. One instance per service page, each pointed at that service's own
// component.

export { InMemoryHttpClient } from "./vendor/preview2-shim/in-memory-http.js";

export class EmulatorHttpHandler {
  constructor(emulator) {
    this.emulator = emulator;
  }

  async handle(request) {
    const response = await this.emulator.fetch(toFetchRequest(request));
    const body = new Uint8Array(await response.arrayBuffer());
    const headers = {};
    for (const [name, value] of response.headers.entries()) {
      headers[name] = value;
    }
    return {
      response: { statusCode: response.status, headers, body },
    };
  }

  updateHttpClientConfig() {}

  httpHandlerConfigs() {
    return {};
  }
}

function toFetchRequest(request) {
  const protocol = request.protocol || "https:";
  const host = request.hostname + (request.port ? `:${request.port}` : "");
  const query = buildQueryString(request.query);
  const url = `${protocol}//${host}${request.path || "/"}${query}`;

  const headers = new Headers();
  for (const [name, value] of Object.entries(request.headers || {})) {
    if (value != null) headers.set(name, String(value));
  }

  const init = { method: request.method, headers };
  if (request.body != null && request.method !== "GET" && request.method !== "HEAD") {
    init.body = request.body;
  }
  return new Request(url, init);
}

function buildQueryString(query) {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [name, value] of Object.entries(query)) {
    if (Array.isArray(value)) {
      for (const v of value) params.append(name, v);
    } else if (value != null) {
      params.append(name, value);
    }
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}
