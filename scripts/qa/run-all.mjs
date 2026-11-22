import { spawnSync } from 'node:child_process';

const checks = [
  ['npm', ['run', 'test:critical-rendering']],
  ['npm', ['run', 'test:accessibility-colors']],
  ['npm', ['run', 'test:trust-accessibility']],
  ['npm', ['run', 'test:qa-entrypoints']],
  ['npm', ['run', 'test:workflow']],
  ['node', ['scripts/qa/test-content-schema.mjs']],
  ['npm', ['run', 'test:html']],
  ['python3', ['scripts/qa/test_audit.py']],
  ['python3', ['scripts/qa/audit.py', '.']],
  ['python3', ['scripts/qa/crawl_dist.py', '.']],
  ['python3', ['scripts/qa/audit_guias.py', '.']],
];

for (const [command, args] of checks) {
  const result = spawnSync(command, args, { stdio: 'inherit' });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log('Suite QA completa: OK');
