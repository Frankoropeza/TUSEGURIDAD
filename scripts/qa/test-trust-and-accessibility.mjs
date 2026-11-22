import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../../${path}`, import.meta.url), 'utf8');

const [
  registrar,
  baseLayout,
  header,
  analitica,
  site,
  headers,
] = await Promise.all([
  read('dist/registrar/index.html'),
  read('src/layouts/BaseLayout.astro'),
  read('src/components/Header.astro'),
  read('src/components/Analitica.astro'),
  read('src/config/site.ts'),
  read('public/_headers'),
]);

assert.doesNotMatch(
  registrar,
  /<form\b/i,
  'No debe renderizarse un formulario cuando no existe endpoint ni correo de recepción'
);
assert.match(baseLayout, /class="skip-link"/, 'Debe existir un enlace para saltar al contenido');
assert.match(baseLayout, /id="contenido-principal"/, 'El contenido principal debe tener un destino accesible');
assert.match(header, /TuSeguridad MX — inicio|\$\{SITE\.name\} MX — inicio/, 'El nombre accesible debe incluir el texto visible del logotipo');
assert.match(header, /aria-current=\{isActive\(item\.href\)/, 'El menú móvil debe indicar la página actual');

assert.match(analitica, /localStorage/, 'La analítica debe depender de una preferencia persistente');
assert.match(analitica, /analytics|clarityId/, 'Los identificadores deben salir de la configuración central');
assert.doesNotMatch(site, /ahrefsKey|ahrefsVerification/, 'No deben quedar claves obsoletas de Ahrefs');
assert.match(site, /clarityId:\s*''/, 'Clarity debe permanecer apagado hasta contar con revisión legal');
assert.match(site, /completo:\s*false/, 'Los documentos legales deben permanecer como borrador hasta su revisión');

assert.match(headers, /^\/\*/m, 'Debe existir una política global de encabezados');
assert.match(headers, /Content-Security-Policy-Report-Only:/, 'Debe existir una CSP en modo de observación');
assert.doesNotMatch(headers, /Strict-Transport-Security:/, 'HSTS requiere validar primero todos los subdominios');
assert.match(headers, /Permissions-Policy:/, 'Debe limitarse el acceso a capacidades del navegador');
assert.match(headers, /X-Frame-Options:\s*DENY/, 'El sitio no debe poder incrustarse en frames');

console.log('Confianza, privacidad, accesibilidad y encabezados: OK');
