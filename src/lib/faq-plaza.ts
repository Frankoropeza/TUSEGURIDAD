import type { Padron } from '@lib/padron';
import { fechaLarga } from '@lib/padron';

interface NormativaPlaza {
  ley?: string;
  autoridad?: string;
  dependencia?: string;
  vigencia?: string;
  modalidades?: number;
  registro?: string;
  sinLeyEspecifica?: boolean;
}

interface Args {
  rubro: string;
  plaza: string;
  plazaCorta: string;
  normativa?: NormativaPlaza;
  padron?: Padron;
  /** empresas publicadas en nuestro directorio para este cruce */
  enDirectorio: number;
}

/**
 * Preguntas frecuentes de un cruce rubro × plaza.
 *
 * Cada respuesta se arma únicamente con datos verificados que ya viven en el
 * frontmatter de la plaza o en el padrón oficial. Si un campo no está
 * verificado, la pregunta correspondiente no se genera: es preferible una FAQ
 * de tres preguntas exactas que una de seis con una afirmación inventada.
 */
export function faqPlaza({
  rubro,
  plaza,
  plazaCorta,
  normativa,
  padron,
  enDirectorio,
}: Args): { q: string; a: string }[] {
  const faq: { q: string; a: string }[] = [];
  const n = normativa ?? {};

  if (padron) {
    faq.push({
      q: `¿Cuántas empresas de ${rubro} tienen permiso vigente en ${plaza}?`,
      a:
        `Al corte del ${fechaLarga(padron.fechaCorte)}, ${padron.autoridad} publica ` +
        `${padron.total} empresas con permiso vigente en la modalidad de ${padron.modalidad.toLowerCase()}. ` +
        `Esa cifra es la del registro oficial, no la de nuestro directorio: aquí reproducimos el listado completo ` +
        `con su número de expediente y su fecha de vencimiento para que puedas cotejarlo contra la fuente.`,
    });

    faq.push({
      q: `¿Cómo verifico que una empresa de ${rubro} esté autorizada en ${plazaCorta}?`,
      a:
        `Pide el permiso y compara tres datos contra el registro público de la autoridad: el número de expediente, ` +
        `la razón social exacta y la fecha de vencimiento. Si alguno no coincide, o si la empresa no aparece en el ` +
        `listado, el documento no acredita nada. En esta página publicamos el padrón con esos tres campos y el ` +
        `enlace directo a la fuente oficial.`,
    });
  }

  if (n.autoridad) {
    faq.push({
      q: `¿Quién otorga el permiso de ${rubro} en ${plaza}?`,
      a:
        `${n.autoridad}${n.dependencia ? `, adscrita a ${n.dependencia}` : ''}. ` +
        (n.ley ? `El marco aplicable es ${n.ley}. ` : '') +
        `El permiso ampara únicamente el territorio de la entidad: no sustituye a la autorización federal.`,
    });
  }

  if (n.modalidades) {
    faq.push({
      q: `¿Cuántas modalidades reconoce ${plazaCorta}?`,
      a:
        `${n.modalidades} en el trámite local. La autorización ampara solo las modalidades que declara, así que debe ` +
        `coincidir con el servicio que vas a contratar: una empresa habilitada para vigilancia de inmuebles no queda ` +
        `por ello habilitada para protección a personas ni para traslado de valores.`,
    });
  }

  if (n.vigencia) {
    faq.push({
      q: `¿Cuánto dura el permiso de ${rubro} en ${plazaCorta}?`,
      a: `${n.vigencia} Revisa la fecha del documento y no solo su existencia: un permiso vencido equivale a operar sin registro.`,
    });
  }

  // Solo tiene sentido en rubros regidos por las leyes de seguridad privada:
  // en un rubro regulado por NOMs federales no existe ese par federal/local.
  if (normativa) {
    faq.push({
      q: `¿Necesito una empresa con autorización federal o con permiso de ${plazaCorta}?`,
      a:
        `Depende del territorio donde vayas a recibir el servicio. Si se presta dentro de ${plaza} únicamente, ` +
        `aplica la ley local y basta el permiso de la entidad. Si la empresa te atiende también en otra entidad ` +
        `federativa, esa operación cae en el supuesto de la Ley Federal de Seguridad Privada y requiere además ` +
        `autorización federal, que es un documento distinto con vigencia de un año.`,
    });
  }

  if (enDirectorio > 0) {
    faq.push({
      q: `¿Qué empresas de ${rubro} publica TuSeguridad en ${plazaCorta}?`,
      a:
        `${enDirectorio === 1 ? 'Una empresa' : `${enDirectorio} empresas`} con ficha propia, donde detallamos ` +
        `cobertura, servicios y datos de contacto. La insignia de verificada solo se muestra cuando la empresa ` +
        `nos exhibió el documento de autorización; el resto de las acreditaciones se publican como declaradas por ` +
        `la propia empresa.`,
    });
  }

  return faq;
}
