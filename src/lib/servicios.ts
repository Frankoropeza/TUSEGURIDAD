import type { CollectionEntry } from 'astro:content';
import { FOTOS, foto as tomarFoto, type Foto } from '@lib/imagenes';

/**
 * Servicios declarados por una empresa, normalizados.
 *
 * El frontmatter admite dos formas (ver content.config.ts): el string suelto
 * de las fichas del padrón y el objeto con detalle de las fichas completas.
 * Aquí se resuelven a una sola forma para que las plantillas no tengan que
 * distinguirlas.
 */
export interface ServicioDeclarado {
  nombre: string;
  descripcion?: string;
  /** slug de una página de servicio del directorio, si existe */
  servicio?: string;
  /** slug de un grupo del catálogo de fotografía */
  foto?: string;
  /** apartado extendido con texto largo y galería */
  detalle?: {
    intro: string;
    puntos: { titulo: string; texto: string }[];
    galeria: string[];
  };
}

/**
 * Resuelve las referencias de galería del frontmatter a fotos del catálogo.
 * Formato de cada entrada: "grupo" (primera variante) o "grupo:N".
 * Las referencias a grupos inexistentes se descartan en silencio: una foto
 * mal escrita no debe tumbar el build de una ficha.
 */
export function galeriaDe(refs: string[]): Foto[] {
  const grupos = new Set(FOTOS.map((g) => g.slug));
  return refs
    .map((ref) => {
      const [slug, n] = ref.split(':');
      if (!slug || !grupos.has(slug)) return null;
      return tomarFoto(slug, Number(n) || 1);
    })
    .filter((f): f is Foto => f !== null);
}

export function serviciosDe(empresa: CollectionEntry<'empresas'>): ServicioDeclarado[] {
  return empresa.data.servicios.map((s) =>
    typeof s === 'string' ? { nombre: s } : { ...s }
  );
}

/** true cuando al menos un servicio trae descripción — habilita la rejilla de tarjetas */
export function tienenDetalle(servicios: ServicioDeclarado[]): boolean {
  return servicios.some((s) => Boolean(s.descripcion));
}

/**
 * Enlace de WhatsApp con el mensaje ya escrito para ese servicio.
 * wa.me exige el número a 12 dígitos con lada país; los .md guardan el
 * formato legible.
 */
export function waServicio(numero: string, servicio: string, plaza?: string): string {
  const d = numero.replace(/\D/g, '');
  const tel = d.length === 10 ? `52${d}` : d;
  const texto = `Hola, quiero información sobre ${servicio.toLowerCase()}${
    plaza ? ` en ${plaza}` : ''
  }.`;
  return `https://wa.me/${tel}?text=${encodeURIComponent(texto)}`;
}
