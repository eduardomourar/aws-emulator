// SPDX-License-Identifier: CC0-1.0

// A fetch-like bridge for invoking a `wasi:http/handler@0.3.0` component export
// directly from JS, mirroring `vendor/preview2-shim/in-memory-http.js`'s
// `InMemoryHttpClient` but built against `preview3-shim`'s `Request`/`Response`/
// `Fields` classes (plain JS classes, not preview2-shim's resource-handle types),
// since a wasip3 component's `handle` export takes/returns those directly.
import { types } from "@bytecodealliance/preview3-shim/http";

const { Fields, Request, Response } = types;

function headersToFieldEntries(headers) {
  const entries = [];
  for (const [name, value] of headers.entries()) {
    entries.push([name, new TextEncoder().encode(value)]);
  }
  return entries;
}

function methodToWit(method) {
  const tag = method.toLowerCase();
  const known = ["get", "head", "post", "put", "delete", "connect", "options", "trace", "patch"];
  return known.includes(tag) ? { tag } : { tag: "other", val: method };
}

function schemeToWit(protocol) {
  if (protocol === "https:") return { tag: "HTTPS" };
  if (protocol === "http:") return { tag: "HTTP" };
  return { tag: "other", val: protocol.replace(/:$/, "") };
}

// jco lifts a wasip3 `stream<u8>` into its own async-iterable `Stream` class, not a native
// `ReadableStream` — passing that straight to the `Response` constructor isn't a body type it
// understands, so it silently stringifies the object instead of streaming bytes. Pump the
// async iterator into a real `ReadableStream` so callers (the AWS SDK's body parser, here) see
// real bytes.
function toNativeReadableStream(contents) {
  if (contents == null || contents instanceof ReadableStream) return contents;
  const iterator = contents[Symbol.asyncIterator]();
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await iterator.next();
      if (done) {
        controller.close();
        return;
      }
      controller.enqueue(value instanceof Uint8Array ? value : new Uint8Array(value));
    },
    cancel(reason) {
      return iterator.return?.(reason);
    },
  });
}

export class P3InMemoryHttpClient {
  #handler;
  constructor(handler) {
    this.#handler = typeof handler === "function" ? handler : handler.handle.bind(handler);
  }

  async fetch(fetchRequest) {
    const url = new URL(fetchRequest.url);
    const headers = Fields.fromList(headersToFieldEntries(fetchRequest.headers));
    const contents = fetchRequest.body ?? null;
    const [witRequest] = Request.new(headers, contents, Promise.resolve(undefined), undefined);
    witRequest.setMethod(methodToWit(fetchRequest.method));
    witRequest.setScheme(schemeToWit(url.protocol));
    witRequest.setAuthority(url.host);
    witRequest.setPathWithQuery(url.pathname + (url.search || ""));

    const witResponse = await this.#handler(witRequest);

    const [bodyStream] = Response.consumeBody(witResponse, Promise.resolve({ tag: "ok", val: undefined }));
    const responseHeaders = new globalThis.Headers();
    for (const [name, value] of witResponse.getHeaders().copyAll()) {
      responseHeaders.append(name, new TextDecoder().decode(value));
    }
    return new globalThis.Response(toNativeReadableStream(bodyStream), {
      status: witResponse.getStatusCode(),
      headers: responseHeaders,
    });
  }
}
