#!/usr/bin/env python3
"""Mint a Chrome Web Store API refresh token via a loopback OAuth flow.

Why this exists: the OAuth 2.0 Playground uses
https://developers.google.com/oauthplayground as its redirect URI. OAuth
clients of type "Desktop app" do not allow arbitrary redirect URIs, so the
playground fails with `Error 400: redirect_uri_mismatch`. Desktop clients DO
allow loopback (127.0.0.1) redirects, which is what this script uses.

Works with a "Desktop app" client out of the box. With a "Web application"
client, first add the printed redirect URI under
Credentials -> your OAuth client -> Authorized redirect URIs.

Usage:
    python3 tools/get-refresh-token.py
    # or
    CLIENT_ID=... CLIENT_SECRET=... python3 tools/get-refresh-token.py

Requires only the Python standard library.
"""

import http.server
import json
import os
import secrets
import sys
import urllib.parse
import urllib.request
import webbrowser

SCOPE = "https://www.googleapis.com/auth/chromewebstore"
PORT = int(os.environ.get("OAUTH_PORT", "8765"))
REDIRECT_URI = f"http://127.0.0.1:{PORT}/callback"
AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"

result = {}


class Handler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != "/callback":
            self.send_response(404)
            self.end_headers()
            return

        params = urllib.parse.parse_qs(parsed.query)
        result.update({k: v[0] for k, v in params.items()})

        ok = "code" in result
        body = (
            "<html><body style='font-family:sans-serif;padding:40px'>"
            f"<h2>{'Authorised' if ok else 'Authorisation failed'}</h2>"
            f"<p>{'You can close this tab and return to the terminal.' if ok else result.get('error', 'unknown error')}</p>"
            "</body></html>"
        ).encode()

        self.send_response(200 if ok else 400)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)
        self.wfile.flush()

        # Stop after the first callback so the process exits.
        raise KeyboardInterrupt

    def log_message(self, *args):
        pass


def post_token(data):
    body = urllib.parse.urlencode(data).encode()
    req = urllib.request.Request(TOKEN_URL, data=body, method="POST")
    req.add_header("Content-Type", "application/x-www-form-urlencoded")
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            return json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        return {"error": "http_error", "detail": e.read().decode()}


def main():
    client_id = os.environ.get("CLIENT_ID") or input("OAuth client ID: ").strip()
    client_secret = os.environ.get("CLIENT_SECRET") or input("OAuth client secret: ").strip()

    if not client_id or not client_secret:
        sys.exit("Both client ID and client secret are required.")

    state = secrets.token_urlsafe(16)
    auth_params = {
        "client_id": client_id,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": SCOPE,
        "access_type": "offline",
        "prompt": "consent",
        "state": state,
    }
    url = f"{AUTH_URL}?{urllib.parse.urlencode(auth_params)}"

    print("\nIf Google reports redirect_uri_mismatch, add this exact value under")
    print("Credentials -> your OAuth client -> Authorized redirect URIs:\n")
    print(f"    {REDIRECT_URI}\n")
    print("Opening the authorisation URL. If the browser does not open, visit:\n")
    print(url)
    print()

    server = http.server.HTTPServer(("127.0.0.1", PORT), Handler)
    try:
        webbrowser.open(url)
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()

    if result.get("error"):
        sys.exit(f"Authorisation failed: {result['error']}")

    if result.get("state") != state:
        sys.exit("State mismatch - aborting rather than trusting the response.")

    code = result.get("code")
    if not code:
        sys.exit("No authorisation code received.")

    tokens = post_token({
        "code": code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    })

    if "refresh_token" not in tokens:
        print("\nToken exchange response did not include a refresh token:")
        print(json.dumps(tokens, indent=2))
        sys.exit(1)

    print("\nSuccess. Store this as the CWS_REFRESH_TOKEN repository secret:\n")
    print(tokens["refresh_token"])
    print("\nDo not commit it, paste it into an issue, or leave it in shell history.")
    print("Set it with:  gh secret set CWS_REFRESH_TOKEN --repo KRoperUK/BulkGooglePhotosDeleteExtension")


if __name__ == "__main__":
    main()
