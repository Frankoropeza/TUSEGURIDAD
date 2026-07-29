import { SITE } from '@config/site';

export type PageType = 'website' | 'organization' | 'category' | 'business' | 'service' | 'article' | 'itemlist';

export interface SeoInput {
  title: string;
  description?: string;
  path?: string; // ruta relativa, ej. '/empresas'
  image?: string;
  pageType?: PageType;
  noindex?: boolean;
  /** ruta canónica cuando esta página es una variante duplicada */
  canonicalPath?: string;
  /** datos opcionales para JSON-LD según pageType */
  jsonld?: Record<string, unknown>;
  breadcrumbs?: { name: string; href: string }[];
  /** preguntas frecuentes reales de la página → JSON-LD FAQPage */
  faq?: { q: string; a: string }[];
  /**
   * Entradas de un listado publicado en la página → JSON-LD ItemList.
   * Solo debe pasarse lo que el usuario ve en el HTML: el marcado describe la
   * lista, no la amplía. Sin aggregateRating: no publicamos reseñas propias.
   */
  itemList?: ItemListEntry[];
  /** nombre del listado; por defecto, el título de la página */
  itemListName?: string;
}

export interface ItemListEntry {
  name: string;
  /** URL absoluta o ruta interna de la ficha, si existe */
  url?: string;
  telephone?: string;
  /** identificador oficial (p. ej. número de expediente del permiso) */
  identifier?: string;
  /** territorio donde la autoridad la habilita a operar */
  areaServed?: string;
}

/**
 * Mínimo de elementos para emitir ItemList. Marcar una lista de dos entradas
 * como listado no aporta nada y expone marcado desproporcionado al contenido.
 */
const MIN_ITEMLIST = 5;

export interface SeoOutput {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  /** og:type coherente con el contenido (article para guías) */
  ogType: 'website' | 'article';
  noindex: boolean;
  schemas: Record<string, unknown>[];
}

/**
 * URL absoluta. Las páginas se sirven como directorios (`build.format:
 * 'directory'`), así que la forma canónica lleva diagonal final; sin ella,
 * canonical y sitemap apuntarían a URLs distintas de las que se sirven.
 * Los archivos (.svg, .png, .xml…) se quedan como están.
 */
function abs(path = '/'): string {
  let clean = path.startsWith('/') ? path : `/${path}`;
  if (!/\.[a-z0-9]+$/i.test(clean) && !clean.endsWith('/')) clean += '/';
  return new URL(clean, SITE.url).href;
}

export function buildSeo(input: SeoInput): SeoOutput {
  const {
    title,
    description = SITE.description,
    path = '/',
    image = '/og.png',
    pageType = 'website',
    noindex = false,
    canonicalPath,
    jsonld = {},
    breadcrumbs = [],
    faq = [],
    itemList = [],
    itemListName,
  } = input;

  const fullTitle = path === '/' ? `${SITE.name} — ${SITE.tagline}` : `${title} | ${SITE.name}`;
  const canonical = abs(canonicalPath ?? path);
  const ogImage = image.startsWith('http') ? image : abs(image);

  const schemas: Record<string, unknown>[] = [];

  // Organization + WebSite siempre presentes
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.legalName,
    url: SITE.url,
    logo: abs('/favicon.svg'),
    ...(Object.values(SITE.social).some(Boolean)
      ? { sameAs: Object.values(SITE.social).filter(Boolean) }
      : {}),
  });

  if (pageType === 'website') {
    // Sin SearchAction: el sitio no tiene ruta /buscar. Declarar una acción
    // de búsqueda hacia una URL inexistente sería marcado inventado.
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
      inLanguage: SITE.lang,
    });
  }

  if (pageType === 'business') {
    // Ficha de empresa — sin aggregateRating fabricado.
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      name: title,
      description,
      url: canonical,
      ...jsonld,
    });
  }

  if (pageType === 'service') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: title,
      description,
      areaServed: SITE.country,
      provider: { '@type': 'Organization', name: SITE.legalName, url: SITE.url },
      ...jsonld,
    });
  }

  if (pageType === 'article') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      image: ogImage,
      mainEntityOfPage: canonical,
      inLanguage: SITE.lang,
      publisher: {
        '@type': 'Organization',
        name: SITE.legalName,
        logo: { '@type': 'ImageObject', url: abs('/favicon.svg') },
      },
      ...jsonld,
    });
  }

  if (pageType === 'itemlist' || pageType === 'category') {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      description,
      url: canonical,
      ...jsonld,
    });
  }

  /**
   * ItemList de un padrón o listado. Los elementos van como Organization y no
   * como LocalBusiness a propósito: los registros oficiales publican razón
   * social, permiso y teléfono, pero no domicilio, y LocalBusiness sin
   * dirección obligaría a inventar una. `areaServed` sí es exacto: es el
   * territorio que ampara el permiso.
   */
  if (itemList.length >= MIN_ITEMLIST) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: itemListName ?? title,
      numberOfItems: itemList.length,
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      itemListElement: itemList.map((e, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        item: {
          '@type': 'Organization',
          name: e.name,
          ...(e.url ? { url: e.url.startsWith('http') ? e.url : abs(e.url) } : {}),
          ...(e.telephone ? { telephone: e.telephone } : {}),
          ...(e.identifier ? { identifier: e.identifier } : {}),
          ...(e.areaServed ? { areaServed: e.areaServed } : {}),
        },
      })),
    });
  }

  if (faq.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }

  if (breadcrumbs.length) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((b, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: b.name,
        item: abs(b.href),
      })),
    });
  }

  return {
    title: fullTitle,
    description,
    canonical,
    ogImage,
    ogType: pageType === 'article' ? 'article' : 'website',
    noindex,
    schemas,
  };
}
