/**
 * Fotografía de FIREFIGHTERS MX (firefighters.mx) al formato del directorio.
 *
 * A diferencia de los convertidores anteriores, que leían el repo del cliente
 * en disco, este descarga los originales del sitio publicado: la ficha
 * describe lo que el cliente muestra en producción, así que la fuente es esa.
 *
 * Criterio de selección: solo fotografía de producto, servicio y operación.
 * Quedan fuera los bodegones de SCBA de /productos/ (rotulan nombres propios y
 * cuerpos de bomberos extranjeros: FDNY, «R. MILLER», «L. CARTER») y las
 * imágenes de marca.
 *
 * Uso (desde una copia del repo con node_modules):
 *   OUT=<repo>/public/img/seguridad-contra-incendios node scripts/convertir_firefightersmx.mjs
 */
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const BASE = 'https://firefighters.mx/images/';
const OUT = process.env.OUT ?? 'public/img/seguridad-contra-incendios';
const RATIO_W = 1280, RATIO_H = 714;

export const GRUPOS = [
  {
    slug: 'equipo-bombero-firefighters-mx',
    files: [
      'catalogo/trajes-bombero', 'giros/venta-equipo', 'catalogo/cascos-nfpa',
      'categorias/trajes-bombero', 'categorias/epp-bombero', 'categorias/cascos-nfpa',
      'nosotros/bombero-proteccion-completa-mexico', 'nosotros/bombero-equipo-nfpa-firefightersmx',
      'nosotros/nosotros-equipo-bombero-uniformado', 'nosotros/firefightersmx-equipo-profesional-mexico',
    ],
  },
  {
    slug: 'respiracion-y-rescate-firefighters-mx',
    files: [
      'catalogo/equipos-scba', 'productos/tipos/scba', 'categorias/equipos-scba',
      'productos/tipos/scba-rit', 'catalogo/camaras-termicas', 'categorias/camaras-termicas',
      'catalogo/herramientas-rescate', 'categorias/herramientas-rescate',
      'categorias/rescate-vertical', 'catalogo/hazmat',
    ],
  },
  {
    slug: 'sistemas-contra-incendio-firefighters-mx',
    files: [
      'servicios/instalacion-sistemas-ci', 'catalogo/rociadores', 'catalogo/bombas-red-hidraulica',
      'catalogo/deteccion-alarma', 'catalogo/hidrantes-gabinetes', 'catalogo/supresion-agentes-limpios',
      'giros/sistemas-ci', 'categorias/sistemas-ci', 'home/por-que-asesoria-especializada',
    ],
  },
  {
    slug: 'extintores-firefighters-mx',
    files: [
      'servicios/mantenimiento', 'catalogo/extintores', 'giros/extintores',
      'productos/tipos/extintor-pqs', 'productos/tipos/extintor-agente-limpio',
      'productos/tipos/extintor-tipo-k', 'productos/tipos/extintor-ruedas-co2',
      'productos/tipos/extintor-afff', 'productos/tipos/extintor-agua',
      'productos/tipos/extintor-ruedas', 'categorias/extintores',
    ],
  },
  {
    slug: 'capacitacion-brigadas-firefighters-mx',
    files: [
      'servicios/capacitacion', 'giros/capacitacion', 'servicios/brigadas-empresariales',
      'industrias/brigadas-industriales', 'nosotros/nosotros-bombero-emergencia-accion',
    ],
  },
  {
    slug: 'auditoria-y-expediente-firefighters-mx',
    files: [
      'servicios/auditoria-seguridad', 'home/proceso-consulta-diagnostico', 'servicios/licitaciones',
      'home/proceso-cotizacion-formal', 'home/por-que-certificacion-verificable',
      'catalogo/senalizacion-emergencia',
    ],
  },
  {
    slug: 'cobertura-nacional-firefighters-mx',
    files: [
      'giros/estados', 'industrias/bomberos-municipales', 'home/cobertura-cdmx',
      'industrias/aeropuertos-arff', 'home/cobertura-norte', 'home/cobertura-proyectos-especiales',
    ],
  },
  {
    slug: 'logistica-y-posventa-firefighters-mx',
    files: [
      'home/proceso-entrega-coordinada', 'home/por-que-distribucion-directa',
      'home/por-que-soporte-postventa', 'home/proceso-soporte-postventa',
      'nosotros/nosotros-distribuidor-autorizado-mexico',
    ],
  },
];

async function bajar(rel) {
  const r = await fetch(`${BASE}${rel}.avif`);
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${rel}`);
  return Buffer.from(await r.arrayBuffer());
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  let total = 0, fallos = 0;
  for (const grupo of GRUPOS) {
    let i = 0;
    for (const rel of grupo.files) {
      i++;
      const n = String(i).padStart(2, '0');
      let buf;
      try { buf = await bajar(rel); } catch (e) { fallos++; console.error(`FALLO descarga ${rel}: ${e.message}`); continue; }
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
