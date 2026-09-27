import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const directorioEmpresas = join(raiz, 'src/content/empresas');
const encabezado = /^(\s{0,3})(#{1,6})(?=[ \t]|$)/;

const normalizar = (contenido) => {
  const lineas = contenido.split(/\r?\n/);
  let enFrontmatter = lineas[0] === '---';
  let enCodigo = false;
  let cercaCodigo = '';
  let anterior = 0;
  let cambios = 0;

  for (let i = 0; i < lineas.length; i += 1) {
    if (enFrontmatter) {
      if (i > 0 && lineas[i] === '---') enFrontmatter = false;
      continue;
    }

    const cerca = lineas[i].match(/^\s*(`{3,}|~{3,})/);
    if (cerca) {
      const caracter = cerca[1][0];
      if (!enCodigo) {
        enCodigo = true;
        cercaCodigo = caracter;
      } else if (caracter === cercaCodigo) {
        enCodigo = false;
        cercaCodigo = '';
      }
      continue;
    }
    if (enCodigo) continue;

    const coincidencia = lineas[i].match(encabezado);
    if (!coincidencia) continue;
    const nivelActual = coincidencia[2].length;
    const nivelNuevo = anterior === 0 ? Math.min(nivelActual, 2) : Math.min(nivelActual, anterior + 1);
    if (nivelNuevo !== nivelActual) {
      lineas[i] = `${coincidencia[1]}${'#'.repeat(nivelNuevo)}${lineas[i].slice(coincidencia[0].length)}`;
      cambios += 1;
    }
    anterior = nivelNuevo;
  }

  return { contenido: lineas.join('\n'), cambios };
};

let total = 0;
for (const archivo of readdirSync(directorioEmpresas).filter((nombre) => /\.mdx?$/.test(nombre)).sort()) {
  const ruta = join(directorioEmpresas, archivo);
  const original = readFileSync(ruta, 'utf8');
  const resultado = normalizar(original);
  if (resultado.cambios > 0) writeFileSync(ruta, resultado.contenido);
  console.log(`${archivo}: ${resultado.cambios}`);
  total += resultado.cambios;
}
console.log(`Total de encabezados ajustados: ${total}`);
