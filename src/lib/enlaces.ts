import { getCollection } from 'astro:content';

/**
 * Motor de enlazado interno.
 *
 * Regla del proyecto: toda página nueva debe quedar enlazada desde el resto del
 * sitio. En lugar de repartir <a> a mano por cada plantilla, aquí se calculan
 * los bloques de "relacionados" de cada entidad a partir de las colecciones.
 * Si mañana se agrega un rubro, una ciudad o una guía, los enlaces aparecen
 * solos en todas las páginas que corresponda.
 */

export interface Enlace {
  titulo: string;
  href: string;
  meta?: string;
}

export interface BloqueEnlaces {
  titulo: string;
  enlaces: Enlace[];
  /** enlace al listado completo del bloque */
  verTodo?: { titulo: string; href: string };
}

type Coleccion<T extends 'empresas' | 'categorias' | 'ciudades' | 'servicios' | 'guias'> =
  Awaited<ReturnType<typeof getCollection<T>>>;

export interface Datos {
  empresas: Coleccion<'empresas'>;
  categorias: Coleccion<'categorias'>;
  ciudades: Coleccion<'ciudades'>;
  servicios: Coleccion<'servicios'>;
  guias: Coleccion<'guias'>;
}

/** Carga y ordena todas las colecciones una sola vez por página. */
export async function cargarDatos(): Promise<Datos> {
  const [empresas, categorias, ciudades, servicios, guias] = await Promise.all([
    getCollection('empresas'),
    getCollection('categorias'),
    getCollection('ciudades'),
    getCollection('servicios'),
    getCollection('guias'),
  ]);

  return {
    empresas: empresas.sort((a, b) => {
      if (a.data.verificado !== b.data.verificado) return a.data.verificado ? -1 : 1;
      return b.data.orden - a.data.orden;
    }),
    categorias: categorias.sort((a, b) => a.data.orden - b.data.orden),
    ciudades: ciudades.sort((a, b) => a.data.orden - b.data.orden),
    servicios: servicios.sort((a, b) => a.data.orden - b.data.orden),
    guias: guias
      .filter((g) => !g.data.draft)
      .sort((a, b) => b.data.fecha.valueOf() - a.data.fecha.valueOf()),
  };
}

/* ------------------------------------------------------------------ */
/* utilidades                                                          */
/* ------------------------------------------------------------------ */

type Empresa = Datos['empresas'][number];

/** Rubros declarados por una empresa (principal + secundarios), sin duplicados. */
export const rubrosDe = (e: Empresa): string[] => [
  ...new Set([e.data.categoria, ...e.data.categorias]),
];

/** Plazas donde opera una empresa (principal + adicionales), sin duplicados. */
export const ciudadesDe = (e: Empresa): string[] => [
  ...new Set([e.data.ciudad, ...e.data.ciudades]),
];

/** Zonas declaradas: de una plaza concreta, o todas si no se pasa plaza. */
export const zonasDe = (e: Empresa, ciudad?: string): string[] =>
  ciudad ? (e.data.zonas[ciudad] ?? []) : Object.values(e.data.zonas).flat();

/**
 * URL canónica de una ficha de empresa: rubro principal + plaza principal.
 * La ficha se publica anidada bajo cada combinación rubro×plaza donde opera,
 * pero solo esta variante es indexable; las demás llevan rel=canonical aquí.
 */
export const hrefEmpresa = (e: Empresa): string =>
  `/categorias/${e.data.categoria}/${e.data.ciudad}/${e.id}`;

/** URL de la ficha dentro de un cruce concreto (para navegación coherente). */
export const hrefEmpresaEn = (e: Empresa, rubro: string, ciudad: string): string =>
  `/categorias/${rubro}/${ciudad}/${e.id}`;

/** Empresas que pertenecen a un rubro. */
export const empresasDeRubro = (d: Datos, rubro: string) =>
  d.empresas.filter((e) => rubrosDe(e).includes(rubro));

/** Empresas que operan en una plaza (considera plazas adicionales). */
export const empresasDeCiudad = (d: Datos, ciudad: string) =>
  d.empresas.filter((e) => ciudadesDe(e).includes(ciudad));

/** Empresas de un rubro en una plaza — base de las páginas cruzadas. */
export const empresasDeRubroEnCiudad = (d: Datos, rubro: string, ciudad: string) =>
  d.empresas.filter((e) => rubrosDe(e).includes(rubro) && ciudadesDe(e).includes(ciudad));

/** Conteo de empresas por rubro, para mostrar cifras reales. */
export function conteoPorRubro(d: Datos): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of d.empresas) {
    for (const r of rubrosDe(e)) m.set(r, (m.get(r) ?? 0) + 1);
  }
  return m;
}

/** Conteo de empresas por plaza (una empresa cuenta en cada plaza donde opera). */
export function conteoPorCiudad(d: Datos): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of d.empresas) {
    for (const c of ciudadesDe(e)) m.set(c, (m.get(c) ?? 0) + 1);
  }
  return m;
}

const plural = (n: number, s: string, p: string) => `${n} ${n === 1 ? s : p}`;

/* ------------------------------------------------------------------ */
/* constructores de bloques                                            */
/* ------------------------------------------------------------------ */

export function bloqueRubros(
  d: Datos,
  opts: { excluir?: string; titulo?: string } = {}
): BloqueEnlaces {
  const conteo = conteoPorRubro(d);
  return {
    titulo: opts.titulo ?? 'Rubros del directorio',
    verTodo: { titulo: 'Ver todos los rubros', href: '/categorias' },
    enlaces: d.categorias
      .filter((c) => c.id !== opts.excluir)
      .map((c) => ({
        titulo: c.data.nombre,
        href: `/categorias/${c.id}`,
        meta: c.data.destacada ? plural(conteo.get(c.id) ?? 0, 'empresa', 'empresas') : 'En preparación',
      })),
  };
}

export function bloqueCiudades(
  d: Datos,
  opts: { excluir?: string; soloRubro?: string; titulo?: string; limite?: number } = {}
): BloqueEnlaces {
  const conteo = conteoPorCiudad(d);
  const permitidas = opts.soloRubro
    ? new Set(empresasDeRubro(d, opts.soloRubro).flatMap(ciudadesDe))
    : null;

  return {
    titulo: opts.titulo ?? 'Estados',
    verTodo: { titulo: 'Ver los 32 estados', href: '/ciudades' },
    enlaces: d.ciudades
      .filter((c) => c.id !== opts.excluir && (!permitidas || permitidas.has(c.id)))
      // con 32 entidades no caben todas: primero las que sí tienen padrón
      .sort((a, b) => (conteo.get(b.id) ?? 0) - (conteo.get(a.id) ?? 0) || a.data.orden - b.data.orden)
      .slice(0, opts.limite ?? 8)
      .map((c) => ({
        titulo: c.data.nombre,
        href: `/ciudades/${c.id}`,
        meta: plural(conteo.get(c.id) ?? 0, 'empresa', 'empresas'),
      })),
  };
}

export function bloqueServicios(
  d: Datos,
  opts: { excluir?: string; soloRubro?: string; titulo?: string } = {}
): BloqueEnlaces {
  return {
    titulo: opts.titulo ?? 'Servicios',
    verTodo: { titulo: 'Ver todos los servicios', href: '/servicios' },
    enlaces: d.servicios
      .filter((s) => s.id !== opts.excluir)
      .filter((s) => !opts.soloRubro || s.data.rubro === opts.soloRubro)
      .map((s) => ({ titulo: s.data.titulo, href: `/servicios/${s.id}` })),
  };
}

export function bloqueGuias(
  d: Datos,
  opts: { excluir?: string; soloRubro?: string; limite?: number; titulo?: string } = {}
): BloqueEnlaces {
  const fecha = (x: Date) =>
    `${x.getFullYear()}.${String(x.getMonth() + 1).padStart(2, '0')}.${String(x.getDate()).padStart(2, '0')}`;

  return {
    titulo: opts.titulo ?? 'Guías',
    verTodo: { titulo: 'Ver todas las guías', href: '/guias' },
    enlaces: d.guias
      .filter((g) => g.id !== opts.excluir)
      .filter((g) => !opts.soloRubro || g.data.rubros.includes(opts.soloRubro))
      .slice(0, opts.limite ?? 6)
      .map((g) => ({ titulo: g.data.titulo, href: `/guias/${g.id}`, meta: fecha(g.data.fecha) })),
  };
}

export function bloqueEmpresas(
  d: Datos,
  opts: { excluir?: string; rubro?: string; ciudad?: string; limite?: number; titulo?: string } = {}
): BloqueEnlaces {
  const nombreCiudad = new Map(d.ciudades.map((c) => [c.id, c.data.nombre]));

  return {
    titulo: opts.titulo ?? 'Empresas',
    verTodo: { titulo: 'Ver padrón completo', href: '/empresas' },
    enlaces: d.empresas
      .filter((e) => e.id !== opts.excluir)
      .filter((e) => !opts.rubro || rubrosDe(e).includes(opts.rubro))
      .filter((e) => !opts.ciudad || ciudadesDe(e).includes(opts.ciudad))
      .slice(0, opts.limite ?? 6)
      .map((e) => ({
        titulo: e.data.nombre,
        href: hrefEmpresa(e),
        meta: nombreCiudad.get(e.data.ciudad),
      })),
  };
}

/**
 * Enlaces a las páginas cruzadas rubro×plaza (/categorias/<rubro>/<plaza>).
 * Solo existen para rubros activos; ver getStaticPaths de la ruta cruzada.
 */
export function bloqueCruces(
  d: Datos,
  opts: { rubro?: string; ciudad?: string; titulo?: string; limite?: number } = {}
): BloqueEnlaces {
  const activos = d.categorias.filter((c) => c.data.destacada);
  const lim = opts.limite ?? 8;
  const conteoC = conteoPorCiudad(d);
  // 32 estados × rubros no cabe en un bloque: se priorizan los que tienen padrón
  const porPadron = [...d.ciudades].sort(
    (a, b) => (conteoC.get(b.id) ?? 0) - (conteoC.get(a.id) ?? 0) || a.data.orden - b.data.orden
  );

  // rubro fijo → una entrada por plaza
  if (opts.rubro) {
    const rubro = activos.find((c) => c.id === opts.rubro);
    if (!rubro) return { titulo: opts.titulo ?? 'Por plaza', enlaces: [] };
    return {
      titulo: opts.titulo ?? 'Este rubro por estado',
      verTodo: { titulo: 'Ver los 32 estados', href: `/categorias/${rubro.id}#estados` },
      enlaces: porPadron.slice(0, lim).map((c) => ({
        titulo: `${rubro.data.nombre} en ${c.data.nombreCorto ?? c.data.nombre}`,
        href: `/categorias/${rubro.id}/${c.id}`,
        meta: String(empresasDeRubroEnCiudad(d, rubro.id, c.id).length).padStart(2, '0'),
      })),
    };
  }

  // plaza fija → una entrada por rubro activo
  if (opts.ciudad) {
    const ciudad = d.ciudades.find((c) => c.id === opts.ciudad);
    if (!ciudad) return { titulo: opts.titulo ?? 'Por rubro', enlaces: [] };
    return {
      titulo: opts.titulo ?? 'Rubros en esta plaza',
      enlaces: activos.map((r) => ({
        titulo: `${r.data.nombre} en ${ciudad.data.nombreCorto ?? ciudad.data.nombre}`,
        href: `/categorias/${r.id}/${ciudad.id}`,
        meta: String(empresasDeRubroEnCiudad(d, r.id, ciudad.id).length).padStart(2, '0'),
      })),
    };
  }

  // sin filtro → combinaciones más relevantes
  return {
    titulo: opts.titulo ?? 'Rubro por estado',
    enlaces: activos
      .flatMap((r) =>
        porPadron.map((c) => ({
          titulo: `${r.data.nombre} en ${c.data.nombreCorto ?? c.data.nombre}`,
          href: `/categorias/${r.id}/${c.id}`,
          n: empresasDeRubroEnCiudad(d, r.id, c.id).length,
        }))
      )
      .sort((a, b) => b.n - a.n)
      .slice(0, lim)
      .map((x) => ({ titulo: x.titulo, href: x.href, meta: String(x.n).padStart(2, '0') })),
  };
}

/** Descarta bloques vacíos para no renderizar secciones huecas. */
export const conEnlaces = (bloques: BloqueEnlaces[]): BloqueEnlaces[] =>
  bloques.filter((b) => b.enlaces.length > 0);
