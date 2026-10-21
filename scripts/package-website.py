"""Build the cached website payload and its HTTPS release metadata."""
import base64
import hashlib
import json
import mimetypes
from pathlib import Path
import re
import zipfile

root = Path(__file__).resolve().parent.parent
manifest = json.loads((root / "manifest.json").read_text())
sources = json.loads((root / "website-sources.json").read_text())
version = manifest["version"]

def asset(match):
    path = root / "assets" / match[1]
    mime = {".woff2": "font/woff2", ".svg": "image/svg+xml"}.get(path.suffix)
    mime = mime or mimetypes.guess_type(path)[0] or "application/octet-stream"
    return f"data:{mime};base64,{base64.b64encode(path.read_bytes()).decode()}"

css = "\n".join((root / name).read_text(encoding="utf-8") for name in sources["css"])
css = re.sub(r"chrome-extension://__MSG_@@extension_id__/assets/([^'\")\s]+)", asset, css)
payload = {"schema": 1, "version": version, "loaderApi": 1, "css": css,
           "scripts": [{"name": name, "code": (root / name).read_text(encoding="utf-8")} for name in sources["js"]]}
payload["popup"] = {"schema": 1,
    "js": (root / "assets/popup/popup.js").read_text(encoding="utf-8"),
    "css": (root / "assets/popup/popup.css").read_text(encoding="utf-8"),
    "logo": "data:image/png;base64," + base64.b64encode((root / "assets/larpblox-logo.png").read_bytes()).decode()}
data = (json.dumps(payload, separators=(",", ":"), ensure_ascii=False) + "\n").encode()
(root / "website-bundle.json").write_bytes(data)
output = root / "website-release"
output.mkdir(exist_ok=True)
name = f"website-{version}.json"
(output / name).write_bytes(data)
(output / "website-latest.json").write_text(json.dumps({
    "schema": 1, "version": version, "loaderApi": 1, "size": len(data),
    "sha256": hashlib.sha256(data).hexdigest(),
    "url": f"https://github.com/3xjn/larpblox-extension/releases/download/v{version}/{name}",
}, separators=(",", ":")) + "\n", encoding="utf-8")
print(f"Built website {version}: {len(data):,} bytes")
loader = output / f"Larpblox-Loader-{version}.zip"
with zipfile.ZipFile(loader, "w", zipfile.ZIP_DEFLATED) as archive:
    for name in ("manifest.json", "larpbux-game-background.js", "larpbux-game-bridge.js",
                 "remote-loader.js", "remote-bootstrap.js", "larpbux-body-colors.js", "popup.html",
                 "popup-host.js", "popup-sandbox.html", "popup-sandbox.js",
                 "website-bundle.json", "README.md", "THEME-LICENSE.txt",
                 "src/popup/LICENSE-COSS.txt", "src/popup/NOTICE.txt"):
        archive.write(root / name, f"larpblox-extension/{name}")
    for path in sorted((root / "assets").rglob("*")):
        if path.is_file():
            archive.write(path, f"larpblox-extension/{path.relative_to(root).as_posix()}")
print(f"Built loader: {loader.name}")
