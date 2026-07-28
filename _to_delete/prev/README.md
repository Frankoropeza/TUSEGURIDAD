# TuSeguridad

Directorio híbrido de empresas y servicios de seguridad en México — construido con **Astro 6 + Markdown**. Combina un directorio de proveedores (seguridad privada, videovigilancia, alarmas, control de acceso, blindaje, ciberseguridad) con páginas de servicio propias monetizables (modelo rank-and-rent).

## Stack

- **Astro 6** (SSG) + Content Collections con loader `glob`
- **Markdown / MDX** para todo el contenido (empresas, categorías, ciudades, servicios, guías)
- **Tailwind CSS v3** vía PostCSS
- **@astrojs/sitemap** para sitemap automático
- SEO centralizado en `src/lib/seo.ts` (JSON-LD por tipo de página, sin reseñas fabricadas)

## Estructura

```
src/
  content.config.ts        # colecciones (empresas, categorias, ciudades, servicios, guias)
  config/site.ts           # SSoT: nombre, dominio, navegación, contacto
  lib/seo.ts               # meta tags + JSON-LD por pageType
  layouts/BaseLayout.astro
  components/              # Header, Footer, EmpresaCard, CategoriaCard
  styles/global.css
  content/                # Markdown de cada colección
  pages/                  # rutas (index pendiente)
```

## Comandos

```bash
npm install
npm run dev       # servidor local
npm run check     # astro check (0 errores = gate)
npm run build     # build de producción
npm run preview
```

## Convenciones

- Slugs de categoría/ciudad = nombre del archivo `.md` (sin extensión). Las empresas referencian esos slugs en `categoria` / `ciudad`.
- SSoT en `src/config/site.ts` — cualquier dato global (dominio, teléfono, redes) se cambia ahí, no hardcodeado.
- Cero `aggregateRating` / reseñas inventadas. Cero links a competencia.
