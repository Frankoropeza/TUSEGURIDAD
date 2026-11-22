#!/usr/bin/env python3
import glob, re, os, sys

DEFAULT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
ROOT = os.path.abspath(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_ROOT
DIST = os.path.join(ROOT, "dist")

# construir el conjunto de rutas reales (carpetas con index.html -> ruta con /)
rutas_reales = set()
for root, dirs, files in os.walk(DIST):
    if "index.html" in files:
        rel = os.path.relpath(root, DIST)
        if rel == ".":
            rutas_reales.add("/")
        else:
            rutas_reales.add("/" + rel.replace(os.sep, "/") + "/")

html_files = glob.glob(os.path.join(DIST, "**/*.html"), recursive=True)
if not html_files:
    print(f"ERROR: ningún HTML encontrado en {DIST}", file=sys.stderr)
    sys.exit(2)
print(f"Paginas HTML: {len(html_files)}")
print(f"Rutas reales (index.html): {len(rutas_reales)}")

href_re = re.compile(r'href="([^"]+)"')
total_hrefs = 0
dobles = []
sin_barra = []
rotos = []

for hf in html_files:
    with open(hf, encoding="utf-8") as f:
        content = f.read()
    for href in href_re.findall(content):
        if not href.startswith("/"):
            continue  # externo, mailto, tel, anchor relativo
        total_hrefs += 1
        path_only = href.split("#")[0].split("?")[0]
        if "//" in path_only:
            dobles.append((hf, href))
        if path_only and not path_only.endswith("/") and "." not in os.path.basename(path_only):
            sin_barra.append((hf, href))
        if path_only and path_only not in rutas_reales and "." not in os.path.basename(path_only):
            rotos.append((hf, href))

print(f"Total hrefs internos revisados: {total_hrefs}")
print()
print(f"--- Dobles slashes: {len(dobles)} ---")
for hf, h in dobles[:20]:
    print(" ", os.path.relpath(hf, DIST), "->", h)
print()
print(f"--- Sin barra final: {len(sin_barra)} ---")
for hf, h in sin_barra[:20]:
    print(" ", os.path.relpath(hf, DIST), "->", h)
print()
print(f"--- Rotos (no resuelven a una ruta real): {len(rotos)} ---")
for hf, h in rotos[:40]:
    print(" ", os.path.relpath(hf, DIST), "->", h)

sys.exit(1 if dobles or sin_barra or rotos else 0)
