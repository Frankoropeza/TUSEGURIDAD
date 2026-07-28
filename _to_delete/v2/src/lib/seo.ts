import { SITE } from '@config/site';

export type PageType = 'website' | 'organization' | 'category' | 'business' | 'service' | 'article' | 'itemlist';

export interface SeoInput {
  title: string;
  description?: string;
  path?: string; // ruta relativa, ej. '/empresas'
  image?: string;
  pageType?: PageType;
  noindex?: boolean;
  /** datos opcionales para JSON-LD según pageType */
  jsonld?: Record<string, unknown>;
  breadcrumbs?: { name: string; href: string }[];
}

export interface SeoOutput {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  noindex: boolean;
  schemas: Record<string, unknown>[];
}

function abs(path = '/'): string {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return new URL(clean, SITE.url).href;
}

export function buildSeo(input: SeoInput): SeoOutput {
  const {
    title,
    description = SITE.description,
    path = '/',
    image = '/favicon.svg',
    pageType = 'website',
    noindex = false,
    jsonld = {},
    breadcrumbs = [],
  } = input;

  const fullTitle = path === '/' ? `${SITE.name} — ${SITE.tagline}` : `${title} | ${SITE.name}`;
  const canonical = abs(path);
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
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: SITE.name,
      url: SITE.url,
      inLanguage: SITE.lang,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE.url}/buscar?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
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

  return { title: fullTitle, description, canonical, ogImage, noindex, schemas };
}
