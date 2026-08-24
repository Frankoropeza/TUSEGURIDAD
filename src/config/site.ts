/**
 * SSoT — Single Source of Truth del sitio.
 * Todo dato global vive aquí; no hardcodear en componentes.
 */

export const SITE = {
  name: 'TuSeguridad',
  legalName: 'TuSeguridad México',
  domain: 'tuseguridad.mx',
  url: 'https://tuseguridad.mx',
  /**
   * También es la segunda mitad del `<title>` de la portada
   * (`TuSeguridad — <tagline>`), así que tiene que caber en 60 caracteres
   * contando el nombre del sitio y el guion: 46 como máximo.
   */
  tagline: 'Directorio de empresas de seguridad en México',
  /** meta description por defecto — tope de 160 caracteres */
  description:
    'Directorio de empresas de seguridad en México: seguridad privada, CCTV y videovigilancia, alarmas, control de acceso, blindaje y ciberseguridad, por plaza.',
  lang: 'es-MX',
  locale: 'es_MX',
  country: 'MX',
  themeColor: '#121211',

  contacto: {
    /**
     * Vacíos hasta que existan de verdad (buzón que enrute, línea que
     * conteste). Publicar un canal muerto es peor que no publicar ninguno:
     * las plantillas muestran su estado "en preparación" mientras tanto.
     */
    email: '',
    telefono: '',
    whatsapp: '',
  },

  /**
   * Endpoint POST para los formularios (n8n webhook, Formspree, etc.).
   * Mientras esté vacío, los formularios se muestran en modo correo directo
   * en vez de enviar a un destino inexistente.
   */
  formEndpoint: '',

  /**
   * Analítica del sitio. Mientras ga4Id esté vacío, no se carga ningún
   * script de tracking: cero analítica fantasma apuntando a una cuenta que
   * no existe. Al crear la propiedad GA4, poner aquí el Measurement ID
   * (G-XXXXXXX) y el snippet se activa solo, en todas las páginas.
   */
  analytics: {
    ga4Id: '',
  },

  /**
   * Datos legales del titular del sitio. Requeridos para que el aviso de
   * privacidad y los términos dejen de ser borrador.
   */
  legal: {
    // Datos de la entidad operadora, tomados del aviso de privacidad
    // publicado en seguridad-privada.com.mx (misma titularidad).
    razonSocial: 'Virelta Seguridad Privada, S.A. de C.V.',
    domicilio: 'Basiliso Romo Anguiano No. 22, int. 3, Col. Industrial, C.P. 07800, Ciudad de México',
    /**
     * Sin buzón todavía. El aviso indica el ejercicio de derechos ARCO por
     * escrito al domicilio (medio válido conforme a la LFPDPPP); al existir
     * el correo, llenarlo y el aviso lo publica solo.
     */
    correoDatos: '',
    completo: true,
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
    { label: 'Categorías', href: '/categorias/' },
    { label: 'Empresas', href: '/empresas/' },
    { label: 'Ciudades', href: '/ciudades/' },
    { label: 'Servicios', href: '/servicios/' },
    { label: 'Guías', href: '/guias/' },
  ],

  navFooter: [
    { label: 'Registrar empresa', href: '/registrar/' },
    { label: 'Contacto', href: '/contacto/' },
    { label: 'Aviso de privacidad', href: '/aviso-de-privacidad/' },
    { label: 'Términos', href: '/terminos/' },
  ],
} as const;

export type SiteConfig = typeof SITE;
