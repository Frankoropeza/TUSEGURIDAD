import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Lee el frontmatter de las fichas de empresa con fs.
 *
 * `astro.config.mjs` se evalúa antes de que exista `astro:content`, así que el
 * sitemap no puede consultar las colecciones. Solo necesita saber cuál es la
 * URL canónica de cada empresa para no listar las variantes duplicadas.
 */
const DIR = new URL('../content/empresas/', import.meta.url).pathname;

const campo = (fm, clave) => {
  const m = fm.match(new RegExp(`^${clave}:\\s*(.+)$`, 'm'));
  return m ? m[1].trim().replace(/^["']|["']$/g, '') : null;
};

export function rutasCanonicasEmpresas() {
  let archivos = [];
  try {
    archivos = readdirSync(DIR).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
  } catch {
    return new Set();
  }

  const canonicas = new Set();
  for (const archivo of archivos) {
    const texto = readFileSync(join(DIR, archivo), 'utf-8');
    const fm = texto.split('---')[1] ?? '';
    // las fichas de maqueta no entran al sitemap
    if (campo(fm, 'demo') === 'true') continue;
    const categoria = campo(fm, 'categoria');
    const ciudad = campo(fm, 'ciudad');
    if (!categoria || !ciudad) continue;
    const id = archivo.replace(/\.mdx?$/, '');
    canonicas.add(`/categorias/${categoria}/${ciudad}/${id}`);
  }
  return canonicas;
}

/** ¿La URL es una ficha de empresa (4 segmentos bajo /categorias)? */
export const esFichaEmpresa = (ruta) =>
  /^\/categorias\/[^/]+\/[^/]+\/[^/]+$/.test(ruta.replace(/\/$/, ''));

/**
 * Ruta de la ficha de la que cuelga una URL de empresa, sea la ficha misma
 * (4 segmentos) o una de sus páginas de servicio VIP (5 segmentos).
 *
 * Sin esto el filtro del sitemap solo veía la ficha: las páginas de servicio
 * de las plazas no canónicas se listaban aunque se sirven con `noindex`, que
 * es justo la contradicción que el filtro existe para evitar.
 *
 * @returns {string|null} la ruta base sin barra final, o null si no aplica
 */
export const rutaFichaDe = (ruta) => {
  const limpia = ruta.replace(/\/$/, '');
  const m = limpia.match(/^(\/categorias\/[^/]+\/[^/]+\/[^/]+)(?:\/[^/]+)?$/);
  return m ? m[1] : null;
};
