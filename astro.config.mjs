import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { SITE } from './src/config/site.ts';
import { rutasCanonicasEmpresas, rutaFichaDe } from './src/lib/empresas-fs.mjs';

const canonicasEmpresas = rutasCanonicasEmpresas();

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',
  build: {
    format: 'directory',
  },
  integrations: [
    mdx(),
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      // Las páginas legales se sirven con noindex mientras falten los datos
      // del titular. Listarlas en el sitemap contradice esa etiqueta.
      filter: (page) => {
        const ruta = page.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') || '/';

        // Una empresa se publica bajo cada rubro×plaza donde opera; solo la
        // combinación canónica entra al sitemap (las demás van con noindex).
        // Aplica igual a la ficha y a sus páginas de servicio VIP, que heredan
        // la canonicalización de la ficha de la que cuelgan.
        const ficha = rutaFichaDe(ruta);
        if (ficha && !canonicasEmpresas.has(ficha)) return false;

        // Las legales se sirven con noindex mientras falten los datos del titular.
        if (!SITE.legal.completo && /\/(aviso-de-privacidad|terminos)$/.test(ruta)) return false;

        return true;
      },
    }),
  ],
});
