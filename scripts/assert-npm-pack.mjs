#!/usr/bin/env node
/**
 * Fails if the npm tarball would include anything outside the library ship surface.
 * Run via: pnpm pack:check
 */
import { spawnSync } from 'node:child_process';

const result = spawnSync('npm', ['pack', '--dry-run'], {
  encoding: 'utf8',
  env: { ...process.env, npm_config_loglevel: 'notice' },
});

const out = `${result.stdout || ''}\n${result.stderr || ''}`;
if (result.status !== 0) {
  console.error(out);
  process.exit(result.status || 1);
}

const lines = out
  .split('\n')
  .map((l) => l.replace(/^npm notice\s+/, '').trim())
  .filter(Boolean);

const packedFiles = [];
let inContents = false;
for (const line of lines) {
  if (line === 'Tarball Contents') {
    inContents = true;
    continue;
  }
  if (inContents && (line.startsWith('Tarball Details') || line.startsWith('name:'))) break;
  if (!inContents) continue;
  // "46.9kB dist/index.cjs" or "717B CHANGELOG.md"
  const m = line.match(/^\S+\s+(.+)$/);
  if (m) packedFiles.push(m[1]);
}

const allowedExact = new Set([
  'package.json',
  'LICENSE',
  'README.md',
  'README.fa.md',
  'CHANGELOG.md',
  'dist/index.js',
  'dist/index.cjs',
  'dist/index.d.ts',
  'dist/tourara.css',
]);

const forbiddenPatterns = [
  /^showcase(\/|$)/,
  /^showcase-dist(\/|$)/,
  /^src(\/|$)/,
  /^docs(\/|$)/,
  /\.map$/,
  /^scripts(\/|$)/,
];

const unexpected = packedFiles.filter((f) => !allowedExact.has(f));
const forbidden = packedFiles.filter((f) => forbiddenPatterns.some((re) => re.test(f)));

if (!packedFiles.length) {
  console.error('npm pack check FAILED — could not parse tarball contents.\n');
  console.error(out);
  process.exit(1);
}

if (forbidden.length || unexpected.length) {
  console.error('npm pack check FAILED — tarball is not library-only.\n');
  if (forbidden.length) {
    console.error('Forbidden paths:\n' + forbidden.map((f) => `  - ${f}`).join('\n'));
  }
  if (unexpected.length) {
    console.error('Unexpected paths (not in allowlist):\n' + unexpected.map((f) => `  - ${f}`).join('\n'));
  }
  console.error('\nPacked files:\n' + packedFiles.map((f) => `  - ${f}`).join('\n'));
  process.exit(1);
}

const required = [...allowedExact].filter((f) => f !== 'package.json');
const absent = required.filter((f) => !packedFiles.includes(f));
if (absent.length) {
  console.error(
    'npm pack check FAILED — required ship files missing:\n' + absent.map((f) => `  - ${f}`).join('\n'),
  );
  process.exit(1);
}

console.log('npm pack check OK — library-only tarball (' + packedFiles.length + ' files):');
for (const f of packedFiles) console.log('  • ' + f);
