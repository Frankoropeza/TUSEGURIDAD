/**
 * Normaliza las capturas crudas de los padrones oficiales a JSON consumible.
 *
 *   node scripts/padron-normaliza.mjs
 *
 * Entrada:  data/padron/fuente/<slug>.raw.txt   (captura literal de la fuente)
 * Salida:   src/data/padron/<slug>.json
 *
 * La captura cruda se versiona junto al script a propósito: cualquiera puede
 * reproducir el JSON publicado y cotejarlo contra el registro de la autoridad.
 * Formato de la captura, un renglón por empresa:
 *
 *   expediente|razón social sin sufijo societario|código de sufijo|teléfonos|vigencia AAMMDD
 *
 * Códigos de sufijo: ~S S.A. de C.V. · ~R S. de R.L. de C.V. · ~C S.C. · ~P S.A.P.I. de C.V.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const FUENTE = 'data/padron/fuente/cdmx-proteccion-personas.raw.txt';
const SALIDA = 'src/data/padron/cdmx-proteccion-personas.json';

const SUF = { '~S': 'S.A. de C.V.', '~R': 'S. de R.L. de C.V.', '~C': 'S.C.', '~P': 'S.A.P.I. de C.V.' };

// Título de caso para razones sociales que vienen en MAYÚSCULAS en la fuente.
const MIN = new Set(['de','del','la','las','los','y','en','e','a','al','para','por','con','sobre']);
const SIGLAS = new Set(['SPPEL','GSI','CSCP','DBM','IPS','RCU','SP','NSU','PISA','JIMVM','RMS','OA','BZR','SARI','MF','HT','RM','CB','HG','PYE','Z&O','SC']);
function titulo(s) {
  return s.split(/\s+/).map((w, i) => {
    const limpio = w.replace(/[^A-ZÑÁÉÍÓÚ&.-]/gi, '');
    const bajo = w.toLowerCase();
    if (i > 0 && MIN.has(bajo)) return bajo;
    if (SIGLAS.has(limpio.toUpperCase())) return limpio.toUpperCase();
    if (/^[A-ZÑ]$/.test(limpio)) return w.toUpperCase();
    return bajo.replace(/(^|[\s(-])([a-zñáéíóú])/g, (_, p, c) => p + c.toUpperCase());
  }).join(' ');
}

function slugify(s) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase().replace(/&/g, ' y ').replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '').slice(0, 70);
}

const lineas = readFileSync(FUENTE, 'utf8').trim().split('\n');
const vistos = new Set();
const empresas = lineas.map((linea) => {
  const [expediente, nombreRaw, suf, telRaw, vig] = linea.split('|');

  // Solo se publican teléfonos de 10 dígitos: la fuente trae algunos campos
  // concatenados o incompletos y publicarlos sería propagar un dato malo.
  const telefonos = (telRaw || '').split(',')
    .map((t) => t.trim()).filter((t) => /^\d{10}$/.test(t));

  const yy = vig.slice(0, 2), mm = vig.slice(2, 4), dd = vig.slice(4, 6);
  const vigencia = `20${yy}-${mm}-${dd}`;

  const sa = /,\s*S\.A\.$/i.test(nombreRaw);
  const base = nombreRaw.replace(/,\s*S\.A\.$/i, '');
  const razon = titulo(base) + (SUF[suf] ? `, ${SUF[suf]}` : sa ? ', S.A.' : '');
  // Cadena exacta publicada por la autoridad — es la que permite cotejar el registro.
  const razonOficial = base.toUpperCase() + (SUF[suf] ? `, ${SUF[suf].toUpperCase()}` : sa ? ', S.A.' : '');
  // Persona física: el permiso está a nombre de una persona, no de una sociedad.
  const personaFisica = !suf && !/,\s*S\./i.test(nombreRaw);

  let slug = slugify(nombreRaw);
  while (vistos.has(slug)) slug += '-2';
  vistos.add(slug);

  return { expediente, razonSocial: razon, razonOficial, slug, telefonos, vigencia, personaFisica };
}).sort((a, b) => a.razonSocial.localeCompare(b.razonSocial, 'es'));

const salida = {
  plaza: 'cdmx',
  rubro: 'seguridad-privada',
  modalidad: 'Protección a personas (escolta)',
  estatus: 'Permiso vigente',
  autoridad: 'Dirección General de Seguridad Privada y Colaboración Interinstitucional (SSC CDMX)',
  fuente: {
    titulo: 'Empresas registradas para servicio de seguridad privada — SSC Ciudad de México',
    url: 'https://data.ssc.cdmx.gob.mx/escoltas/empresas_registradas.html',
  },
  fuenteRevocados: {
    titulo: 'Empresas con permiso revocado — SSC Ciudad de México',
    url: 'https://data.ssc.cdmx.gob.mx/escoltas/empresas_jn.html',
    nota: 'A la fecha de corte, la autoridad no reporta empresas con permiso revocado en esta modalidad.',
  },
  fechaCorte: '2026-07-29',
  total: empresas.length,
  empresas,
};

writeFileSync(SALIDA, JSON.stringify(salida, null, 2) + '\n');
console.log('total:', empresas.length, '| con teléfono:', empresas.filter(e=>e.telefonos.length).length, '| personas físicas:', empresas.filter(e=>e.personaFisica).length);
console.log('slugs únicos:', new Set(empresas.map(e => e.slug)).size, '→', SALIDA);
