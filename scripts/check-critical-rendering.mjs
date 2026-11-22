import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const layoutPath = fileURLToPath(new URL('../src/layouts/BaseLayout.astro', import.meta.url));
const configPath = fileURLToPath(new URL('../astro.config.mjs', import.meta.url));
const layout = readFileSync(layoutPath, 'utf8');
const config = readFileSync(configPath, 'utf8');

const assertions = [
  ['Archivo autoalojada', /@fontsource-variable\/archivo\/wdth\.css/],
  ['JetBrains Mono autoalojada', /@fontsource-variable\/jetbrains-mono/],
  ['ausencia de Google Fonts', /^(?![\s\S]*fonts\.(?:googleapis|gstatic)\.com)/],
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
