import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';
import OpenCC from 'opencc-js';

const ROOT = process.cwd();
const CHECK_ONLY = process.argv.includes('--check');
const SOURCE = path.join(ROOT, 'content', 'records.yml');
const OUTPUT = path.join(ROOT, 'content', 'generated', 'records.json');
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

const normalize = (value) => `${String(value).replace(/\r\n/g, '\n').trim()}\n`;

function addTraditional(value) {
  if (Array.isArray(value)) return value.map(addTraditional);
  if (!value || typeof value !== 'object') return value;
  const result = Object.fromEntries(Object.entries(value).map(([key, item]) => [key, addTraditional(item)]));
  if (typeof value.zh === 'string' && typeof value.en === 'string' && !value['chinese-traditional']) {
    result['chinese-traditional'] = converter(value.zh);
  }
  return result;
}

const source = yaml.load(await fs.readFile(SOURCE, 'utf8')) || {};
const generated = JSON.stringify({ ...addTraditional(source), generatedBy: 'content/records.yml' }, null, 2);
let current = null;
try { current = await fs.readFile(OUTPUT, 'utf8'); } catch {}
if (normalize(current || '') !== normalize(generated)) {
  if (CHECK_ONLY) {
    console.error('Generated portfolio records are stale: content/generated/records.json');
    process.exit(1);
  }
  await fs.mkdir(path.dirname(OUTPUT), { recursive: true });
  await fs.writeFile(OUTPUT, normalize(generated), 'utf8');
  console.log('wrote content/generated/records.json');
} else {
  console.log(CHECK_ONLY ? 'Portfolio records are up to date.' : 'Portfolio records unchanged.');
}
