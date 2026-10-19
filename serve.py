from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit


class StaticAppHandler(SimpleHTTPRequestHandler):
    def translate_path(self, path):
        route = urlsplit(path).path
        if route == "/intro" or route.startswith("/lesson/"):
            path = "/index.html"
        return super().translate_path(path)

    def end_headers(self):
        self.send_header("Cross-Origin-Opener-Policy", "same-origin")
        self.send_header("Cross-Origin-Embedder-Policy", "require-corp")
        super().end_headers()


if __name__ == "__main__":
    address = ("127.0.0.1", 8000)
    print(f"Serving Python Practice at http://{address[0]}:{address[1]}")
    ThreadingHTTPServer(address, StaticAppHandler).serve_forever()
