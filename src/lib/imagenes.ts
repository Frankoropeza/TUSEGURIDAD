/**
 * Catálogo de fotografía del directorio, por rubro.
 *
 * Los archivos viven en /public/img/<categoria>/ en AVIF, en dos anchos
 * (1280 y 640). El nombre de archivo es la palabra clave, y aquí se le asocia
 * el texto alternativo real de cada grupo.
 *
 * Convención: <slug>-<NN>-<ancho>.avif
 *
 * Cada grupo declara su `categoria` (el id del rubro al que pertenece). Al
 * sumar un rubro nuevo con fotografía propia, se agregan sus grupos aquí con
 * esa categoria: no hace falta tocar nada más, `tieneFotos()` y `fotoPara()`
 * ya filtran por ella.
 */

export interface GrupoFotos {
  slug: string;
  /** id del rubro (categoria) al que pertenece este grupo */
  categoria: string;
  titulo: string;
  /** texto alternativo base; se numera por variante */
  alt: string;
  total: number;
}

export const RATIO = { w: 1280, h: 714 } as const;

export const FOTOS: GrupoFotos[] = [
  // ── seguridad-privada ────────────────────────────────────────────
  {
    slug: 'control-de-acceso-seguridad-privada',
    categoria: 'seguridad-privada',
    titulo: 'Control de acceso',
    alt: 'Oficial de seguridad privada operando el control de acceso de un inmueble',
    total: 12,
  },
  {
    slug: 'guardia-verificando-acceso',
    categoria: 'seguridad-privada',
    titulo: 'Verificación de acceso',
    alt: 'Guardia de seguridad verificando la identificación de una persona en el acceso',
    total: 12,
  },
  {
    slug: 'registro-de-visitantes-caseta',
    categoria: 'seguridad-privada',
    titulo: 'Registro de visitantes',
    alt: 'Guardia registrando visitantes en la caseta de acceso de un desarrollo',
    total: 12,
  },
  {
    slug: 'patrullaje-condominio-vertical',
    categoria: 'seguridad-privada',
    titulo: 'Patrullaje en condominio',
    alt: 'Guardias de seguridad privada patrullando un condominio vertical',
    total: 8,
  },
  {
    slug: 'patrullaje-estacionamiento-subterraneo',
    categoria: 'seguridad-privada',
    titulo: 'Patrullaje en estacionamiento',
    alt: 'Oficial de seguridad patrullando un estacionamiento subterráneo',
    total: 8,
  },
  {
    slug: 'inspeccion-perimetral-almacen',
    categoria: 'seguridad-privada',
    titulo: 'Inspección perimetral',
    alt: 'Guardia inspeccionando el perímetro de un almacén',
    total: 8,
  },
  {
    slug: 'recepcion-residencial-guardia',
    categoria: 'seguridad-privada',
    titulo: 'Recepción residencial',
    alt: 'Personal de seguridad atendiendo a una residente en el acceso del desarrollo',
    total: 8,
  },
  {
    slug: 'monitoreo-cctv-centro-de-control',
    categoria: 'seguridad-privada',
    titulo: 'Monitoreo CCTV',
    alt: 'Operador de seguridad monitoreando cámaras CCTV desde el centro de control',
    total: 7,
  },
  {
    slug: 'vigilancia-planta-industrial',
    categoria: 'seguridad-privada',
    titulo: 'Vigilancia industrial',
    alt: 'Oficial de seguridad resguardando una planta industrial',
    total: 7,
  },
  {
    slug: 'operadora-monitoreo-cctv',
    categoria: 'seguridad-privada',
    titulo: 'Centro de monitoreo',
    alt: 'Operadora de seguridad supervisando el circuito cerrado de televisión',
    total: 4,
  },
  {
    slug: 'guardia-mujer-acceso-peatonal',
    categoria: 'seguridad-privada',
    titulo: 'Acceso peatonal',
    alt: 'Guardia de seguridad privada en el acceso peatonal de un inmueble',
    total: 4,
  },
  {
    slug: 'patrullaje-fraccionamiento',
    categoria: 'seguridad-privada',
    titulo: 'Patrullaje en fraccionamiento',
    alt: 'Guardias de seguridad privada patrullando un fraccionamiento residencial',
    total: 4,
  },
  {
    slug: 'briefing-personal-de-seguridad',
    categoria: 'seguridad-privada',
    titulo: 'Briefing de turno',
    alt: 'Personal de seguridad privada en briefing previo al inicio de turno',
    total: 4,
  },
  {
    slug: 'guardia-seguridad-privada-polanco-cdmx',
    categoria: 'seguridad-privada',
    titulo: 'Seguridad en Polanco',
    alt: 'Oficial de seguridad privada resguardando un inmueble en Polanco, Ciudad de México',
    total: 4,
  },
  {
    slug: 'inspeccion-perimetral-instalaciones',
    categoria: 'seguridad-privada',
    titulo: 'Inspección de instalaciones',
    alt: 'Guardia de seguridad inspeccionando el perímetro de unas instalaciones',
    total: 3,
  },

  // ── seguridad-contra-incendios ───────────────────────────────────
  {
    slug: 'extintor-portatil-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Extintores portátiles',
    alt: 'Extintor portátil contra incendios certificado, listo para venta o mantenimiento',
    total: 12,
  },
  {
    slug: 'manguera-contra-incendio-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Mangueras contra incendio',
    alt: 'Manguera contra incendios de uso industrial en carrete',
    total: 8,
  },
  {
    slug: 'senalizacion-emergencia-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Señalización de emergencia',
    alt: 'Señalización fotoluminiscente de emergencia para rutas de evacuación',
    total: 10,
  },
  {
    slug: 'monitor-industrial-exm2-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Monitores industriales',
    alt: 'Monitor contra incendios de uso industrial para instalación fija',
    total: 10,
  },
  {
    slug: 'equipo-bombero-nfpa-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Equipo para bomberos',
    alt: 'Equipo de protección personal para bomberos certificado NFPA 1970',
    total: 10,
  },
  {
    slug: 'instalaciones-lga-empresa',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Instalaciones del proveedor',
    alt: 'Instalaciones de un proveedor de equipo contra incendios en Querétaro',
    total: 2,
  },

  // ── seguridad-contra-incendios (Proyecto Red) ─────────────────────
  {
    slug: 'extintor-quimico-proyectored-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Extintores por tipo de agente extintor',
    alt: 'Extintor contra incendios clasificado por tipo de agente extintor (ABC, CO2, agua, espuma AFFF, agente limpio, automático)',
    total: 12,
  },
  {
    slug: 'gabinete-manguera-proyectored-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Gabinetes y mangueras contra incendio',
    alt: 'Gabinete contra incendios con manguera, válvulas y accesorios de conexión',
    total: 12,
  },
  {
    slug: 'sistema-proyectored-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Sistemas de detección y alarma',
    alt: 'Sistema de detección, alarma y control contra incendios instalado en una instalación',
    total: 7,
  },
  {
    slug: 'senalamiento-proyectored-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Señalización de emergencia',
    alt: 'Señalización fotoluminiscente de emergencia instalada en rutas de evacuación',
    total: 8,
  },
  {
    slug: 'equipo-bombero-proyectored-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Equipo estructural para bomberos',
    alt: 'Traje y equipo de protección personal para bomberos certificado NFPA 1971',
    total: 8,
  },
  {
    slug: 'equipo-seguridad-proyectored-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Equipo de seguridad y primeros auxilios',
    alt: 'Equipo de protección personal y botiquín de primeros auxilios para instalaciones industriales',
    total: 11,
  },
  {
    slug: 'escenario-proyectored-instalacion',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Escenarios de riesgo',
    alt: 'Instalación industrial, cocina, oficina o centro de datos donde se requiere protección contra incendios',
    total: 4,
  },
  {
    slug: 'servicio-proyectored-hero',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Servicios de protección contra incendios',
    alt: 'Técnico realizando un servicio de protección contra incendios (mantenimiento, prueba hidrostática, recarga, instalación o capacitación)',
    total: 6,
  },

  // ── seguridad-contra-incendios (GAMA DE MÉXICO) ────────────────────
  {
    slug: 'monitor-elkhart-gamademexico-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Monitores contra incendios Elkhart Brass',
    alt: 'Monitor contra incendios Elkhart Brass, fijo o portátil, de uso industrial',
    total: 15,
  },
  {
    slug: 'boquilla-elkhart-gamademexico-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Boquillas contra incendios Elkhart Brass',
    alt: 'Boquilla contra incendios certificada Elkhart Brass de la línea XD',
    total: 15,
  },
  {
    slug: 'valvula-contra-incendios-gamademexico-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Válvulas contra incendios',
    alt: 'Válvula contra incendios industrial (check, compuerta OS&Y, globo o mariposa) certificada UL/FM',
    total: 15,
  },
  {
    slug: 'manguera-industrial-gamademexico-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Mangueras contra incendios industriales',
    alt: 'Manguera contra incendios de uso industrial, forestal o de succión',
    total: 15,
  },
  {
    slug: 'conexion-herraje-gamademexico-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Conexiones y herrajes contra incendios',
    alt: 'Conexión, adaptador, chiflón o toma siamesa de bronce o aluminio para sistemas contra incendios',
    total: 15,
  },
  {
    slug: 'gabinete-hidrante-gamademexico-catalogo',
    categoria: 'seguridad-contra-incendios',
    titulo: 'Gabinetes e hidrantes',
    alt: 'Gabinete contra incendios o hidrante de uso industrial y urbano',
    total: 12,
  },
];

export const TOTAL_FOTOS = FOTOS.reduce((n, g) => n + g.total, 0);

export const tieneFotos = (rubro: string): boolean =>
  FOTOS.some((g) => g.categoria === rubro);

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
  const base = `/img/${grupo.categoria}/${grupo.slug}-${nn(i)}`;
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
 *
 * Filtra por `categoria` para no mezclar fotografía de un rubro en una
 * página de otro rubro: llama primero a `tieneFotos(categoria)`.
 */
export function fotoPara(semilla: string, categoria: string, offset = 0): Foto {
  const grupos = FOTOS.filter((g) => g.categoria === categoria);
  if (grupos.length === 0) {
    throw new Error(`Sin fotografía para la categoría: ${categoria}`);
  }
  let h = 0;
  for (let i = 0; i < semilla.length; i++) h = (h * 31 + semilla.charCodeAt(i)) >>> 0;
  const grupo = grupos[(h + offset) % grupos.length]!;
  return foto(grupo.slug, ((h >>> 8) % grupo.total) + 1);
}
