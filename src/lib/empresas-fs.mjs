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

/**
 * Rubro×plaza sin ninguna ficha VIP ni padrón oficial: la página se genera
 * igual (permite registrar la primera empresa de esa plaza), pero sin una
 * sola entidad real que mostrar no aporta nada a un buscador y compite por
 * crawl budget con las páginas que sí tienen contenido. Se listan aquí para
 * que el sitemap las excluya, en espejo del `noindex` que la página misma
 * se pone en tiempo de render (ver `empresas.length === 0 && !padron` en
 * `[id]/[ciudad].astro`).
 */
export function rutasCrucesVacios() {
  const DIR_CATEGORIAS = new URL('../content/categorias/', import.meta.url).pathname;
  const DIR_CIUDADES = new URL('../content/ciudades/', import.meta.url).pathname;
  const DIR_EMPRESAS = new URL('../content/empresas/', import.meta.url).pathname;
  const DIR_PADRON = new URL('../data/padron/', import.meta.url).pathname;

  const leerFm = (dir, archivo) => {
    const texto = readFileSync(join(dir, archivo), 'utf-8');
    return texto.split('---')[1] ?? '';
  };
  const campoLista = (fm, clave) => {
    // ["a", "b"] o [] en una sola línea del frontmatter
    const m = fm.match(new RegExp(`^${clave}:\\s*\\[(.*)\\]\\s*$`, 'm'));
    if (!m) return [];
    return m[1]
      .split(',')
      .map((x) => x.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  };

  let archivosCategorias = [];
  let archivosCiudades = [];
  let archivosEmpresas = [];
  let archivosPadron = [];
  try {
    archivosCategorias = readdirSync(DIR_CATEGORIAS).filter((f) => f.endsWith('.md'));
    archivosCiudades = readdirSync(DIR_CIUDADES).filter((f) => f.endsWith('.md'));
    archivosEmpresas = readdirSync(DIR_EMPRESAS).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
    archivosPadron = readdirSync(DIR_PADRON).filter((f) => f.endsWith('.json'));
  } catch {
    return new Set();
  }

  const rubrosActivos = archivosCategorias
    .filter((f) => campo(leerFm(DIR_CATEGORIAS, f), 'destacada') === 'true')
    .map((f) => f.replace(/\.md$/, ''));
  const todasCiudades = archivosCiudades.map((f) => f.replace(/\.md$/, ''));

  const poblados = new Set();
  for (const archivo of archivosEmpresas) {
    const fm = leerFm(DIR_EMPRESAS, archivo);
    if (campo(fm, 'demo') === 'true') continue;
    const rubros = [campo(fm, 'categoria'), ...campoLista(fm, 'categorias')].filter(Boolean);
    const ciudad = campo(fm, 'ciudad');
    const ciudades = [ciudad, ...campoLista(fm, 'ciudades')].filter(Boolean);
    for (const r of rubros) for (const c of ciudades) poblados.add(`${r}::${c}`);
  }

  const conPadron = new Set();
  for (const archivo of archivosPadron) {
    const datos = JSON.parse(readFileSync(join(DIR_PADRON, archivo), 'utf-8'));
    if (datos.rubro && datos.plaza) conPadron.add(`${datos.rubro}::${datos.plaza}`);
  }

  const vacios = new Set();
  for (const r of rubrosActivos) {
    for (const c of todasCiudades) {
      const clave = `${r}::${c}`;
      if (!poblados.has(clave) && !conPadron.has(clave)) {
        vacios.add(`/categorias/${r}/${c}`);
      }
    }
  }
  return vacios;
}
