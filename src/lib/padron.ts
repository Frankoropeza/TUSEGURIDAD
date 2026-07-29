import cdmxProteccionPersonas from '../data/padron/cdmx-proteccion-personas.json';

/**
 * Padrones oficiales — registros públicos de autoridad reproducidos tal cual.
 *
 * Regla del proyecto: aquí no se enriquece nada. Cada campo sale del registro
 * publicado por la autoridad, con su URL y su fecha de corte visibles en la
 * página. Si un dato no viene en la fuente (domicilio, modalidades adicionales,
 * correo), no se infiere: se omite.
 */

export interface EmpresaPadron {
  /** número de expediente con el que la autoridad identifica el permiso */
  expediente: string;
  /** razón social legible */
  razonSocial: string;
  /** cadena exacta publicada por la autoridad, para cotejar el registro */
  razonOficial: string;
  slug: string;
  /** solo números de 10 dígitos; la fuente trae algunos campos malformados */
  telefonos: string[];
  /** fin de vigencia del permiso, ISO */
  vigencia: string;
  /** el permiso está a nombre de una persona física, no de una sociedad */
  personaFisica: boolean;
}

export interface Padron {
  plaza: string;
  rubro: string;
  modalidad: string;
  estatus: string;
  autoridad: string;
  fuente: { titulo: string; url: string };
  fuenteRevocados?: { titulo: string; url: string; nota: string };
  fechaCorte: string;
  total: number;
  empresas: EmpresaPadron[];
}

const PADRONES: Padron[] = [cdmxProteccionPersonas as Padron];

/** Padrón oficial publicado para un rubro en una plaza, si existe. */
export function padronDe(rubro: string, plaza: string): Padron | undefined {
  return PADRONES.find((p) => p.rubro === rubro && p.plaza === plaza);
}

/** Plazas de un rubro que ya tienen padrón oficial cargado. */
export function plazasConPadron(rubro: string): string[] {
  return PADRONES.filter((p) => p.rubro === rubro).map((p) => p.plaza);
}

/** 5555191012 → 55 5519 1012 */
export function telefonoLegible(t: string): string {
  return t.length === 10 ? `${t.slice(0, 2)} ${t.slice(2, 6)} ${t.slice(6)}` : t;
}

export function telefonoHref(t: string): string {
  return `+52${t}`;
}

const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];

/** 2026-12-18 → 18 de diciembre de 2026 */
export function fechaLarga(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number);
  return `${d} de ${MESES[m - 1]} de ${a}`;
}

/** 2026-12-18 → 18/12/2026 (compacto para tabla) */
export function fechaCorta(iso: string): string {
  const [a, m, d] = iso.split('-');
  return `${d}/${m}/${a}`;
}

/**
 * Un permiso a menos de 90 días de vencer no es una irregularidad, pero sí es
 * el dato que conviene confirmar antes de firmar: la revalidación puede estar
 * en trámite y el padrón solo refleja el corte.
 */
export function porVencer(iso: string, corte: string, dias = 90): boolean {
  const limite = new Date(corte).getTime() + dias * 86_400_000;
  return new Date(iso).getTime() <= limite;
}

/** Reparto por año de vencimiento — sirve para describir el padrón sin inventar. */
export function resumenVigencias(p: Padron): { anio: string; n: number }[] {
  const conteo = new Map<string, number>();
  for (const e of p.empresas) {
    const a = e.vigencia.slice(0, 4);
    conteo.set(a, (conteo.get(a) ?? 0) + 1);
  }
  return [...conteo.entries()].sort().map(([anio, n]) => ({ anio, n }));
}
