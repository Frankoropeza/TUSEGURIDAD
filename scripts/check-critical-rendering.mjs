import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const layoutPath = fileURLToPath(new URL('../src/layouts/BaseLayout.astro', import.meta.url));
const configPath = fileURLToPath(new URL('../astro.config.mjs', import.meta.url));
const layout = readFileSync(layoutPath, 'utf8');
const config = readFileSync(configPath, 'utf8');
const fontUrl = 'https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@62..125,400..900&family=JetBrains+Mono:wght@400;500&display=swap';
const escapedFontUrl = fontUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const assertions = [
  ['preload de las fuentes', new RegExp(`<link(?=[^>]*\\brel="preload")(?=[^>]*\\bas="style")(?=[^>]*\\bhref="${escapedFontUrl}")[^>]*>`)],
  ['carga no bloqueante de las fuentes', new RegExp(`<link(?=[^>]*\\brel="stylesheet")(?=[^>]*\\bhref="${escapedFontUrl}")(?=[^>]*\\bmedia="print")(?=[^>]*\\bonload="this\\.media='all'")[^>]*>`)],
  ['fallback sin JavaScript', new RegExp(`<noscript>\\s*<link(?=[^>]*\\brel="stylesheet")(?=[^>]*\\bhref="${escapedFontUrl}")[^>]*>\\s*</noscript>`)],
  ['CSS crítico integrado por Astro', /build:\s*\{[\s\S]*?inlineStylesheets:\s*'always'/],
];

const failures = assertions
  .filter(([label, expected]) => !(label === 'CSS crítico integrado por Astro' ? expected.test(config) : expected.test(layout)))
  .map(([label]) => `- Falta ${label}.`);

if (failures.length) {
  console.error(`\nCritical rendering path checks failed:\n${failures.join('\n')}`);
  process.exit(1);
}

console.log('Critical rendering path checks passed.');
