import { existsSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const raiz = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const directorioEmpresas = join(raiz, 'src/content/empresas');
const directorioSrc = join(raiz, 'src');
const rutaMapa = '/Users/frankoropeza/tmp-tuseguridad-audit/mapa-fichas.json';
const slugValido = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const leerMapa = () => {
  const mapa = JSON.parse(readFileSync(rutaMapa, 'utf8'));
  if (!mapa || Array.isArray(mapa) || typeof mapa !== 'object') {
    throw new Error('El mapa debe ser un objeto de slug viejo a [slug nuevo, tituloSeo nuevo].');
  }
  for (const [viejo, valor] of Object.entries(mapa)) {
    if (!slugValido.test(viejo) || !Array.isArray(valor) || valor.length !== 2) {
      throw new Error(`Entrada inválida en el mapa: ${viejo}`);
    }
    const [nuevo, titulo] = valor;
    if (!slugValido.test(nuevo) || typeof titulo !== 'string') {
      throw new Error(`Slug o tituloSeo inválido en el mapa: ${viejo}`);
    }
  }
  return mapa;
};

const rutaFicha = (slug) => join(directorioEmpresas, `${slug}.md`);

const actualizarTituloSeo = (archivo, titulo) => {
  const contenido = readFileSync(archivo, 'utf8');
  const linea = `tituloSeo: ${JSON.stringify(titulo)}`;
  if (!/^tituloSeo:.*$/m.test(contenido)) {
    throw new Error(`Falta tituloSeo en ${archivo}`);
  }
  const actualizado = contenido.replace(/^tituloSeo:.*$/m, linea);
  if (actualizado !== contenido) writeFileSync(archivo, actualizado);
  return actualizado !== contenido;
};

const archivosEn = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entrada) => {
    const ruta = join(dir, entrada.name);
    return entrada.isDirectory() ? archivosEn(ruta) : [ruta];
  });

const sustituirReferencias = (mapa) => {
  let archivos = 0;
  let referencias = 0;
  for (const archivo of archivosEn(directorioSrc)) {
    const contenido = readFileSync(archivo, 'utf8');
    let actualizado = contenido;
    for (const [viejo, [nuevo]] of Object.entries(mapa)) {
      const patron = new RegExp(`/${viejo}/`, 'g');
      const coincidencias = actualizado.match(patron)?.length ?? 0;
      if (coincidencias > 0) {
        actualizado = actualizado.replace(patron, `/${nuevo}/`);
        referencias += coincidencias;
      }
    }
    if (actualizado !== contenido) {
      writeFileSync(archivo, actualizado);
      archivos += 1;
    }
  }
  return { archivos, referencias };
};

const mapa = leerMapa();
let renombradas = 0;
let titulosActualizados = 0;
let yaRenombradas = 0;

for (const [viejo, [nuevo, titulo]] of Object.entries(mapa)) {
  const origen = rutaFicha(viejo);
  const destino = rutaFicha(nuevo);
  if (existsSync(origen) && existsSync(destino)) {
    throw new Error(`Colisión de fichas: existen ${viejo}.md y ${nuevo}.md`);
  }
  if (existsSync(origen)) {
    renameSync(origen, destino);
    renombradas += 1;
  } else if (existsSync(destino)) {
    yaRenombradas += 1;
  } else {
    throw new Error(`No existe la ficha ${viejo}.md ni su destino ${nuevo}.md`);
  }
  if (actualizarTituloSeo(destino, titulo)) titulosActualizados += 1;
}

const referencias = sustituirReferencias(mapa);
console.log(`Fichas renombradas: ${renombradas}`);
console.log(`Fichas ya renombradas: ${yaRenombradas}`);
console.log(`tituloSeo actualizados: ${titulosActualizados}`);
console.log(
  `Referencias /slug-viejo/ sustituidas en src/: ${referencias.referencias} (${referencias.archivos} archivos)`
);
