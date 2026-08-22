#!/usr/bin/env python3
import glob, re, sys, os
import yaml

ROOT = os.path.expanduser("~/mnt/Projects/TUSEGURIDAD")
SE_DIR = os.path.join(ROOT, "src/content/servicios-empresa")

# Vocabulario prohibido.
#
# 2026-08-22: la lista original buscaba palabras sueltas ("el mejor", "el
# unico") y producia 28 falsos positivos sobre 86 paginas — el 100% de sus
# hallazgos. Todos eran usos descriptivos legitimos ("el unico documento que
# cierra una discusion", "el unico extintor a la mano"), no reclamos de la
# empresa. Ese ruido enterraba los hallazgos reales, que es exactamente lo que
# un linter no debe hacer.
#
# Ahora se buscan las CONSTRUCCIONES DE RECLAMO, no las palabras: un superlativo
# solo es problema cuando la empresa se lo aplica a si misma o a su oferta.
FORBIDDEN = [
    # el sujeto es la empresa
    r"somos (el|la|los|las) (mejor|mejores|unico|unica|unicos|unicas)",
    r"(el|la) (unico|unica) (empresa|proveedor|distribuidor|prestador)",
    r"(el|la|los|las) (mejor|mejores) (empresa|proveedor|proveedores|servicio|servicios|opcion|precio|precios)",
    r"(unico|unica) (empresa|proveedor|distribuidor) (autorizado|autorizada|certificado|certificada)",
    # superlativos de mercado
    r"lider (indiscutible|absoluto|del mercado|en el mercado)",
    r"numero uno (del|en el|de) (mercado|pais|ramo|giro|sector)",
    r"(el|la) mas grande de mexico",
    r"sin competencia",
    r"de clase mundial",
    r"sin igual",
    r"pionero absoluto",
    # promesas absolutas
    r"garantizado al 100",
    r"(nunca|jamas) falla",
    r"cero riesgo",
    r"100% ?(por ?ciento )?(seguro|segura|seguros|seguras|garantizado|garantizada|efectivo|efectiva|confiable|confiables|infalible)",
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
    # Un superlativo NEGADO es una advertencia al comprador, no un reclamo:
    # "el polvo quimico no es la mejor opcion para una cocina" es justo el tipo
    # de frase que queremos en el sitio. Se descarta cuando viene precedido de
    # una negacion inmediata.
    NEGACION = re.compile(r"(no|nunca|jamas|tampoco|sin ser|dejo de ser|deja de ser)\s+(es|son|era|eran|fue|seria|sera|resulta|significa)?\s*$")
    for patron in FORBIDDEN:
        for m in re.finditer(patron, texto_completo_lower):
            previo = texto_completo_lower[max(0, m.start() - 24):m.start()]
            if NEGACION.search(previo):
                continue
            errores.append(f"{path}: reclamo superlativo: {m.group(0)!r}")
            break

    # Precios. Proyecto Red publica rangos de referencia reales y verificables,
    # con la salvedad de cotizacion final; esta documentado y es deliberado. Se
    # permite el formato de RANGO ("$450 - $900 MXN") y se sigue marcando el
    # precio cerrado suelto, que es el que no queremos inventado.
    precios = re.findall(r'\$\s?[\d,.]+', body)
    rangos = re.findall(r'\$\s?[\d,.]+\s*[-a\u2013]\s*\$\s?[\d,.]+', body)
    sueltos = len(precios) - 2 * len(rangos)
    if sueltos > 0:
        errores.append(f"{path}: {sueltos} precio(s) cerrado(s) en el cuerpo: revisar que esten declarados por el cliente")

    links = re.findall(r'\]\(([^)]+)\)', body)
    internos = [l for l in links if l.startswith('/')]
    malos = [l for l in internos if '//' in l or not l.endswith('/')]
    if malos:
        errores.append(f"{path}: enlaces internos mal formados: {malos}")

    bug = re.findall(r'\[([^\]]+)\]\(([^)]+)\)', raw_fm)
    if bug:
        errores.append(f"{path}: BUG enlace markdown en frontmatter: {bug}")

    # Deuda saldada (2026-08-22): hasta hoy el chequeo de rutas internas solo
    # miraba el cuerpo, asi que una ruta mal formada dentro de un valor de
    # frontmatter (proceso.texto, faq.a...) pasaba sin detectarse. Ahora se
    # revisan tambien las rutas sueltas del frontmatter.
    rutas_fm = re.findall(r'(?<![\w:/])(/[a-z0-9][a-z0-9\-/]*)', raw_fm)
    malas_fm = [r for r in rutas_fm if '//' in r or not r.endswith('/')]
    if malas_fm:
        errores.append(f"{path}: rutas internas mal formadas en frontmatter: {sorted(set(malas_fm))}")

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
