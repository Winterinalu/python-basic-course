import argparse
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


class StaticAppHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        route = urlsplit(path).path
        prefix = "/python-basic-course"
        if route == prefix or route.startswith(f"{prefix}/"):
            route = route[len(prefix):] or "/"
        if route == "/intro" or route.startswith("/lesson/"):
            route = "/index.html"
        path = route
        return super().translate_path(path)

    def end_headers(self):
        if not self.server.no_isolation:
            self.send_header("Cross-Origin-Opener-Policy", "same-origin")
            self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        super().end_headers()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Serve the static Python Practice app.")
    parser.add_argument(
        "--no-isolation",
        action="store_true",
        help="omit isolation headers to test the GitHub Pages input fallback",
    )
    parser.add_argument("--port", type=int, default=8000)
    args = parser.parse_args()
    address = ("127.0.0.1", args.port)
    print(f"Serving Python Practice at http://{address[0]}:{address[1]}")
    server = ThreadingHTTPServer(address, StaticAppHandler)
    server.no_isolation = args.no_isolation
    server.serve_forever()
