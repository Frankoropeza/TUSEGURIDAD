import sharp from 'sharp';
import path from 'path';

const SRC = '/Users/frankoropeza/Documents/Claude/Projects/LGACONTRAINCENDIOS/public/imagenes/productos';
const NOSOTROS = '/Users/frankoropeza/Documents/Claude/Projects/LGACONTRAINCENDIOS/public/imagenes/nosotros';
const OUT = '/Users/frankoropeza/Documents/Claude/Projects/TUSEGURIDAD/public/img/seguridad-contra-incendios';
const RATIO_W = 1280, RATIO_H = 714;

const GRUPOS = [
  { slug: 'extintor-portatil-catalogo', dir: `${SRC}/extintores`, files: [
    'extintor-clase-a-2-kg.webp','extintor-clase-a-5kg.webp','extintor-clase-a-9-kg.webp',
    'extintor-clase-c-6kg.webp','extintor-clase-k-2kg.webp','extintores-clase-b.webp',
    'extintores-clase-c-2kg.webp','extintores-clase-k-6kg.webp','venta-e-extintor-clase-a-35-kg.webp',
    'venta-de-extintores-contra-incendios.jpg','venta-de-extintores-clase-b-9-kg.webp','venta-de-extintores-clase-c-35kg.webp'
  ]},
  { slug: 'manguera-contra-incendio-catalogo', dir: `${SRC}/mangueras`, files: [
    'venta-de-manguera-contra-incendios-2.webp','venta-de-manguera-contra-incendios-3.webp',
    'venta-de-manguera-contra-incendios-4.webp','venta-de-manguera-contra-incendios-5.webp',
    'venta-de-manguera-de-succion-1.webp','venta-de-manguera-doble-cara-1.webp',
    'venta-de-manguera-single.webp','venta-de-mangueras-doble.webp'
  ]},
  { slug: 'senalizacion-emergencia-catalogo', dir: `${SRC}/senalizacion`, files: [
    'letrero-de-punta-de-reencuentro.webp','senalamiento-de-regadera-de-emergencia.webp',
    'senalamiento-de-rompase-en-caso-de-emergencia.webp','senalizacion-de-obligacion.webp',
    'senalizacion-de-prohibicion-en-venta.webp','venta-de-senalamiento-de-adevertencia.webp',
    'venta-de-senalamiento-de-prohibicion.webp','venta-de-senalizacion-de-obligacion.webp',
    'venta-de-senalizacion-de-salvacion-2.webp','senalamiento-de-prohibido-estacionarse.webp'
  ]},
  { slug: 'monitor-industrial-exm2-catalogo', dir: `${SRC}/monitores`, files: [
    'monitor-manual-de-arranque-rapido-2.webp','monitor-manual-de-arranque-rapido.webp',
    'monitor-manual-en-venta-2.webp','monitores-contra-incendios-emx2.webp',
    'monitores-contra-incendios-en-venta-1-1.webp','monitores-contra-incendios-en-venta-2.webp',
    'monitores-contra-incendios-en-venta-4.webp','venta-de-monitores-contra-incendios-2-1.webp',
    'venta-de-monitores-contra-incendios-industriales.webp','venta-de-monitores-industriales.webp'
  ]},
  { slug: 'equipo-bombero-nfpa-catalogo', dir: `${SRC}/equipo-bomberos`, files: [
    'arnes-de-rescate.jpg','casco-de-bombero.webp','equipo-de-respiracion-autonoma.webp',
    'trajes-de-bombero-en-venta.webp','venta-de-botas-de-bombero.webp','venta-de-casco-de-bombero.webp',
    'venta-de-guantes-de-bombero-1.webp','venta-de-guantes-de-bombero.webp',
    'venta-de-traje-de-bombero-de-aproximacion.webp','venta-de-traje-de-bombero-forestal.webp'
  ]},
  { slug: 'instalaciones-lga-empresa', dir: NOSOTROS, files: [
    'lga-equipo-contra-incendios.jpg','empresa-responsable-para-venta-de-equipos-contra-incendios.jpg'
  ]},
];

const nn = n => String(n).padStart(2, '0');

async function run() {
  for (const g of GRUPOS) {
    for (let i = 0; i < g.files.length; i++) {
      const src = path.join(g.dir, g.files[i]);
      const idx = nn(i + 1);
      for (const w of [1280, 640]) {
        const h = Math.round(w * (RATIO_H / RATIO_W));
        const out = path.join(OUT, `${g.slug}-${idx}-${w}.avif`);
        try {
          await sharp(src)
            .resize(w, h, { fit: 'cover', position: 'attention' })
            .avif({ quality: 55, effort: 4 })
            .toFile(out);
        } catch (e) {
          console.error('FALLO', src, '->', out, e.message);
        }
      }
    }
    console.log(g.slug, g.files.length, 'imagenes x2 anchos');
  }
}
run();
