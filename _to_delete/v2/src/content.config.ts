import { defineCollection, z } from 'astro:content';
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
    ciudad: z.string(), // slug de ciudad
    zonas: z.array(z.string()).default([]),
    telefono: z.string().optional(),
    whatsapp: z.string().optional(),
    email: z.string().email().or(z.literal('')).optional(),
    sitio: z.string().url().or(z.literal('')).optional(),
    direccion: z.string().optional(),
    servicios: z.array(z.string()).default([]),
    horario: z.string().optional(),
    verificado: z.boolean().default(false),
    destacado: z.boolean().default(false),
    logo: z.string().optional(),
    orden: z.number().default(0),
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
  }),
});

const ciudades = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/ciudades' }),
  schema: z.object({
    nombre: z.string(),
    estado: z.string().default('Ciudad de México'),
    descripcion: z.string(),
    orden: z.number().default(0),
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
    draft: z.boolean().default(false),
  }),
});

export const collections = { empresas, categorias, ciudades, servicios, guias };
