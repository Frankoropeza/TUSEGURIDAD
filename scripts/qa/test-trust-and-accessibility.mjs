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
  tarjeta,
  categorias,
  footer,
  privacidad,
  terminos,
  contacto,
  portada,
] = await Promise.all([
  read('dist/registrar/index.html'),
  read('src/layouts/BaseLayout.astro'),
  read('src/components/Header.astro'),
  read('src/components/Analitica.astro'),
  read('src/config/site.ts'),
  read('public/_headers'),
  read('src/components/Tarjeta.astro'),
  read('src/pages/categorias/index.astro'),
  read('src/components/Footer.astro'),
  read('src/pages/aviso-de-privacidad.astro'),
  read('src/pages/terminos.astro'),
  read('src/pages/contacto.astro'),
  read('dist/index.html'),
]);

assert.doesNotMatch(
  registrar,
  /<form\b/i,
  'No debe renderizarse un formulario cuando no existe endpoint ni correo de recepción'
);
assert.match(baseLayout, /class="skip-link"/, 'Debe existir un enlace para saltar al contenido');
assert.match(baseLayout, /id="contenido-principal"/, 'El contenido principal debe tener un destino accesible');
assert.doesNotMatch(
  header,
  /<a href="\/"[^>]*aria-label/,
  'El logotipo debe usar su texto visible como nombre accesible, sin texto adicional'
);
assert.match(header, /aria-current=\{isActive\(item\.href\)/, 'El menú móvil debe indicar la página actual');
assert.match(tarjeta, /prioridad=\{prioridad\}/, 'Las tarjetas deben poder priorizar su imagen LCP');
assert.match(categorias, /prioridad=\{i === 0\}/, 'La primera imagen del índice debe cargarse con prioridad');

assert.match(analitica, /localStorage/, 'La analítica debe depender de una preferencia persistente');
assert.match(analitica, /analytics|clarityId/, 'Los identificadores deben salir de la configuración central');
assert.match(analitica, /SITE\.legal\.completo/, 'La analítica requiere revisión legal explícita');
assert.match(analitica, /consent['"],\s*false/, 'Rechazar debe revocar el consentimiento de Clarity');
assert.match(analitica, /analytics_storage:\s*'denied'/, 'Rechazar debe revocar el almacenamiento de GA4');
assert.match(footer, /data-open-analytics-consent/, 'Debe existir un control persistente para reabrir preferencias');
assert.doesNotMatch(site, /ahrefsKey|ahrefsVerification/, 'No deben quedar claves obsoletas de Ahrefs');
assert.match(site, /clarityId:\s*''/, 'Clarity debe permanecer apagado hasta contar con revisión legal');
assert.match(site, /completo:\s*false/, 'Los documentos legales deben permanecer como borrador hasta su revisión');

assert.match(headers, /^\/\*/m, 'Debe existir una política global de encabezados');
assert.match(headers, /Content-Security-Policy-Report-Only:/, 'Debe existir una CSP en modo de observación');
assert.doesNotMatch(
  headers,
  /Content-Security-Policy-Report-Only:[^\n]*upgrade-insecure-requests/,
  'Una CSP Report-Only no debe incluir directivas que el navegador ignora',
);
assert.match(
  headers,
  /^https:\/\/tuseguridad\.mx\/\*\r?\n[ \t]+Strict-Transport-Security:\s*max-age=31536000\s*$/m,
  'Debe existir HSTS únicamente para el dominio principal con un año de duración',
);
for (const line of headers.split(/\r?\n/).filter((value) => /Strict-Transport-Security:/i.test(value))) {
  assert.doesNotMatch(
    line,
    /\b(?:includeSubDomains|preload)\b/i,
    'HSTS no debe incluir subdominios ni preload',
  );
}
assert.match(headers, /Permissions-Policy:/, 'Debe limitarse el acceso a capacidades del navegador');
assert.match(headers, /X-Frame-Options:\s*DENY/, 'El sitio no debe poder incrustarse en frames');
assert.doesNotMatch(privacidad, /Borrador — sin datos del titular/, 'El estado legal no debe contradecir datos configurados');
assert.doesNotMatch(terminos, /Falta la razón social/, 'Términos no debe marcar como ausente una razón social configurada');
assert.match(contacto, /SITE\.formEndpoint/, 'La copia de alta debe depender de que el formulario exista');
assert.doesNotMatch(portada, /fonts\.(?:googleapis|gstatic)\.com/, 'Producción no debe solicitar Google Fonts');
assert.doesNotMatch(portada, /clarity\.ms|googletagmanager\.com/, 'Producción no debe cargar analítica mientras esté desactivada');

console.log('Confianza, privacidad, accesibilidad y encabezados: OK');
