import sharp from 'sharp';
import path from 'path';

const SRC = '/Users/frankoropeza/Documents/Claude/Projects/GAMADEMEXICO/public/img';
const OUT = '/Users/frankoropeza/Documents/Claude/Projects/TUSEGURIDAD/public/img/seguridad-contra-incendios';
const RATIO_W = 1280, RATIO_H = 714;

// Curaduría 2026-08-21: solo fotografía con evidencia de ser real (líneas de
// producto Elkhart Brass reales, o carpetas sin patrón de generación IA en
// lote detectado). Se excluyen deliberadamente los archivos "-tipo-" y los
// lotes numerados sospechosos (monitor-tipo-corazon, boquilla-tipo-pistola,
// y la cola de valvulas-contra-incendios con numeración 30+) — ver
// IMAGE-AUDIT-REPORT.md del repo fuente y el Expediente de este cliente.
const GRUPOS = [
  { slug: 'monitor-elkhart-gamademexico-catalogo', dir: `${SRC}/monitores-contra-incendios`, files: [
    'elkhart-cobra-exm2-hero-premium-2026.avif','elkhart-cobra-exm2-fondo-industrial.avif',
    'elkhart-copperhead-fondo-industrial.avif','elkhart-copperhead-mon-01.avif',
    'elkhart-ram-xd-mon-01.avif',
    'elkhart-scorpion-exm2-hero-premium-2026.avif','elkhart-scorpion-exm2-fondo-industrial.avif',
    'elkhart-scorpion-manual-mon-01.avif',
    'elkhart-sidewinder-exm2-hero-premium-2026.avif','elkhart-sidewinder-manual-fondo-industrial.avif',
    'elkhart-spitfire-fondo-industrial.avif',
    'elkhart-stinger-2-0-hero-premium-2026.avif','elkhart-stinger-2-0-mon-01.avif',
    'elkhart-stingray-fondo-industrial.avif','elkhart-vulcan-hero-premium-2026.avif',
  ]},
  { slug: 'boquilla-elkhart-gamademexico-catalogo', dir: `${SRC}/boquillas-contra-incendios`, files: [
    'elkhart-chief-xd-hero-premium-2026.avif','elkhart-chief-xd-fondo-industrial.avif',
    'elkhart-chief-xd-boq-01.avif','elkhart-chief-xd-fondo-blanco.avif',
    'elkhart-phantom-xd-fondo-industrial.avif','elkhart-phantom-xd-boq-01.avif',
    'elkhart-select-o-matic-xd-hero-premium-2026.avif','elkhart-select-o-matic-xd-fondo-industrial.avif',
    'elkhart-select-o-matic-xd-boq-01.avif',
    'elkhart-select-o-stream-fondo-industrial.avif','elkhart-select-o-stream-fondo-blanco.avif',
    'elkhart-x-stream-fondo-industrial.avif','elkhart-x-stream-fondo-blanco.avif',
    'elkhart-xd-smooth-bore-fondo-industrial.avif','elkhart-xd-smooth-bore-fondo-blanco.avif',
  ]},
  { slug: 'valvula-contra-incendios-gamademexico-catalogo', dir: `${SRC}/valvulas-contra-incendios`, files: [
    'valvula-check-swing-bridada-contra-incendios-vista-frontal-02.avif',
    'valvula-check-swing-bridada-contra-incendios-fondo-blanco-11.avif',
    'valvula-check-swing-bridada-contra-incendios-ul-fm-certificada-15.avif',
    'valvula-compuerta-osy-01.avif',
    'valvula-compuerta-osy-ranurada-contra-incendios-fondo-blanco-01.avif',
    'valvula-compuerta-osy-ranurada-contra-incendios-vista-frontal-16.avif',
    'valvula-compuerta-osy-ranurada-contra-incendios-ul-fm-listed-11.avif',
    'valvula-globo-bronce-01.avif',
    'valvula-globo-bridada-acero-inoxidable-contra-incendios-fondo-blanco-01.avif',
    'valvula-globo-bridada-acero-inoxidable-contra-incendios-vista-frontal-13.avif',
    'valvula-mariposa-bridada-01.avif',
    'valvula-mariposa-indicadora-contra-incendios-vista-frontal-14.avif',
    'valvula-mariposa-indicadora-contra-incendios-tamper-switch-fondo-blanco-01.avif',
    'valvula-mariposa-indicadora-contra-incendios-ul-fm-certificada-03.avif',
    'valvula-retencion-check-01.avif',
  ]},
  { slug: 'manguera-industrial-gamademexico-catalogo', dir: `${SRC}/mangueras-contra-incendios`, files: [
    'manguera-blindex-1-5-15m-frontal.avif','manguera-blindex-2-5-30m-refineria.avif',
    'manguera-blindex-pemex-certificacion.avif','manguera-blindex-storz-frontal.avif',
    'manguera-blindex-afff-frontal.avif',
    'manguera-millhose-1-5-15m-frontal.avif','manguera-millhose-elkhart-frontal.avif',
    'manguera-millhose-elkhart-certificacion.avif','manguera-millhose-amarilla-frontal.avif',
    'manguera-forestal-contra-incendios-vista-frontal-17.avif','manguera-forestal-amarilla-01.avif',
    'manguera-succion-4-3m-frontal.avif','manguera-succion-6-3m-industrial.avif',
    'manguera-succion-flotador-frontal.avif','manguera-succion-colador-frontal.avif',
  ]},
  { slug: 'conexion-herraje-gamademexico-catalogo', dir: `${SRC}/conexiones-herrajes`, files: [
    'adaptador-bronce-nh-storz-2-5-frontal.avif','adaptador-aluminio-elk-o-lite-4-frontal.avif',
    'chiflon-chief-xd-1-5-frontal.avif','chiflon-niebla-ajustable-frontal.avif',
    'chiflon-quimicos-ul401-certificacion.avif',
    'conexion-wye-b100a-frontal.avif','conexion-wye-manometro-gauge.avif',
    'cople-storz-5-bronce-frontal.avif',
    'toma-siamesa-cromada-frontal.avif','toma-siamesa-inox-316-frontal.avif',
    'toma-siamesa-4a-clappered-frontal.avif','toma-siamesa-instalacion-industrial.avif',
    'llave-hidrante-pentagonal-frontal.avif','kit-accesorios-gabinete-frontal.avif',
    'reduccion-storz-4-2-5-frontal.avif',
  ]},
  { slug: 'gabinete-hidrante-gamademexico-catalogo', dir: `${SRC}/gabinetes-hidrantes`, files: [
    'gabinete-30me-frontal.avif','gabinete-manguera-producto-frontal.avif',
    'hidrante-350psi-frontal.avif','hidrante-4salidas-frontal.avif',
    'hidrante-banqueta-instalado.avif','hidrante-barril-seco.avif',
    'hidrante-enterrado-tapa.avif','hidrante-indicador-frontal.avif',
    'hidrante-monitoreado-panel.avif','hidrante-seco-instalado.avif',
    'hidrante-trafico-frontal.avif','producto-gabinete-hidrante-instalado.avif',
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
