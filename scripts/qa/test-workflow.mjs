import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const workflow = await readFile(new URL('../../.github/workflows/deploy.yml', import.meta.url), 'utf8');

assert.match(workflow, /pull_request:/, 'Debe existir validación para pull requests');
assert.doesNotMatch(workflow, /npm ci\s*\|\|\s*npm install/, 'El lockfile debe ser obligatorio');
assert.match(workflow, /run:\s*npm ci/, 'La instalación debe ser reproducible');
assert.doesNotMatch(workflow, /npx\s+-y\s+wrangler/, 'CI no debe descargar Wrangler ad hoc');
assert.doesNotMatch(workflow, /pages project create/, 'La creación del proyecto no pertenece a cada deploy');
assert.match(workflow, /cloudflare\/wrangler-action@[0-9a-f]{40}/, 'Wrangler Action debe fijarse por SHA');
assert.doesNotMatch(workflow, /uses:\s*[^\s]+@v\d+/, 'Todas las Actions deben fijarse por SHA inmutable');
assert.match(workflow, /actions\/checkout@[0-9a-f]{40}/, 'checkout debe fijarse por SHA');
assert.match(workflow, /actions\/setup-node@[0-9a-f]{40}/, 'setup-node debe fijarse por SHA');
assert.match(workflow, /npm run test:qa/, 'CI debe ejecutar la suite QA completa');
assert.match(workflow, /github\.ref == 'refs\/heads\/main'/, 'El deploy debe limitarse explícitamente a main');

console.log('Workflow reproducible y endurecido: OK');
