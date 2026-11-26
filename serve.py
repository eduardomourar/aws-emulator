#!/usr/bin/env python3
"""Static file server for the browser demo, with a correct .wasm MIME type.

Chrome's WebAssembly.compileStreaming() requires the exact
"application/wasm" content-type; the stdlib http.server's default
mimetypes database doesn't reliably include it.
"""
import http.server
import os
import sys
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
    }

    # Floci's frontend uses client-side routing (e.g. `/cloud-explorer/aws/streams`):
    # that path exists only inside the already-loaded page, never as a file on
    # disk. A fresh navigation or reload hits this server directly, so any GET for
    # a path with no file extension that doesn't match a real file is treated as
    # a client-side route and answered with `index.html` instead of a 404.
    def send_head(self):
        path = urllib.parse.urlsplit(self.path).path
        last_segment = path.rsplit("/", 1)[-1]
        looks_like_asset = "." in last_segment
        if not looks_like_asset:
            local_path = self.translate_path(path)
            if not os.path.exists(local_path):
                self.path = "/index.html"
        return super().send_head()


if __name__ == "__main__":
    http.server.test(HandlerClass=Handler, port=PORT, bind="127.0.0.1")
