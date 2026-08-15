import { readdir, readFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';

const root = resolve(process.cwd());
const excludedDirectories = new Set(['.git', '.tmp-xlsx', 'dist', 'node_modules', 'playwright-report', 'test-results']);
const textExtensions = new Set(['.css', '.html', '.js', '.json', '.jsx', '.md', '.mjs', '.py', '.txt', '.yml', '.yaml']);
const forbidden = [
  /\b(?:chatgpt|claude|codex)\b/i,
  /\b(?:written|generated|authored|committed|created|made)\s+(?:by|with)\s+(?:an?\s+)?(?:ai|artificial intelligence|cursor|openai)\b/i,
];
const errors = [];

async function visit(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const path = resolve(directory, entry.name);
    if (entry.name === 'verify-provenance.mjs') continue;
    if (entry.isDirectory()) {
      await visit(path);
      continue;
    }
    if (!textExtensions.has(extname(entry.name).toLowerCase())) continue;
    const text = await readFile(path, 'utf8');
    const match = forbidden.find((pattern) => pattern.test(text));
    if (match) errors.push(`${relative(root, path)} matches ${match}`);
  }
}

await visit(root);

if (errors.length) {
  console.error('Provenance check failed:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log('Provenance check passed: no external-tool authorship or commit attribution found.');
}
