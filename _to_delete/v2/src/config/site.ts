/**
 * SSoT — Single Source of Truth del sitio.
 * Todo dato global vive aquí; no hardcodear en componentes.
 */

export const SITE = {
  name: 'TuSeguridad',
  legalName: 'TuSeguridad México',
  domain: 'tuseguridad.mx',
  url: 'https://tuseguridad.mx',
  tagline: 'El directorio de empresas y servicios de seguridad en México',
  description:
    'Directorio de empresas de seguridad en México: seguridad privada, videovigilancia (CCTV), alarmas y monitoreo, control de acceso, blindaje y ciberseguridad. Encuentra proveedores verificados por ciudad y categoría.',
  lang: 'es-MX',
  locale: 'es_MX',
  country: 'MX',
  themeColor: '#1b41d6',

  contacto: {
    email: 'contacto@tuseguridad.mx',
    telefono: '',
    whatsapp: '',
  },

  social: {
    facebook: '',
    instagram: '',
    x: '',
    linkedin: '',
    youtube: '',
  },

  nav: [
    { label: 'Inicio', href: '/' },
    { label: 'Categorías', href: '/categorias' },
    { label: 'Empresas', href: '/empresas' },
    { label: 'Ciudades', href: '/ciudades' },
    { label: 'Servicios', href: '/servicios' },
    { label: 'Guías', href: '/guias' },
  ],

  navFooter: [
    { label: 'Registrar empresa', href: '/registrar' },
    { label: 'Contacto', href: '/contacto' },
    { label: 'Aviso de privacidad', href: '/aviso-de-privacidad' },
    { label: 'Términos', href: '/terminos' },
  ],
} as const;

export type SiteConfig = typeof SITE;
