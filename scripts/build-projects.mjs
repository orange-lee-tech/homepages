import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const root = process.cwd();
const source = path.join(root, 'content', 'projects.yml');
const output = path.join(root, 'content', 'generated', 'projects.json');

const raw = await fs.readFile(source, 'utf8');
const data = yaml.load(raw) || {};

if (!Array.isArray(data.items)) {
  throw new Error('content/projects.yml: items must be an array');
}

for (const item of data.items) {
  if (!item.id || !item.title || !item.summary) {
    throw new Error(`Invalid project item: ${JSON.stringify(item)}`);
  }
}

await fs.mkdir(path.dirname(output), { recursive: true });
await fs.writeFile(output, JSON.stringify(data, null, 2) + '\n', 'utf8');

console.log(`Generated ${path.relative(root, output)} (${data.items.length} items)`);
