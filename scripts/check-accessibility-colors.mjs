import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../', import.meta.url);
const config = readFileSync(fileURLToPath(new URL('tailwind.config.mjs', root)), 'utf8');
const styles = readFileSync(fileURLToPath(new URL('src/styles/global.css', root)), 'utf8');

const color = (source, name) => {
  const match = source.match(new RegExp(`${name}:\\s*'(#[0-9A-Fa-f]{6})'`));
  if (!match) throw new Error(`No se encontró el color ${name}.`);
  return match[1];
};

const luminance = (hex) => {
  const [red, green, blue] = hex.match(/[0-9a-f]{2}/gi).map((part) => Number.parseInt(part, 16) / 255);
  const linear = (value) => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  return 0.2126 * linear(red) + 0.7152 * linear(green) + 0.0722 * linear(blue);
};

const contrast = (first, second) => {
  const [light, dark] = [luminance(first), luminance(second)].sort((a, b) => b - a);
  return (light + 0.05) / (dark + 0.05);
};

const paper = color(config, 'paper');
const ink = color(config, 'ink');
const signal = color(config, 'signal');
const onInkSignal = styles.match(/\.on-ink \.text-signal\s*\{\s*color:\s*(#[0-9A-Fa-f]{6})/s)?.[1];
const failures = [];

if (contrast(signal, paper) < 4.5) failures.push(`signal sobre paper solo alcanza ${contrast(signal, paper).toFixed(2)}:1.`);
if (!onInkSignal) failures.push('Falta un color signal específico para fondos ink.');
else if (contrast(onInkSignal, ink) < 4.5) failures.push(`signal sobre ink solo alcanza ${contrast(onInkSignal, ink).toFixed(2)}:1.`);

if (failures.length) {
  console.error(`\nAccessibility color checks failed:\n${failures.map((failure) => `- ${failure}`).join('\n')}`);
  process.exit(1);
}

console.log('Accessibility color checks passed.');
