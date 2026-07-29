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
