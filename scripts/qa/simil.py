#!/usr/bin/env python3
import glob, re, os, itertools

ROOT = os.path.expanduser("~/mnt/Projects/TUSEGURIDAD")
SE_DIR = os.path.join(ROOT, "src/content/servicios-empresa")

def cuerpo(path):
    with open(path, encoding="utf-8") as f:
        c = f.read()
    parts = c.split("---", 2)
    body = parts[2] if len(parts) >= 3 else c
    # quitar markdown basico y normalizar
    body = re.sub(r'[#*`>\[\]\(\)_-]', ' ', body)
    words = re.findall(r'\w+', body.lower())
    return words

def ngrams(words, n=8):
    return set(tuple(words[i:i+n]) for i in range(len(words)-n+1))

files = sorted(glob.glob(os.path.join(SE_DIR, "*/*.md")))
grams = {}
for f in files:
    w = cuerpo(f)
    grams[f] = ngrams(w, 8)

resultados = []
for a, b in itertools.combinations(files, 2):
    ga, gb = grams[a], grams[b]
    if not ga or not gb:
        continue
    inter = ga & gb
    union = ga | gb
    if not union:
        continue
    jac = len(inter) / len(union)
    resultados.append((jac, len(inter), a, b))

resultados.sort(reverse=True)
print("--- TOP 20 SIMILITUD (todo el sitio) ---")
for jac, n, a, b in resultados[:20]:
    ra, rb = os.path.relpath(a, ROOT), os.path.relpath(b, ROOT)
    print(f"{jac*100:5.2f}%  ({n:3d} 8-gramas)  {ra}  <->  {rb}")

print()
print("--- PARES QUE INVOLUCRAN GAMADEMEXICO ---")
gama_pairs = [(j,n,a,b) for j,n,a,b in resultados if 'gamademexico' in a or 'gamademexico' in b]
gama_pairs.sort(reverse=True)
for jac, n, a, b in gama_pairs[:30]:
    ra, rb = os.path.relpath(a, ROOT), os.path.relpath(b, ROOT)
    print(f"{jac*100:5.2f}%  ({n:3d} 8-gramas)  {ra}  <->  {rb}")

print()
print(f"Max global: {resultados[0][0]*100:.2f}%")
gama_only_internal = [(j,n,a,b) for j,n,a,b in gama_pairs if 'gamademexico' in a and 'gamademexico' in b]
if gama_only_internal:
    gama_only_internal.sort(reverse=True)
    print(f"Max interno GAMADEMEXICO (entre sus propias 8 paginas): {gama_only_internal[0][0]*100:.2f}%")
gama_vs_other = [(j,n,a,b) for j,n,a,b in gama_pairs if not ('gamademexico' in a and 'gamademexico' in b)]
if gama_vs_other:
    gama_vs_other.sort(reverse=True)
    print(f"Max GAMADEMEXICO vs otro cliente: {gama_vs_other[0][0]*100:.2f}%  ({gama_vs_other[0][2]} <-> {gama_vs_other[0][3]})")
