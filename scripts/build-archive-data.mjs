import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const checkOnly = process.argv.includes('--check');
const targets = [
  ['content/homepage.yml', 'content/generated/homepage.json'],
  ['content/capabilities.yml', 'content/generated/capabilities.json'],
];

const normalize = (value) => `${String(value).replace(/\r\n/g, '\n').trim()}\n`;

for (const [source, output] of targets) {
  const input = await fs.readFile(path.join(root, source), 'utf8');
  const data = yaml.load(input) || {};
  const generated = JSON.stringify({ ...data, generatedBy: source }, null, 2);
  const target = path.join(root, output);
  let current = null;
  try {
    current = await fs.readFile(target, 'utf8');
  } catch {}

  if (normalize(current || '') === normalize(generated)) continue;
  if (checkOnly) {
    console.error(`Generated output is stale: ${output}`);
    process.exitCode = 1;
    continue;
  }

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, normalize(generated), 'utf8');
  console.log(`wrote ${output}`);
}
