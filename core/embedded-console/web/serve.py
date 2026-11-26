#!/usr/bin/env python3
"""Static file server for the browser demo, with a correct .wasm MIME type and
the same URL layout as the published GitHub Pages project site.

Chrome's WebAssembly.compileStreaming() requires the exact
"application/wasm" content-type; the stdlib http.server's default
mimetypes database doesn't reliably include it.

Serves this directory's files under `PROJECT_PREFIX`
("https://127.0.0.1:<port>/aws-emulator/..."), never at the bare domain root,
because that prefix IS the fidelity being tested: GitHub Pages serves this
project at `https://eduardomourar.github.io/aws-emulator/`, one path segment
below its own origin, and `index.html`'s own `<base>`/`window.__ROUTER_BASENAME__`
script branches on that exact prefix being present in `location.pathname` —
serving at `/` here would never exercise that branch, so a bug that only
shows up under the prefix (as the asset-404s and the lost-prefix-on-navigate
bug both were) would look fixed locally and still break once published.
"""
import http.server
import os
import sys
import urllib.parse

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
PROJECT_PREFIX = "/aws-emulator"


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        ".wasm": "application/wasm",
    }

    def send_head(self):
        path = urllib.parse.urlsplit(self.path).path

        # Bare root (or the prefix with no trailing slash) has no file of its own
        # at either layout — redirect to where the project site actually lives,
        # the same way a bookmark to the bare domain would land you nowhere useful
        # on the real GitHub Pages host either.
        if path in ("/", PROJECT_PREFIX):
            self.send_response(302)
            self.send_header("Location", PROJECT_PREFIX + "/")
            self.end_headers()
            return None

        # Anything outside the prefix is a 404 here on purpose: GitHub Pages' own
        # domain root is a DIFFERENT site (or nothing at all) that this repo's
        # files have no part in, and a server that served them there too would
        # hide exactly the bug this prefix exists to catch.
        if not path.startswith(PROJECT_PREFIX + "/"):
            self.send_error(404, "File not found")
            return None

        # Strip the prefix before resolving against the filesystem: every file
        # this server has actually lives at THIS directory's own root, the same
        # way GitHub Pages' project-site root is this repo's `gh-pages` branch
        # root, not a `aws-emulator/` subdirectory inside it.
        self.path = self.path[len(PROJECT_PREFIX):] or "/"

        # Floci's frontend uses client-side routing (e.g.
        # `/aws-emulator/cloud-explorer/aws/streams`): that path exists only
        # inside the already-loaded page, never as a file on disk. A fresh
        # navigation or reload hits this server directly, so any GET for a path
        # with no file extension that doesn't match a real file is treated as a
        # client-side route and answered with `index.html` instead of a 404 —
        # the same fallback GitHub Pages' own `404.html` (generated fresh from
        # `index.html` at publish time — see the publish step, never hand-copied
        # here) gives a deep link there.
        rewritten = urllib.parse.urlsplit(self.path).path
        last_segment = rewritten.rsplit("/", 1)[-1]
        looks_like_asset = "." in last_segment
        if not looks_like_asset:
            local_path = self.translate_path(self.path)
            if not os.path.exists(local_path):
                self.path = "/index.html"
        return super().send_head()


if __name__ == "__main__":
    http.server.test(HandlerClass=Handler, port=PORT, bind="127.0.0.1")
