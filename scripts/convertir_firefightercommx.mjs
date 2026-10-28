/**
 * Fotografía de FIREFIGHTER.COM.MX (firefighter.com.mx) al formato del directorio.
 *
 * Descarga del sitio publicado la versión de 1000×750 de su catálogo (es la
 * mayor que sirve) y la lleva a 1280/640 × ratio del directorio. Selección:
 * una foto por toma (el sitio repite algunas entre categorías) y sin rótulos
 * de marca de panel en primer plano.
 *
 * Uso (desde una copia del repo con node_modules):
 *   OUT=<repo>/public/img/seguridad-contra-incendios node scripts/convertir_firefightercommx.mjs
 */
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const BASE = 'https://firefighter.com.mx';
const OUT = process.env.OUT ?? 'public/img/seguridad-contra-incendios';
const RATIO_W = 1280, RATIO_H = 714;

const GRUPOS = [ { "slug": "epp-bombero-firefighter-com-mx", "files": [ "/images/catalogo/1592235905030-1000x750.webp", "/images/catalogo/1776648120640-1000x750.webp", "/images/catalogo/1638401607229-1000x750.webp", "/images/catalogo/1651368615152-1000x750.webp", "/images/catalogo/1756112277157-1000x750.webp", "/images/catalogo/1735107673023-1000x750.webp", "/images/catalogo/1759673824678-1000x750.webp" ] }, { "slug": "respiracion-firefighter-com-mx", "files": [ "/images/catalogo/1606613816768-1000x750.webp", "/images/catalogo/1705503729371-1000x750.webp", "/images/catalogo/1776104501594-1000x750.webp", "/images/catalogo/1683470156383-1000x750.webp", "/images/catalogo/1666518809220-1000x750.webp" ] }, { "slug": "extintores-firefighter-com-mx", "files": [ "/images/catalogo/extintor-halotron-unidad-portatil-1000x750.avif", "/images/catalogo/extintor-co2-cuarto-servidores-1000x750.avif", "/images/catalogo/extintor-agua-instalacion-industrial-1000x750.avif", "/images/catalogo/1633092228879-1000x750.webp", "/images/catalogo/extintor-agua-montaje-muro-1000x750.avif", "/images/catalogo/extintor-agua-empotrado-circulacion-1000x750.avif", "/images/catalogo/sistema-afff-instalacion-industrial-1000x750.avif", "/images/catalogo/extintor-clase-k-placa-identificacion-1000x750.avif", "/images/catalogo/extintor-co2-corredor-computo-1000x750.avif", "/images/catalogo/sistema-afff-banco-cilindros-inspeccion-1000x750.avif" ] }, { "slug": "rescate-firefighter-com-mx", "files": [ "/images/catalogo/1776784163560-1000x750.webp", "/images/catalogo/1576253073552-1000x750.webp", "/images/catalogo/1731694405812-1000x750.webp", "/images/catalogo/1595345263387-1000x750.webp", "/images/catalogo/1556568303-09-1000x750.webp", "/images/catalogo/1584033376442-1000x750.webp" ] }, { "slug": "forestal-firefighter-com-mx", "files": [ "/images/catalogo/1764639566101-1000x750.webp", "/images/catalogo/1642752468603-1000x750.webp", "/images/catalogo/1649433185234-1000x750.webp", "/images/catalogo/1593999094742-1000x750.webp", "/images/catalogo/1561145999-1000x750.webp" ] }, { "slug": "deteccion-firefighter-com-mx", "files": [ "/images/catalogo/1583101826594-1000x750.webp", "/images/catalogo/1607668552058-1000x750.webp", "/images/catalogo/1668351641233-1000x750.webp", "/images/catalogo/1627257062083-1000x750.webp", "/images/catalogo/1624060670114-1000x750.webp", "/images/catalogo/1565012384794-1000x750.webp" ] }, { "slug": "sistemas-fijos-firefighter-com-mx", "files": [ "/images/catalogo/1690973692388-1000x750.webp", "/images/catalogo/1632576201861-1000x750.webp", "/images/catalogo/1531259579224-1000x750.webp", "/images/catalogo/1580342499219-1000x750.webp", "/images/catalogo/1700518959891-1000x750.webp", "/images/catalogo/1595615191937-1000x750.webp", "/images/catalogo/1684777310518-1000x750.webp" ] }, { "slug": "senalizacion-firefighter-com-mx", "files": [ "/images/catalogo/1524957467802-1000x750.webp", "/images/catalogo/1739567773441-1000x750.webp", "/images/catalogo/1647451969544-1000x750.webp", "/images/catalogo/1624638760852-1000x750.webp", "/images/catalogo/1564144573017-1000x750.webp", "/images/catalogo/1578986568309-1000x750.webp" ] } ];

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let total = 0, fallos = 0;
  for (const grupo of GRUPOS) {
    let i = 0;
    for (const rel of grupo.files) {
      i++;
      const n = String(i).padStart(2, '0');
      let buf;
      try {
        const r = await fetch(BASE + rel);
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        buf = Buffer.from(await r.arrayBuffer());
      } catch (e) { fallos++; console.error(`FALLO descarga ${rel}: ${e.message}`); continue; }
      for (const w of [1280, 640]) {
        const h = Math.round((w / RATIO_W) * RATIO_H);
        const outPath = path.join(OUT, `${grupo.slug}-${n}-${w}.avif`);
        try {
          await sharp(buf).resize(w, h, { fit: 'cover', position: 'attention' })
            .avif({ quality: 55, effort: 4 }).toFile(outPath);
          total++;
        } catch (e) { fallos++; console.error(`FALLO ${rel} -> ${outPath}: ${e.message}`); }
      }
    }
    console.log(`${grupo.slug}: ${grupo.files.length} imagenes x2 anchos`);
  }
  console.log(`\nTotal generados: ${total}, fallos: ${fallos}`);
  if (fallos) process.exit(1);
}

main();
