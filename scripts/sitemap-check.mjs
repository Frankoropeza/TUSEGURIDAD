// sitemap-check.mjs — postbuild de sitemap para sitios Astro de OrigenLab.
// Origen: REDEIL commit c7fa62a (2026-09-23). Copiar a scripts/ del repo y encadenar:
//   "postbuild": "node scripts/build-id.mjs && node scripts/sitemap-check.mjs"
// 1) Publica /sitemap.xml como copia exacta de /sitemap-index.xml (200, no 301).
// 2) Contrato: cada <loc> existe en dist y no lleva noindex; si no, el build falla.
// Ajustar SITE. Hacer SIEMPRE la prueba negativa (meter una pagina noindex -> debe fallar).
// v1.1 (2026-09-23): resuelve tambien build.format='file' (loc sin barra -> <ruta>.html).
// v1.2 (2026-09-23, BOMBERO): revisa todos los sitemap-*.xml (no solo los numerados), p. ej. sitemap-directorio.xml.
// v1.3 (2026-09-23, FIREFIGHTERSMX): decodifica percent-encoding del <loc> (slugs con acentos) antes de buscar el archivo.
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
const DIST = 'dist';
const SITE = 'https://tuseguridad.mx';
const index = path.join(DIST, 'sitemap-index.xml');
if (!existsSync(index)) { console.error('sitemap-check: falta dist/sitemap-index.xml'); process.exit(1); }
writeFileSync(path.join(DIST, 'sitemap.xml'), readFileSync(index));
const errors = []; let total = 0;
for (const file of readdirSync(DIST).filter((f) => /^sitemap-(?!index).+\.xml$/.test(f))) {
  const xml = readFileSync(path.join(DIST, file), 'utf-8');
  for (const [, loc] of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    total++;
    const rel = decodeURIComponent(loc.replace(SITE, '')); // v1.3: slugs con acentos van percent-encoded en el sitemap
    const candidates = rel === '' || rel === '/'
      ? [path.join(DIST, 'index.html')]
      : rel.endsWith('/') ? [path.join(DIST, rel, 'index.html')] : [path.join(DIST, rel + '.html'), path.join(DIST, rel, 'index.html'), path.join(DIST, rel)];
    const html = candidates.find((c) => existsSync(c));
    if (!html) { errors.push(`sin archivo: ${loc}`); continue; }
    const head = readFileSync(html, 'utf-8').slice(0, 20000);
    if (/<meta[^>]+name=["']robots["'][^>]*noindex/i.test(head) || /<meta[^>]+noindex[^>]*name=["']robots["']/i.test(head)) errors.push(`noindex dentro del sitemap: ${loc}`);
  }
}
if (errors.length) { console.error(`sitemap-check: ${errors.length} error(es)\n` + errors.join('\n')); process.exit(1); }
console.log(`sitemap-check: /sitemap.xml publicado; ${total} URLs verificadas (existen, sin noindex)`);
