#!/usr/bin/env python3
import os
import subprocess
import sys
import tempfile

QA_DIR = os.path.dirname(os.path.abspath(__file__))


def ejecutar(script, raiz):
    return subprocess.run(
        [sys.executable, os.path.join(QA_DIR, script), raiz],
        capture_output=True,
        text=True,
        check=False,
    )


with tempfile.TemporaryDirectory() as raiz:
    os.makedirs(os.path.join(raiz, 'dist'))

    auditoria = ejecutar('audit.py', raiz)
    assert auditoria.returncode != 0, 'audit.py debe fallar si no encuentra páginas'
    assert 'ninguna página' in (auditoria.stdout + auditoria.stderr).lower()

    crawler = ejecutar('crawl_dist.py', raiz)
    assert crawler.returncode != 0, 'crawl_dist.py debe fallar si dist no contiene HTML'
    assert 'ningún html' in (crawler.stdout + crawler.stderr).lower()

print('Entrypoints QA: OK')
