#!/usr/bin/env python3
import glob, re, sys, os
import yaml

ROOT = os.path.expanduser("~/mnt/Projects/TUSEGURIDAD")
SE_DIR = os.path.join(ROOT, "src/content/servicios-empresa")

FORBIDDEN = [
    "el mejor", "los mejores", "lider indiscutible", "numero uno",
    "sin competencia", "de clase mundial", "sin igual", "revolucionario",
    "pionero absoluto", "el unico", "la unica empresa", "garantizado al 100",
    "nunca falla", "jamas falla", "el mas grande de mexico",
]

errores = []
firmas = {}
perfiles = {}

def leer_fm(path):
    with open(path, encoding="utf-8") as f:
        content = f.read()
    parts = content.split("---", 2)
    if len(parts) < 3:
        return None, content, None
    try:
        fm = yaml.safe_load(parts[1])
    except Exception as e:
        errores.append(f"{path}: YAML invalido: {e}")
        return None, content, None
    body = parts[2]
    return fm, body, parts[1]

files = sorted(glob.glob(os.path.join(SE_DIR, "*/*.md")))
print(f"Auditando {len(files)} paginas de servicio de empresa...")

for path in files:
    fm, body, raw_fm = leer_fm(path)
    if fm is None:
        continue
    fname = os.path.basename(path).replace(".md", "")
    empresa_folder = os.path.basename(os.path.dirname(path))

    if fm.get("slug") != fname:
        errores.append(f"{path}: slug={fm.get('slug')!r} != archivo {fname!r}")
    if fm.get("empresa") != empresa_folder:
        errores.append(f"{path}: empresa={fm.get('empresa')!r} != carpeta {empresa_folder!r}")

    tseo = fm.get("tituloSeo")
    if tseo and len(tseo) > 65:
        errores.append(f"{path}: tituloSeo largo ({len(tseo)} car): {tseo!r}")
    desc = fm.get("descripcion", "")
    if not (50 <= len(desc) <= 175):
        errores.append(f"{path}: descripcion fuera de rango ({len(desc)} car)")

    texto_completo_lower = re.sub(r'[áéíóúñ]', lambda m: {'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n'}[m.group()], (str(fm) + body).lower())
    for palabra in FORBIDDEN:
        if palabra in texto_completo_lower:
            errores.append(f"{path}: vocabulario prohibido: {palabra!r}")

    if re.search(r'\$\s?\d', body):
        errores.append(f"{path}: posible precio en pesos/dolares en el cuerpo: revisar")

    links = re.findall(r'\]\(([^)]+)\)', body)
    internos = [l for l in links if l.startswith('/')]
    malos = [l for l in internos if '//' in l or not l.endswith('/')]
    if malos:
        errores.append(f"{path}: enlaces internos mal formados: {malos}")

    bug = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', raw_fm)
    if bug:
        errores.append(f"{path}: BUG enlace markdown en frontmatter: {bug}")

    emdashes = body.count("—")
    if emdashes > 3:
        errores.append(f"{path}: {emdashes} guiones largos (limite sugerido 3)")

    inc = len(fm.get("incluye", []) or [])
    mod = len(fm.get("modalidades", []) or [])
    par = len(fm.get("paraQuien", []) or [])
    pro = len(fm.get("proceso", []) or [])
    err = len(fm.get("errores", []) or [])
    glo = len(fm.get("glosario", []) or [])
    ent = len(fm.get("entregables", []) or [])
    faq = len(fm.get("faq", []) or [])
    firma = (inc, mod, par, pro, err, glo, ent, faq)
    firmas.setdefault(firma, []).append(path)
    perfiles[path] = firma

print()
print("--- CONTEOS (perfil) ---")
for path in files:
    f = perfiles.get(path)
    if f:
        rel = os.path.relpath(path, ROOT)
        print(f"{rel:70s} inc{f[0]} mod{f[1]} par{f[2]} pro{f[3]} err{f[4]} glo{f[5]} ent{f[6]} faq{f[7]}")

print()
print("--- FIRMAS DUPLICADAS (todo el sitio) ---")
dup_found = False
for firma, paths in firmas.items():
    if len(paths) > 1:
        dup_found = True
        print(f"{firma}: {paths}")
if not dup_found:
    print("ninguna")

print()
print("--- ERRORES ---")
if errores:
    for e in errores:
        print(" -", e)
else:
    print("ninguno")

sys.exit(1 if errores else 0)
