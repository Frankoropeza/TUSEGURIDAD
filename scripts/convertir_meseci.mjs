import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const SRC = '/Users/frankoropeza/Documents/Claude/Projects/MESECI/public/images/productos';
const OUT = '/Users/frankoropeza/Documents/Claude/Projects/TUSEGURIDAD/public/img/seguridad-contra-incendios';
const RATIO_W = 1280, RATIO_H = 714;

const GRUPOS = [
  {
    slug: 'extintor-meseci-catalogo',
    dir: 'extintores',
    files: [
      'extintor-de-polvo-quimico-seco-pqs-6-kg-certificado-para-negocio.avif',
      'extintor-de-polvo-quimico-seco-pqs-4-5-kg-cumple-nom-para-negocio.avif',
      'extintor-de-bioxido-de-carbono-co2-10-15-o-20-lbs.avif',
      'extintor-de-bioxido-de-carbono-co2-50-lbs.avif',
      'extintor-de-agua-a-presion-10-lts.avif',
      'extintor-de-agua-marca-meseci-bajo-norma-facil-activacion.avif',
      'extintor-de-espuma-afff-6-litros-para-liquidos-inflamables.avif',
      'extintor-espumogeno-alta-eficiencia-de-9-litros.avif',
      'agente-humedo-tipo-k.avif',
      'agente-limpio.avif',
      'extintor-de-agentes-limpios-hfc-4-5-kgs.avif',
      'extintor-abc-de-9-kg-para-areas-de-riesgo.avif',
      'paquete-de-5-extintores-abc-solucion-completa-para-tu-empresa.avif',
      'unidad-movil-polvo-quimico-seco-pqs-de-25-35-y-50-kgs.avif',
      'kit-de-extintores-de-polvo-quimico-seco-abc-seguridad-industrial.avif',
    ],
  },
  {
    slug: 'bombero-epp-meseci-catalogo',
    dir: 'bomberos',
    files: [
      'traje-de-bombero-estructural-skold-hero-certificado-ul.avif',
      'skold-hero-traje-completo-para-bombero-profesional.avif',
      'traje-estructural-skold-con-refuerzos-de-kevlar.avif',
      'casco-de-bombero-de-compuesto-cairns-msa-1836-proteccion-superior.avif',
      'casco-contra-incendios-certificado-cairns-msa-1836-la-mejor-opcion-para-el-bombero-moderno.avif',
      'botas-de-bombero-de-piel-de-alta-resistencia-creadas-para-durar.avif',
      'botas-para-bombero-skold.avif',
      'guante-para-bombero-talla-g-color-ocre-certificacion-nfpa-1971.avif',
      'guante-para-bombero-de-piel-con-forro-kevlar-confort-y-seguridad.avif',
      'equipo-de-respiracion-autonoma-phantom-97-skold.avif',
      'equipo-de-bombero-estructural-skold-hero-certificado-nfpa-1971.avif',
      'hacha-de-pico-y-corte.avif',
      'barra-halligan.avif',
      'kit-traje-de-aproximacion-aluminizado-casco-monja-chaqueton-pantalon-tirantes-guantes-y-botas.avif',
      'chaqueton-y-pantalon-skold.avif',
    ],
  },
  {
    slug: 'gabinete-meseci-catalogo',
    dir: 'gabinetes',
    files: [
      'gabinete-metalico-contra-incendios-60x60-laminado.avif',
      'gabinete-para-modelo-30-m-tipo-libro.avif',
      'gabinetes-ci-de-acero-inoxidable-modelo-30-m.avif',
      'gabinetes-ci-de-modelo-30-me-de-acero-inoxidable.avif',
      'gabinetes-ci-modelo-30-m.avif',
      'gabinetes-ci-modelo-30-me.avif',
      'gabinetes-para-8-equipos-de-bombero-medidas-estandar.avif',
      'gabinetes-para-almacenamiento-de-productos-inflamables.avif',
      'gabinetes-para-equipos-de-bombero-medidas-estandar.avif',
      'gabinetes-para-extintor.avif',
      'porta-extintores.avif',
    ],
  },
  {
    slug: 'componente-meseci-catalogo',
    dir: 'general',
    files: [
      'adaptadores-en-bronce-para-equipo-ci.avif',
      'boquilla-para-monitor.avif',
      'boquillas-de-aspersion-en-bronce-de-1-2-y-1-pulgada.avif',
      'chiflon-de-niebla.avif',
      'gabinete-inoxidable-pulido-para-zonas-de-alta-humedad.avif',
      'gabinete-metalico-para-extintor-de-4-5-kg-apertura-inmediata.avif',
      'gabinete-tipo-libro-para-manguera-de-30m-servicio-pesado.avif',
      'tapones-de-bronce.avif',
    ],
  },
  {
    slug: 'hidrante-meseci-catalogo',
    dir: 'hidrantes',
    files: [
      'hidrante-de-banqueta-nacional.avif',
      'hidrantes-contra-incendio-completo.avif',
      'hidrantes-de-banqueta.avif',
      'hidrantes-monitor.avif',
      'llave-para-hidrante-de-banqueta.avif',
    ],
  },
  {
    slug: 'manguera-meseci-catalogo',
    dir: 'mangueras',
    files: [
      'carrete-tipo-europeo.avif',
      'manguera-contra-incendio-blindex.avif',
      'manguera-contra-incendio-de-una-capa.avif',
      'manguera-contra-incendio-doble-capa.avif',
      'rollo-de-manguera-roja-1-5-x-50-ft-uso-rudo-400-psi.avif',
      'venta-de-manguera-roja-para-hidrante-1-5-pulgadas.avif',
    ],
  },
  {
    slug: 'senalizacion-meseci-catalogo',
    dir: 'senalizacion',
    files: [
      'barras-de-contencion.avif',
      'conos.avif',
      'equipamiento-complementario-de-proteccion-civil.avif',
      'gabinetes-para-extintores-metalicos-y-acrilicos.avif',
      'poste-delimitador.avif',
      'senales-fotoluminiscentes-certificadas.avif',
      'servicio-de-instalacion-profesional-y-certidicacion-integral.avif',
      'señalizacion-completa-de-rutas-de-evacuacion.avif',
      'soportes-y-bases-para-extintores-certificados.avif',
      'traffitambos.avif',
    ],
  },
  {
    slug: 'seguridad-industrial-meseci-catalogo',
    dir: 'seguridad-industrial',
    files: [
      'casco-de-proteccion.avif',
      'chalecos-industriales.avif',
      'guantes-de-proteccion.avif',
      'lava-ojos-portatil-skold.avif',
      'lentes-de-proteccion.avif',
      'regaderas-lava-ojos-skold.avif',
    ],
  },
];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let total = 0, fallos = 0;
  for (const grupo of GRUPOS) {
    let i = 0;
    for (const file of grupo.files) {
      i++;
      const srcPath = path.join(SRC, grupo.dir, file);
      const n = String(i).padStart(2, '0');
      for (const w of [1280, 640]) {
        const h = Math.round((w / RATIO_W) * RATIO_H);
        const outPath = path.join(OUT, `${grupo.slug}-${n}-${w}.avif`);
        try {
          await sharp(srcPath)
            .resize(w, h, { fit: 'cover', position: 'attention' })
            .avif({ quality: 55, effort: 4 })
            .toFile(outPath);
          total++;
        } catch (e) {
          fallos++;
          console.error(`FALLO: ${srcPath} -> ${outPath}: ${e.message}`);
        }
      }
    }
    console.log(`${grupo.slug}: ${grupo.files.length} imagenes x2 anchos`);
  }
  console.log(`\nTotal generados: ${total}, fallos: ${fallos}`);
}

main();
