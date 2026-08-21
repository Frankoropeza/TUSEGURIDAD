import sharp from 'sharp';
import path from 'path';

const SRC = '/Users/frankoropeza/Documents/Claude/Projects/PROYECTORED/public/imagenes';
const OUT = '/Users/frankoropeza/Documents/Claude/Projects/TUSEGURIDAD/public/img/seguridad-contra-incendios';
const RATIO_W = 1280, RATIO_H = 714;

// Cada archivo puede ser un string (usa dir del grupo) o { name, dir } para
// mezclar subcarpetas de origen dentro de un mismo grupo/slug de salida.
const GRUPOS = [
  { slug: 'extintor-quimico-proyectored-catalogo', dir: `${SRC}/extintores`, files: [
    'extintor-abc-multiproposito-comercio-industria.avif',
    'extintor-afff-espuma-mecanica-liquidos-inflamables.avif',
    'extintor-agente-limpio-fe36-sin-residuos.avif',
    'extintor-agua-a-presion-fuegos-clase-a.avif',
    'extintor-automatico-proteccion-areas-desatendidas.avif',
    'extintor-co2-dioxido-carbono-equipo-electrico-cdmx.avif',
    'extintor-cold-fire-agente-enfriamiento-rapido.avif',
    'extintor-polvo-seco-pqs-instalado-oficina-cdmx.avif',
    'extintor-pqs-bodega-industrial-zona-cdmx.avif',
    'extintor-purpura-k-bicarbonato-potasio-industrial.avif',
    'extintor-tipo-k-cocina-industrial-restaurante.avif',
    'venta-extintor-pqs-abc-certificado-nom-mexico.avif',
  ]},
  { slug: 'gabinete-manguera-proyectored-catalogo', dir: `${SRC}/gabinetes`, files: [
    'gabinete-bombero.jpg','gabinete-mangueras.jpg','gabinetes-extintores.jpg',
    'gabinetes-hero.jpg','porta-extintor-cenicero.jpg',
    { name: 'adaptadores.jpg', dir: `${SRC}/mangueras` },
    { name: 'carrete-manguera.jpg', dir: `${SRC}/mangueras` },
    { name: 'chiflon.jpg', dir: `${SRC}/mangueras` },
    { name: 'llaves.jpg', dir: `${SRC}/mangueras` },
    { name: 'mangueras-hero.jpg', dir: `${SRC}/mangueras` },
    { name: 'toma-siamesa.jpg', dir: `${SRC}/mangueras` },
    { name: 'valvulas.jpg', dir: `${SRC}/mangueras` },
  ]},
  { slug: 'sistema-proyectored-catalogo', dir: `${SRC}/sistemas`, files: [
    'alarmas.jpg','detectores.jpg','redes-hidraulicas.jpg','rociadores.jpg',
    'tablero-control.jpg','tableros.jpg',
    { name: 'instalacion-sistemas-contra-incendio-deteccion-alarmas.avif', dir: `${SRC}/servicios` },
  ]},
  { slug: 'senalamiento-proyectored-catalogo', dir: `${SRC}/senalamientos`, files: [
    'advertencia.jpg','escaleras-emergencia.jpg','letrero-extintor.jpg','prohibicion.jpg',
    'punto-reunion.jpg','salida-emergencia.jpg','senalamientos-hero.jpg',
    { name: 'instalacion-senalamientos-fotoluminiscentes-norma-oficial.avif', dir: `${SRC}/servicios` },
  ]},
  { slug: 'equipo-bombero-proyectored-catalogo', dir: `${SRC}/equipo-bomberos`, files: [
    'arneses-rescate-altura.avif','complementos-uniforme-bombero.avif',
    'era-scba-respiracion-autonoma.avif','herramientas-rescate-bombero.avif',
    'traje-bombero-dotacion-completa-epp-nfpa-1971.avif',
    'traje-bombero-nomex-iii-estructural-nfpa-1971.avif',
    'traje-bombero-pbi-matrix-alta-proteccion-nfpa-1971.avif',
    'trajes-estructurales-nfpa-1971.avif',
  ]},
  { slug: 'equipo-seguridad-proyectored-catalogo', dir: `${SRC}/equipo-seguridad`, files: [
    'cascos.jpg','chalecos.jpg','conos.jpg','lentes.jpg','tapones-auditivos.jpg',
    'equipos-seguridad-hero.jpg',
    { name: 'botiquin.jpg', dir: `${SRC}/primeros-auxilios` },
    { name: 'botiquines-hero.jpg', dir: `${SRC}/primeros-auxilios` },
    { name: 'camilla.jpg', dir: `${SRC}/primeros-auxilios` },
    { name: 'camillas.jpg', dir: `${SRC}/primeros-auxilios` },
    { name: 'collarin.jpg', dir: `${SRC}/primeros-auxilios` },
  ]},
  { slug: 'escenario-proyectored-instalacion', dir: `${SRC}/escenarios`, files: [
    'cocina.avif','data-center.avif','industrial.avif','oficina.avif',
  ]},
  { slug: 'servicio-proyectored-hero', dir: `${SRC}/servicios`, files: [
    'asesoria-tecnica-proteccion-civil-dictamen-seguridad.avif',
    'capacitacion-brigadas-contra-incendio-constancia-dc3.avif',
    'mantenimiento-preventivo-extintores-poliza-anual.avif',
    'prueba-hidrostatica-extintores-nom-154-certificado.avif',
    'recarga-extintores-nom-154-servicio-domicilio.avif',
    'venta-equipo-contra-incendio-certificado-cdmx.avif',
  ]},
];

const nn = n => String(n).padStart(2, '0');

async function run() {
  for (const g of GRUPOS) {
    for (let i = 0; i < g.files.length; i++) {
      const f = g.files[i];
      const name = typeof f === 'string' ? f : f.name;
      const dir = typeof f === 'string' ? g.dir : f.dir;
      const src = path.join(dir, name);
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
