#!/usr/bin/env python3
"""
Prueba del detector de reclamos superlativos de audit.py.

Existe por una razon concreta: el 2026-08-22 la lista de vocabulario prohibido
producia 28 falsos positivos sobre 86 paginas (el 100% de sus hallazgos), todos
usos descriptivos legitimos de "el unico" / "el mejor". Ese ruido tenia
enterrados los hallazgos reales. Al reescribir el detector para buscar
construcciones de reclamo en vez de palabras sueltas, el riesgo pasa a ser el
contrario: que el linter deje de gritar porque se quedo ciego.

Estos casos fijan las dos fronteras. Correr antes de tocar FORBIDDEN:
    python3 scripts/qa/test_audit.py
"""
import os, re, sys

AUDIT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "audit.py")
src = open(AUDIT, encoding="utf-8").read()

ns = {}
ini = src.index("FORBIDDEN = [")
fin = src.index("]", src.index("infalible)"))+1
exec(src[ini:fin], ns)
FORBIDDEN = ns["FORBIDDEN"]

NEGACION = re.compile(
    r"(no|nunca|jamas|tampoco|sin ser|dejo de ser|deja de ser)"
    r"\s+(es|son|era|eran|fue|seria|sera|resulta|significa)?\s*$")

def detecta(t):
    t = re.sub(r'[áéíóúñ]', lambda m: {'á':'a','é':'e','í':'i','ó':'o','ú':'u','ñ':'n'}[m.group()], t.lower())
    for pat in FORBIDDEN:
        for m in re.finditer(pat, t):
            if NEGACION.search(t[max(0, m.start()-24):m.start()]):
                continue
            return m.group(0)
    return None

# (texto, debe_detectarse)
CASOS = [
    # Reclamos reales: la empresa se atribuye una posicion que nadie verifico.
    ("Somos el mejor proveedor de seguridad de la zona.", True),
    ("Somos la unica empresa autorizada del estado.", True),
    ("El unico proveedor con permiso federal vigente en la plaza.", True),
    ("Unico distribuidor autorizado de la marca en el pais.", True),
    ("Lider indiscutible del mercado de extintores.", True),
    ("Numero uno del mercado en recarga.", True),
    ("La mejor opcion en vigilancia para tu condominio.", True),
    ("Servicio garantizado al 100% sin excepciones.", True),
    ("Cobertura 100% segura para tu inmueble.", True),
    ("Nuestro sistema nunca falla.", True),
    ("Solucion de clase mundial, sin competencia en el ramo.", True),

    # Uso descriptivo o de advertencia: es el registro que queremos en el sitio.
    ("El polvo quimico seco no es la mejor opcion para una cocina.", False),
    ("Es el unico documento que cierra una discusion en la asamblea.", False),
    ("El unico extintor a la mano era un ABC comprado por barato.", False),
    ("Si el unico contacto del proveedor trabaja de nueve a seis, hay hueco.", False),
    ("El tiempo de evacuacion es el primer dato, pero no el unico.", False),
    ("El Cairns MSA 1836 no es el unico modelo del mercado.", False),
    ("Ese proveedor es el unico de la ciudad con papeles en orden.", False),
    ("El acceso es el unico lugar del condominio donde alguien decide algo.", False),
    ("Deja rastro de quien autorizo, el unico dato que cierra la discusion.", False),
]

fallos = []
for texto, esperado in CASOS:
    hit = detecta(texto)
    if (hit is not None) != esperado:
        fallos.append((texto, esperado, hit))

print(f"{len(CASOS)-len(fallos)}/{len(CASOS)} casos correctos")
for t, esp, hit in fallos:
    print(f"  FALLA (esperaba {'detectar' if esp else 'permitir'}, detecto {hit!r}): {t}")
sys.exit(1 if fallos else 0)
