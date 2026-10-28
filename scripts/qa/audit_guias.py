#!/usr/bin/env python3
"""
audit_guias.py — candado editorial y SEO de las guías (src/content/guias).

Creado el 2026-10-28 para la tanda de 65 guías ligadas a las fichas VIP. Revisa
cada guía con `palabraClave` (las anteriores sin ese campo solo entran a la
comparación de similitud):

  · metadatos: tituloSeo ≤ 60, descripción 120–165, palabra clave en título,
    descripción, primeras 120 palabras y al menos un H2; palabra clave única
  · estructura: ≥ 1,500 palabras, ≥ 6 H2, ≥ 1 tabla, ≥ 2 listas, 6–8 FAQ,
    ≥ 2 fuentes, ≤ 3 guiones largos
  · enlaces: rutas internas bien formadas, enlace a la ficha de la empresa
    relacionada y a al menos una de sus páginas de servicio
  · reclamos: los mismos patrones superlativos que audit.py
  · similitud: 8-gramas entre guías; error ≥ 8 %

Uso:  python3 scripts/qa/audit_guias.py [raíz del repo] [--empresa <id>]
      --empresa limita el reporte a las guías de esa empresa (la similitud se
      sigue midiendo contra todas las guías del sitio).
"""
import glob, os, re, sys, itertools, unicodedata
import yaml

args = sys.argv[1:]
SOLO = None
if '--empresa' in args:
    i = args.index('--empresa'); SOLO = args[i + 1]; del args[i:i + 2]
ROOT = args[0] if args else os.getcwd()
G = os.path.join(ROOT, 'src/content/guias')
E = os.path.join(ROOT, 'src/content/empresas')
SE = os.path.join(ROOT, 'src/content/servicios-empresa')

def norm(s):
    s = unicodedata.normalize('NFD', s.lower())
    return ''.join(c for c in s if unicodedata.category(c) != 'Mn')

def split(path):
    c = open(path, encoding='utf-8').read()
    _, fm, body = c.split('---\n', 2)
    return yaml.safe_load(fm), body

FORBIDDEN = [
    r"somos (el|la|los|las) (mejor|mejores|unico|unica)",
    r"(el|la) (unico|unica) (empresa|proveedor|distribuidor)",
    r"(el|la|los|las) (mejor|mejores) (empresa|proveedor|proveedores|opcion)",
    r"lider (indiscutible|absoluto|del mercado|en el mercado)",
    r"numero uno (del|en el|de) (mercado|pais)",
    r"garantizado al 100", r"cero riesgo", r"(nunca|jamas) falla",
    r"de clase mundial", r"sin competencia",
]

empresas = {}
for p in glob.glob(os.path.join(E, '*.md')):
    d, _ = split(p)
    eid = os.path.basename(p)[:-3]
    empresas[eid] = f"/categorias/{d['categoria']}/{d['ciudad']}/{eid}/"
servicios = {}
for p in glob.glob(os.path.join(SE, '*/*.md')):
    eid = os.path.basename(os.path.dirname(p))
    servicios.setdefault(eid, set()).add(empresas.get(eid, '') + os.path.basename(p)[:-3] + '/')

errores, avisos, claves, cuerpos, propias = [], [], {}, {}, set()
files = sorted(glob.glob(os.path.join(G, '*.md')))
nuevas = 0
for p in files:
    gid = os.path.basename(p)[:-3]
    d, body = split(p)
    cuerpos[gid] = body
    if SOLO and SOLO in (d.get('empresas') or []): propias.add(gid)
    kw = d.get('palabraClave')
    if not kw:
        continue
    nuevas += 1
    e = lambda m: errores.append(f'{gid}: {m}')
    k = norm(kw)
    claves.setdefault(k, []).append(gid)
    ts = d.get('tituloSeo') or d.get('titulo', '')
    if len(ts) > 60: e(f'tituloSeo de {len(ts)} car')
    desc = d.get('descripcion', '')
    if not 120 <= len(desc) <= 165: e(f'descripción de {len(desc)} car')
    if k not in norm(ts) and k not in norm(d.get('titulo', '')): e('palabra clave fuera del título')
    if k not in norm(desc): e('palabra clave fuera de la descripción')
    palabras = re.findall(r'\w+', re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', body))
    kw_w = ' '.join(re.findall(r'\w+', k))  # «nom-154-scfi-2005» → «nom 154 scfi 2005»
    if kw_w not in norm(' '.join(palabras[:120])): e('palabra clave fuera de las primeras 120 palabras')
    h2 = re.findall(r'^## (.+)$', body, re.M)
    if len(h2) < 6: e(f'{len(h2)} H2 (mínimo 6)')
    if not any(k in norm(h) for h in h2): e('palabra clave en ningún H2')
    if len(palabras) < 1500: e(f'{len(palabras)} palabras (mínimo 1,500)')
    if not re.search(r'^\|.*\|\s*\n\|[-| :]+\|', body, re.M): e('sin tabla')
    listas = len(re.findall(r'(?:^(?:- |\d+\. ).+\n?){2,}', body, re.M))
    if listas < 2: e(f'{listas} listas (mínimo 2)')
    faq = d.get('faq') or []
    if not 6 <= len(faq) <= 8: e(f'{len(faq)} preguntas frecuentes (6–8)')
    if len(d.get('fuentes') or []) < 2: e('menos de 2 fuentes')
    if body.count('—') > 3: e(f"{body.count('—')} guiones largos (máx. 3)")
    if re.search(r'^# ', body, re.M): e('H1 en el cuerpo (el H1 lo pone la plantilla)')
    links = re.findall(r'\]\((/[^)\s]*)\)', body)
    malos = [l for l in links if not l.endswith('/') or '//' in l]
    if malos: e(f'enlaces internos mal formados: {malos[:3]}')
    emps = d.get('empresas') or []
    if not emps: e('sin empresa relacionada')
    for eid in emps:
        if eid not in empresas: e(f'empresa inexistente: {eid}'); continue
        if empresas[eid] not in links: e(f'no enlaza la ficha {empresas[eid]}')
        if not (set(links) & servicios.get(eid, set())): e(f'no enlaza ninguna página de servicio de {eid}')
    t = norm(body + ' ' + ' '.join(f['q'] + ' ' + f['a'] for f in faq))
    for pat in FORBIDDEN:
        m = re.search(pat, t)
        if m: e(f'reclamo superlativo: {m.group(0)!r}')
    pct = re.findall(r'\b\d{1,3}(?:[.,]\d+)?\s?%', body)
    if pct: avisos.append(f'{gid}: porcentajes a revisar contra fuente: {pct[:5]}')

for k, ids in claves.items():
    if len(ids) > 1: errores.append(f'palabra clave repetida «{k}»: {ids}')

def grams(b):
    w = re.findall(r'\w+', norm(re.sub(r'[#*`>\[\]\(\)_|-]', ' ', b)))
    return set(tuple(w[i:i+8]) for i in range(len(w) - 7))
gr = {g: grams(b) for g, b in cuerpos.items()}
pares = []
for a, b in itertools.combinations(gr, 2):
    u = gr[a] | gr[b]
    if u: pares.append((len(gr[a] & gr[b]) / len(u), a, b))
pares.sort(reverse=True)
for j, a, b in pares:
    if j >= 0.08: errores.append(f'similitud {j*100:.1f} % entre {a} y {b}')

if SOLO:
    toca = lambda x: any(g in x for g in propias)
    errores = [x for x in errores if toca(x)]
    avisos = [x for x in avisos if toca(x)]
    print(f'Filtro --empresa {SOLO}: {len(propias)} guías propias')
print(f'Guías: {len(files)} (con palabra clave: {nuevas})')
print(f'Similitud máxima: {pares[0][0]*100:.2f} % ({pares[0][1]} ↔ {pares[0][2]})' if pares else '')
print('--- AVISOS ---'); [print(' -', a) for a in avisos] or print('ninguno')
print('--- ERRORES ---'); [print(' -', x) for x in errores] or print('ninguno')
sys.exit(1 if errores else 0)
