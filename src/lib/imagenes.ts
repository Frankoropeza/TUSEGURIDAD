/**
 * Catálogo de fotografía del rubro de seguridad privada.
 *
 * Los archivos viven en /public/img/seguridad-privada/ en AVIF, en dos anchos
 * (1280 y 640). El nombre de archivo es la palabra clave, y aquí se le asocia
 * el texto alternativo real de cada grupo.
 *
 * Convención: <slug>-<NN>-<ancho>.avif
 */

export interface GrupoFotos {
  slug: string;
  titulo: string;
  /** texto alternativo base; se numera por variante */
  alt: string;
  total: number;
}

export const RATIO = { w: 1280, h: 714 } as const;
const BASE = '/img/seguridad-privada';

export const FOTOS: GrupoFotos[] = [
  {
    slug: 'control-de-acceso-seguridad-privada',
    titulo: 'Control de acceso',
    alt: 'Oficial de seguridad privada operando el control de acceso de un inmueble',
    total: 12,
  },
  {
    slug: 'guardia-verificando-acceso',
    titulo: 'Verificación de acceso',
    alt: 'Guardia de seguridad verificando la identificación de una persona en el acceso',
    total: 12,
  },
  {
    slug: 'registro-de-visitantes-caseta',
    titulo: 'Registro de visitantes',
    alt: 'Guardia registrando visitantes en la caseta de acceso de un desarrollo',
    total: 12,
  },
  {
    slug: 'patrullaje-condominio-vertical',
    titulo: 'Patrullaje en condominio',
    alt: 'Guardias de seguridad privada patrullando un condominio vertical',
    total: 8,
  },
  {
    slug: 'patrullaje-estacionamiento-subterraneo',
    titulo: 'Patrullaje en estacionamiento',
    alt: 'Oficial de seguridad patrullando un estacionamiento subterráneo',
    total: 8,
  },
  {
    slug: 'inspeccion-perimetral-almacen',
    titulo: 'Inspección perimetral',
    alt: 'Guardia inspeccionando el perímetro de un almacén',
    total: 8,
  },
  {
    slug: 'recepcion-residencial-guardia',
    titulo: 'Recepción residencial',
    alt: 'Personal de seguridad atendiendo a una residente en el acceso del desarrollo',
    total: 8,
  },
  {
    slug: 'monitoreo-cctv-centro-de-control',
    titulo: 'Monitoreo CCTV',
    alt: 'Operador de seguridad monitoreando cámaras CCTV desde el centro de control',
    total: 7,
  },
  {
    slug: 'vigilancia-planta-industrial',
    titulo: 'Vigilancia industrial',
    alt: 'Oficial de seguridad resguardando una planta industrial',
    total: 7,
  },
  {
    slug: 'operadora-monitoreo-cctv',
    titulo: 'Centro de monitoreo',
    alt: 'Operadora de seguridad supervisando el circuito cerrado de televisión',
    total: 4,
  },
  {
    slug: 'guardia-mujer-acceso-peatonal',
    titulo: 'Acceso peatonal',
    alt: 'Guardia de seguridad privada en el acceso peatonal de un inmueble',
    total: 4,
  },
  {
    slug: 'patrullaje-fraccionamiento',
    titulo: 'Patrullaje en fraccionamiento',
    alt: 'Guardias de seguridad privada patrullando un fraccionamiento residencial',
    total: 4,
  },
  {
    slug: 'briefing-personal-de-seguridad',
    titulo: 'Briefing de turno',
    alt: 'Personal de seguridad privada en briefing previo al inicio de turno',
    total: 4,
  },
  {
    slug: 'guardia-seguridad-privada-polanco-cdmx',
    titulo: 'Seguridad en Polanco',
    alt: 'Oficial de seguridad privada resguardando un inmueble en Polanco, Ciudad de México',
    total: 4,
  },
  {
    slug: 'inspeccion-perimetral-instalaciones',
    titulo: 'Inspección de instalaciones',
    alt: 'Guardia de seguridad inspeccionando el perímetro de unas instalaciones',
    total: 3,
  },
];

export const TOTAL_FOTOS = FOTOS.reduce((n, g) => n + g.total, 0);

/** Qué rubros tienen fotografía propia. Al sumar otro rubro, se extiende aquí. */
export const RUBROS_CON_FOTOS: Record<string, string[]> = {
  'seguridad-privada': FOTOS.map((g) => g.slug),
};

export const tieneFotos = (rubro: string): boolean => rubro in RUBROS_CON_FOTOS;

const nn = (n: number): string => String(n).padStart(2, '0');

export interface Foto {
  src: string;
  srcset: string;
  alt: string;
  width: number;
  height: number;
}

/** Devuelve una variante concreta de un grupo (índice base 1). */
export function foto(slug: string, indice = 1): Foto {
  const grupo = FOTOS.find((g) => g.slug === slug);
  if (!grupo) throw new Error(`Grupo de fotos desconocido: ${slug}`);
  const i = ((indice - 1) % grupo.total) + 1;
  const base = `${BASE}/${grupo.slug}-${nn(i)}`;
  return {
    src: `${base}-1280.avif`,
    srcset: `${base}-640.avif 640w, ${base}-1280.avif 1280w`,
    alt: grupo.alt,
    width: RATIO.w,
    height: RATIO.h,
  };
}

/** Todas las variantes de un grupo. */
export function fotosDe(slug: string): Foto[] {
  const grupo = FOTOS.find((g) => g.slug === slug);
  if (!grupo) return [];
  return Array.from({ length: grupo.total }, (_, i) => foto(slug, i + 1));
}

/** Todas las fotos del catálogo, en orden de grupo. */
export function todasLasFotos(): { grupo: GrupoFotos; fotos: Foto[] }[] {
  return FOTOS.map((grupo) => ({ grupo, fotos: fotosDe(grupo.slug) }));
}

/**
 * Selección determinista para ilustrar una página sin repetir:
 * misma semilla → misma foto, así el build es reproducible.
 */
export function fotoPara(semilla: string, offset = 0): Foto {
  let h = 0;
  for (let i = 0; i < semilla.length; i++) h = (h * 31 + semilla.charCodeAt(i)) >>> 0;
  const grupo = FOTOS[(h + offset) % FOTOS.length]!;
  return foto(grupo.slug, ((h >>> 8) % grupo.total) + 1);
}
