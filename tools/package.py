import pathlib, zipfile, json
root = pathlib.Path(__file__).resolve().parents[1]
source = root / "extension"
dist = root / "dist"
dist.mkdir(exist_ok=True)
for browser in ("firefox", "chrome"):
    manifest = source / ("manifest.json" if browser == "firefox" else "manifest.chrome.json")
    version = json.loads(manifest.read_text())["version"]
    with zipfile.ZipFile(dist / f"quanta-login-{browser}-{version}.zip", "w", zipfile.ZIP_DEFLATED) as package:
        for path in sorted(source.rglob("*")):
            if path.is_file() and not path.name.startswith("manifest"):
                package.write(path, path.relative_to(source))
        package.writestr("manifest.json", manifest.read_bytes())
    print(f"Built {browser} {version}")
