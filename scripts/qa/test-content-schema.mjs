import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../../src/content.config.ts', import.meta.url), 'utf8');
const directObjects = source.match(/z\s*\.\s*object\s*\(/g) ?? [];
const strictObjects = source.match(/\.strict\(\)/g) ?? [];

assert.equal(
  directObjects.length,
  1,
  `Solo el constructor strictObject puede llamar z.object() directamente (${directObjects.length} llamadas encontradas)`
);
assert.equal(strictObjects.length, 1, 'strictObject debe aplicar .strict() exactamente una vez');
assert.ok(
  (source.match(/strictObject\s*\(/g) ?? []).length > 20,
  'Las colecciones deben construir sus objetos mediante strictObject()'
);

console.log('Esquemas Zod estrictos: todas las estructuras usan strictObject()');
