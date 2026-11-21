#!/usr/bin/env python3
"""Static file server for the browser demo, with a correct .wasm MIME type.

Chrome's WebAssembly.compileStreaming() requires the exact
"application/wasm" content-type; the stdlib http.server's default
mimetypes database doesn't reliably include it.
"""
import http.server
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
    }


if __name__ == "__main__":
    http.server.test(HandlerClass=Handler, port=PORT, bind="127.0.0.1")
