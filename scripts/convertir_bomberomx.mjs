import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const SRC = '/Users/frankoropeza/Documents/Claude/Projects/BOMBERO/public/images';
const OUT = '/Users/frankoropeza/Documents/Claude/Projects/TUSEGURIDAD/public/img/seguridad-contra-incendios';
const RATIO_W = 1280, RATIO_H = 714;

const GRUPOS = [
  {
    slug: 'traje-bombero-mx-catalogo',
    dir: 'trajes-para-bombero',
    files: [
      'traje-bombero-estructural-nfpa-1971-modelo-frontal-05.avif',
      'traje-turnout-nfpa-1971-03.avif',
      'traje-bombero-forestal-04.avif',
      'traje-incendios-forestales-nfpa-1977-05.avif',
      'traje-bombero-hazmat-02.avif',
      'traje-quimico-bombero-03.avif',
      'traje-bombero-industrial-02.avif',
      'traje-bombero-brigada-02.avif',
      'traje-bombero-proximidad-02.avif',
      'traje-bombero-rescate-02.avif',
      'chaqueton-bombero-goretex-sistema-3-capas-detalle-01.avif',
      'sistema-3-capas-traje-bombero-exploded-view-01.avif',
      'certificacion-nfpa-1971-tejido-nomex-goretex-01.avif',
      'traje-bombero-nomex-04.avif',
      'bunker-gear-bombero-camion-estacion-01.avif',
    ],
  },
  {
    slug: 'casco-bombero-mx-catalogo',
    dir: 'cascos-para-bomberos',
    files: [
      'casco-bombero-estructural-nfpa-1971-04.avif',
      'casco-bombero-forestal-nfpa-1977-003.avif',
      'casco-bombero-arff-aeroportuario-02.avif',
      'casco-bombero-brigada-industrial-004.avif',
      'casco-bombero-combate-incendio-proteccion-03.avif',
      'casco-bombero-detalle-material-termoplastico-02.avif',
      'casco-bombero-equipado-estacion-profesional-03.avif',
      'casco-bombero-estacion-frontal-reflectante-05.avif',
      'casco-bombero-estudio-dramatico-perfil-02.avif',
      'casco-bombero-estructural-premium-nfpa-1971.avif',
      'casco-bombero-cuerpo-completo-equipamiento-01.avif',
      'casco-bombero-editorial-camion-reflectante-01.avif',
      'casco-bombero-editorial-estacion-ambiente-01.avif',
      'casco-bombero-forestal-nfpa-1977-02.avif',
      'casco-bombero-brigada-industrial-08.avif',
    ],
  },
  {
    slug: 'guante-bombero-mx-catalogo',
    dir: 'guantes-para-bomberos',
    files: [
      'guante-bombero-estructural-nfpa-1971-03.avif',
      'guante-bombero-forestal-nfpa-1977-04.avif',
      'guante-bombero-hazmat-nfpa-1991-02.avif',
      'guante-bombero-rescate-nfpa-1951-05.avif',
      'guante-bombero-industrial-02.avif',
      'guante-bombero-producto-par-cuero-kevlar-01.avif',
      'guante-bombero-producto-estructural-nomex-03.avif',
      'guante-bombero-detalle-palma-cuero-vaqueta-01.avif',
      'guante-cuero-bombero-02.avif',
      'guante-nomex-bombero-03.avif',
      'guante-bombero-combate-incendio-manguera-02.avif',
      'guante-bombero-operacion-manguera-estacion-01.avif',
      'guante-bombero-profesional-04.avif',
      'guantes-coleccion-hero.avif',
      'guante-bombero-estacion-colocacion-cuero-03.avif',
    ],
  },
  {
    slug: 'bota-bombero-mx-catalogo',
    dir: 'botas-para-bomberos',
    files: [
      'bota-bombero-estructural-nfpa-1971-05.avif',
      'bota-bombero-caucho-nfpa-1971-06.avif',
      'bota-bombero-forestal-nfpa-1977-04.avif',
      'bota-bombero-combate-incendio-caucho-05.avif',
      'bota-bombero-detalle-suela-vibram-02.avif',
      'bota-bombero-producto-caucho-par-estudio-03.avif',
      'bota-bombero-estudio-dramatico-caucho-02.avif',
      'bota-bombero-editorial-bombero-completo-02.avif',
      'bota-bombero-estacion-camion-caucho-01.avif',
      'bota-bombero-profesional-05.avif',
      'botas-coleccion-hero.avif',
      'bota-bombero-producto-individual-lateral-01.avif',
      'bota-bombero-caucho-nfpa-1971-10.avif',
      'bota-bombero-forestal-nfpa-1977-08.avif',
      'bota-bombero-estructural-nfpa-1971-09.avif',
    ],
  },
  {
    slug: 'capucha-bombero-mx-catalogo',
    dir: 'capucha-para-bombero',
    files: [
      'capucha-bombero-nomex-proteccion-cuello-orejas-01.avif',
      'capucha-particulada-bombero-certificada-nfpa-01.avif',
      'capucha-pbi-gold-bombero-proteccion-termica-nfpa-01.avif',
      'monja-bombero-certificada-nfpa-proteccion-termica-01.avif',
      'monja-particulada-bombero-certificada-nfpa-01.avif',
      'monja-pbi-gold-bombera-proteccion-cuello-nfpa-01.avif',
      'capucha-bombero-producto-negra-perfil-lateral-02.avif',
      'capucha-bombero-producto-pbi-gold-estudio-frontal-01.avif',
      'capucha-bombero-detalle-costuras-kevlar-proteccion-01.avif',
      'capucha-forestal-bombero-proteccion-incendio-01.avif',
      'capucha-bombero-comparativa-modelos-estacion-01.avif',
      'monja-nomex-bombero-proteccion-menton-nfpa-01.avif',
      'capucha-hero.avif',
      'capucha-bombero-estacion-nomex-blanca-profesional-01.avif',
      'monja-bombero-nfpa-equipo-completo-scba-01.avif',
    ],
  },
  {
    slug: 'gafas-bombero-mx-catalogo',
    dir: 'gafas-para-bomberos',
    files: [
      'gafas-proteccion-bombero-nfpa-02.avif',
      'goggle-ambar-bombero-forestal-incendio-campo-01.avif',
      'gafas-bombero-goggle-casco-rescate-estacion-02.avif',
      'gafas-bombero-goggle-combate-interior-estructural-03.avif',
      'gafas-bombero-producto-goggle-frontal-transparente-01.avif',
      'gafas-bombero-producto-goggle-lente-espejo-premium-01.avif',
      'goggle-bombero-casco-europeo-lente-claro-01.avif',
      'gafas-seguridad-bombero-proteccion-ocular-nfpa-01.avif',
      'gafas-bombero-forestal-proteccion-humo-campo-01.avif',
      'gafas-coleccion-hero.avif',
      'goggle-sellado-bombero-proteccion-ocular-nfpa-01.avif',
      'gafas-bombero-goggle-rescate-escombros-colapso-03.avif',
      'gafas-proteccion-bombero-antiimpacto-casco-nfpa-01.avif',
      'goggle-bombera-scba-equipo-completo-nfpa-01.avif',
      'gafas-bombero-macro-lente-reflejo-edificio-llamas-01.avif',
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
