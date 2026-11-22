import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';

const root = process.argv[2] ?? new URL('../../dist/', import.meta.url).pathname;
const files = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name.endsWith('.html')) files.push(path);
  }
}

await walk(root);
if (files.length === 0) throw new Error(`No se encontraron archivos HTML en ${root}`);

const issues = [];
const titles = new Map();
const descriptions = new Map();
const text = (value = '') => value.replace(/<[^>]+>/g, ' ').replace(/&[^;]+;/g, ' ').replace(/\s+/g, ' ').trim();
const attr = (tag, name) => tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'))?.[1];

for (const file of files) {
  const html = await readFile(file, 'utf8');
  const page = relative(root, file);
  // Archivo de propiedad para Google Search Console; no es una página del sitio.
  if (/^google[a-z0-9]+\.html$/i.test(page)) continue;
  const noindex = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html);
  const is404 = page === '404.html';
  const title = text(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]);
  const description = attr(html.match(/<meta[^>]+name=["']description["'][^>]*>/i)?.[0] ?? '', 'content');
  const canonical = attr(html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] ?? '', 'href');

  if (!/<html[^>]+lang=["']es-MX["']/i.test(html)) issues.push([page, 'lang', 'Falta lang="es-MX"']);
  if (!title) issues.push([page, 'title', 'Falta title']);
  if (!description) issues.push([page, 'description', 'Falta meta description']);
  if (!canonical?.startsWith('https://tuseguridad.mx/')) issues.push([page, 'canonical', `Canonical inválido: ${canonical ?? 'ausente'}`]);

  if (!noindex && !is404) {
    if (title.length < 25 || title.length > 65) issues.push([page, 'title-length', `${title.length} caracteres: ${title}`]);
    if ((description?.length ?? 0) < 80 || description.length > 165) {
      issues.push([page, 'description-length', `${description?.length ?? 0} caracteres`]);
    }
    const h1 = html.match(/<h1\b/gi) ?? [];
    if (h1.length !== 1) issues.push([page, 'h1', `${h1.length} encabezados H1`]);
  }

  const headings = [...html.matchAll(/<h([1-6])\b[^>]*>/gi)].map((match) => Number(match[1]));
  for (let i = 1; i < headings.length; i += 1) {
    if (headings[i] > headings[i - 1] + 1) {
      issues.push([page, 'heading-order', `Salto H${headings[i - 1]} → H${headings[i]}`]);
      break;
    }
  }

  for (const tag of html.match(/<img\b[^>]*>/gi) ?? []) {
    if (attr(tag, 'alt') === undefined) issues.push([page, 'image-alt', 'Imagen sin alt']);
    if (!attr(tag, 'width') || !attr(tag, 'height')) issues.push([page, 'image-size', 'Imagen sin width/height']);
  }

  for (const tag of html.match(/<a\b[^>]*target=["']_blank["'][^>]*>/gi) ?? []) {
    const rel = attr(tag, 'rel') ?? '';
    if (!rel.split(/\s+/).includes('noopener')) issues.push([page, 'external-link', 'Enlace _blank sin rel="noopener"']);
  }

  for (const match of html.matchAll(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const schema = JSON.parse(match[1]);
      if (JSON.stringify(schema).includes('aggregateRating')) {
        issues.push([page, 'schema-rating', 'aggregateRating de terceros no permitido']);
      }
    } catch (error) {
      issues.push([page, 'schema-json', `JSON-LD inválido: ${error.message}`]);
    }
  }

  if (!noindex && !is404) {
    titles.set(title, [...(titles.get(title) ?? []), page]);
    descriptions.set(description, [...(descriptions.get(description) ?? []), page]);
  }
}

for (const [value, pages] of titles) {
  if (pages.length > 1) issues.push([pages.join(', '), 'duplicate-title', value]);
}
for (const pages of descriptions.values()) {
  if (pages.length > 1) issues.push([pages.join(', '), 'duplicate-description', `${pages.length} páginas`]);
}

const byType = new Map();
for (const issue of issues) byType.set(issue[1], (byType.get(issue[1]) ?? 0) + 1);

console.log(`HTML auditado: ${files.length} páginas`);
for (const [type, count] of [...byType].sort()) console.log(`- ${type}: ${count}`);
for (const issue of issues.slice(0, 80)) console.log(`ERROR [${issue[1]}] ${issue[0]} — ${issue[2]}`);
if (issues.length > 80) console.log(`… ${issues.length - 80} errores adicionales`);
process.exit(issues.length ? 1 : 0);
