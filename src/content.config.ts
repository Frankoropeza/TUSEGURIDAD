import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

/**
 * Colecciones de contenido (Astro 6 — Content Layer / loader glob).
 * Consumo: entry.id (no .slug) + render(entry).
 */

const empresas = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/empresas' }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    categoria: z.string(), // slug de categoría principal
    categorias: z.array(z.string()).default([]),
    ciudad: z.string(), // slug de plaza principal
    /** plazas adicionales donde también opera */
    ciudades: z.array(z.string()).default([]),
    /** zonas agrupadas por slug de plaza: { cdmx: [...], estado-de-mexico: [...] } */
    zonas: z.record(z.string(), z.array(z.string())).default({}),
    telefono: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.email().or(z.literal('')).optional(),
    sitio: z.url().or(z.literal('')).optional(),
    direccion: z.string().optional(),
    /**
     * Servicios declarados. Acepta dos formas:
     *  - string suelto (fichas del padrón, sin detalle)
     *  - { nombre, descripcion?, servicio? } para las fichas con detalle,
     *    donde `servicio` es el slug de una página del directorio.
     * Se normaliza con `serviciosDe()` (src/lib/servicios.ts).
     */
    servicios: z
      .array(
        z.union([
          z.string(),
          z.object({
            nombre: z.string(),
            descripcion: z.string().optional(),
            servicio: z.string().optional(),
            /** slug de un grupo del catálogo de fotografía (src/lib/imagenes.ts) */
            foto: z.string().optional(),
            /**
             * Apartado extendido: texto largo + galería. Los servicios que lo
             * declaran salen además en el módulo a dos columnas de la ficha.
             */
            detalle: z
              .object({
                intro: z.string(),
                puntos: z
                  .array(z.object({ titulo: z.string(), texto: z.string() }))
                  .default([]),
                /** fotos: "grupo" o "grupo:N" (N = variante del grupo, base 1) */
                galeria: z.array(z.string()).default([]),
              })
              .optional(),
          }),
        ])
      )
      .default([]),
    horario: z.string().optional(),
    verificado: z.boolean().default(false),
    destacado: z.boolean().default(false),
    logo: z.string().optional(),
    orden: z.number().default(0),

    /** grupo de fotografía del catálogo; si se omite se asigna por hash */
    foto: z.string().optional(),

    /**
     * Ficha de maqueta, no una empresa real. Se marca en pantalla, se sirve
     * con noindex y queda fuera del sitemap. Existe solo para poder evaluar
     * el diseño con varias tarjetas antes de tener padrón.
     */
    demo: z.boolean().default(false),
  }),
});

const categorias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/categorias' }),
  schema: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    icono: z.string().optional(),
    destacada: z.boolean().default(false),
    orden: z.number().default(0),

    // --- SEO / cabecera ---
    tituloSeo: z.string().optional(),
    intro: z.string().optional(),

    /**
     * true cuando el rubro se regula con las leyes estatales de seguridad
     * privada (el bloque "quién autoriza en esta plaza" de los cruces solo
     * tiene sentido en ese caso; mostrarlo en un rubro regulado por NOMs
     * federales sería atribuirle una autoridad que no le aplica).
     */
    marcoLocal: z.boolean().default(false),

    /** etiqueta de la sección de modalidades (default: Marco normativo federal) */
    modalidadesEtiqueta: z.string().optional(),

    // --- bloques editoriales de la ficha de rubro ---
    modalidades: z
      .array(
        z.object({
          nombre: z.string(),
          descripcion: z.string(),
          /** slug de otra categoría del directorio, para enlace interno */
          rubro: z.string().optional(),
        })
      )
      .default([]),

    verificacion: z
      .array(z.object({ punto: z.string(), detalle: z.string() }))
      .default([]),

    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),

    /** referencias normativas citadas en la ficha */
    fuentes: z
      .array(z.object({ titulo: z.string(), url: z.url() }))
      .default([]),
  }),
});

const ciudades = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ciudades' }),
  schema: z.object({
    nombre: z.string(),
    /** forma corta para titulares y cruces rubro×plaza */
    nombreCorto: z.string().optional(),
    estado: z.string().default('Ciudad de México'),
    descripcion: z.string(),
    orden: z.number().default(0),

    abreviatura: z.string().optional(),
    capital: z.string().optional(),
    /** agrupación editorial para la reja de estados */
    region: z.string().default('Centro'),

    /** marco normativo local — es lo que diferencia a cada plaza */
    normativa: z
      .object({
        ley: z.string().optional(),
        autoridad: z.string().optional(),
        dependencia: z.string().optional(),
        vigencia: z.string().optional(),
        modalidades: z.number().optional(),
        modalidadesArticulo: z.string().optional(),
        registro: z.string().optional(),
        /** true cuando la materia se regula dentro de la ley de seguridad pública */
        sinLeyEspecifica: z.boolean().default(false),
      })
      .optional(),

    fuentes: z
      .array(z.object({ titulo: z.string(), url: z.url() }))
      .default([]),
  }),
});

const servicios = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/servicios' }),
  schema: z.object({
    /**
     * Etiqueta corta del servicio. Es la llave de enlace: se usa en tarjetas,
     * migas y bloques de relacionados, así que tiene que caber en una línea.
     */
    titulo: z.string(),
    /**
     * H1 de la página. Puede extenderse más que `titulo` para plantear el
     * ángulo editorial del artículo; si falta se usa `titulo`.
     */
    h1: z.string().optional(),
    /**
     * `<title>` de la pestaña y del resultado de búsqueda, sin el sufijo del
     * sitio. Mismo motivo que en `serviciosEmpresa`: el H1 y el `<title>`
     * tienen presupuestos distintos — el sufijo «| TuSeguridad» ya consume 14
     * de los ~60 caracteres que Google muestra antes de truncar. Si falta se
     * usa `titulo`.
     */
    tituloSeo: z.string().optional(),
    descripcion: z.string(),
    icono: z.string().optional(),
    destacado: z.boolean().default(false),
    orden: z.number().default(0),
    /** slug del rubro al que pertenece — habilita el enlazado interno */
    rubro: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

/**
 * Página de servicio de una empresa (cliente VIP).
 *
 * Un archivo por servicio, en `src/content/servicios-empresa/<empresa>/<slug>.md`,
 * de modo que `entry.id` sea `<empresa>/<slug>` y la URL se derive de él:
 *   /categorias/<rubro>/<plaza>/<empresa>/<slug>/
 *
 * Es lo que distingue a un cliente VIP: solo sus servicios tienen página
 * propia. El resto del padrón se queda en la tarjeta de su ficha.
 */
const serviciosEmpresa = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/servicios-empresa',
    /**
     * El `generateId` por defecto del glob loader devuelve `data.slug` cuando
     * existe, así que dos empresas que prestan el mismo servicio —p. ej.
     * `seguridad-para-condominios`— colisionan y la segunda sobrescribe a la
     * primera en silencio. Se compone con la carpeta de la empresa para que
     * `entry.id` sea `<empresa>/<slug>`, que es lo que documenta esta colección.
     */
    generateId: ({ entry }) => entry.replace(/\.mdx?$/, ''),
  }),
  schema: z.object({
    /** slug de la ficha de empresa a la que pertenece */
    empresa: z.string(),
    /** segmento final de la URL; debe coincidir con el nombre del archivo */
    slug: z.string(),
    /** nombre tal cual aparece en la tarjeta de la ficha — es la llave de enlace */
    nombre: z.string(),
    /** H1 de la página; puede ser más largo y con plaza para SEO */
    titulo: z.string(),
    /**
     * `<title>` de la pestaña y del resultado de búsqueda, sin el sufijo del
     * sitio. Opcional: si falta se usa `titulo`.
     *
     * Existe porque el H1 y el `<title>` tienen presupuestos distintos. El H1
     * puede extenderse todo lo que ayude al lector; el `<title>` compite por
     * ~60 caracteres antes de que Google lo trunque, y el sufijo
     * «| TuSeguridad» ya se lleva 14. Con `titulo` haciendo los dos trabajos,
     * las páginas largas perdían la cola en el SERP.
     */
    tituloSeo: z.string().optional(),
    /** meta description y lede de la cabecera */
    descripcion: z.string(),
    /** párrafo de apertura del apartado 01 */
    intro: z.string(),
    /** cifras declaradas para la cabecera: { k: 'Cobertura', v: 'CDMX · Edomex' } */
    stats: z.array(z.object({ k: z.string(), v: z.string() })).default([]),
    /** qué incluye el servicio */
    incluye: z.array(z.object({ titulo: z.string(), texto: z.string() })).default([]),
    /** esquemas o modalidades en que se presta */
    modalidades: z.array(z.object({ titulo: z.string(), texto: z.string() })).default([]),
    /** perfiles de inmueble o cliente a los que aplica */
    paraQuien: z.array(z.object({ titulo: z.string(), texto: z.string() })).default([]),
    /** pasos del alta del servicio, en orden */
    proceso: z.array(z.object({ titulo: z.string(), texto: z.string() })).default([]),
    /**
     * Errores frecuentes al contratar. Se pintan en un bloque invertido
     * (`.on-ink`): es lo que más convierte y lo que ningún competidor puede
     * copiar con adjetivos.
     */
    errores: z.array(z.object({ titulo: z.string(), texto: z.string() })).default([]),
    /**
     * Vocabulario del servicio. Imán de búsquedas de cola larga y ayuda real
     * al comprador que no conoce los términos del gremio.
     */
    glosario: z.array(z.object({ termino: z.string(), definicion: z.string() })).default([]),
    /**
     * Encabezados H2 por apartado, para poder cargarlos de palabra clave sin
     * tocar la plantilla. Claves: incluye, modalidades, paraQuien, proceso,
     * errores, glosario. Si falta una, se usa el titular por defecto.
     */
    titulos: z.record(z.string(), z.string()).default({}),
    /** documentos y registros que el cliente recibe */
    entregables: z.array(z.string()).default([]),
    /** fotos: "grupo" o "grupo:N" (N = variante del grupo, base 1) */
    galeria: z.array(z.string()).default([]),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
    /** slug de la página genérica del directorio, si existe */
    servicio: z.string().optional(),
    orden: z.number().default(0),
  }),
});

const guias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guias' }),
  schema: z.object({
    titulo: z.string(),
    /**
     * `<title>` de la pestaña y del resultado de búsqueda, sin el sufijo del
     * sitio. Mismo presupuesto que en las demás colecciones: el titular de la
     * guía puede extenderse cuanto ayude al lector, pero el `<title>` compite
     * por ~60 caracteres y «| TuSeguridad» ya consume 14. Si falta se usa
     * `titulo`.
     */
    tituloSeo: z.string().optional(),
    descripcion: z.string(),
    fecha: z.coerce.date(),
    actualizado: z.coerce.date().optional(),
    autor: z.string().default('Equipo TuSeguridad'),
    imagen: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** slugs de rubros tratados en la guía — habilita el enlazado interno */
    rubros: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  empresas,
  categorias,
  ciudades,
  servicios,
  serviciosEmpresa,
  guias,
};
