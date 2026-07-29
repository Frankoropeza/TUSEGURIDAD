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
    titulo: z.string(),
    descripcion: z.string(),
    icono: z.string().optional(),
    destacado: z.boolean().default(false),
    orden: z.number().default(0),
    /** slug del rubro al que pertenece — habilita el enlazado interno */
    rubro: z.string().optional(),
    faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  }),
});

const guias = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/guias' }),
  schema: z.object({
    titulo: z.string(),
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

export const collections = { empresas, categorias, ciudades, servicios, guias };
