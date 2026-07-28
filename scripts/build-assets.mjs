import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const CHECK_ONLY = process.argv.includes('--check');
const LANGUAGES = ['zh', 'chinese-traditional', 'en'];
const CATALOGS = ['projects', 'research', 'knowledge'];
const pending = [];

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function normalize(content) {
  return String(content).replace(/\r\n/g, '\n').replace(/\s*$/, '') + '\n';
}

function requireLocalized(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    throw new Error(`${field} must be a localized object`);
  }
  for (const language of LANGUAGES) {
    if (!String(value[language] ?? '').trim()) {
      throw new Error(`${field}.${language} is required`);
    }
  }
}

function validateUrl(url, field) {
  try {
    const parsed = new URL(String(url));
    if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('unsupported protocol');
  } catch {
    throw new Error(`${field} must be an http(s) URL`);
  }
}

function validateCatalog(name, data) {
  if (data.version !== 1) throw new Error(`content/${name}.yml: version must be 1`);
  if (!data.page || typeof data.page !== 'object') throw new Error(`content/${name}.yml: page is required`);
  requireLocalized(data.page.title, `content/${name}.yml page.title`);
  requireLocalized(data.page.description, `content/${name}.yml page.description`);
  if (!Array.isArray(data.items)) throw new Error(`content/${name}.yml: items must be an array`);

  const ids = new Set();
  for (const [index, item] of data.items.entries()) {
    const prefix = `content/${name}.yml items[${index}]`;
    const id = String(item?.id ?? '').trim();
    if (!id) throw new Error(`${prefix}.id is required`);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new Error(`${prefix}.id must use kebab-case`);
    if (ids.has(id)) throw new Error(`${prefix}.id duplicates ${id}`);
    ids.add(id);

    if (!String(item.category ?? '').trim()) throw new Error(`${prefix}.category is required`);
    requireLocalized(item.title, `${prefix}.title`);
    requireLocalized(item.summary, `${prefix}.summary`);
    if (item.tags !== undefined && !Array.isArray(item.tags)) throw new Error(`${prefix}.tags must be an array`);
    if (item.links !== undefined && !Array.isArray(item.links)) throw new Error(`${prefix}.links must be an array`);

    for (const [linkIndex, link] of (item.links || []).entries()) {
      requireLocalized(link.label, `${prefix}.links[${linkIndex}].label`);
      validateUrl(link.url, `${prefix}.links[${linkIndex}].url`);
    }
  }
}

async function emit(filePath, content) {
  const expected = normalize(content);
  const current = (await exists(filePath)) ? normalize(await fs.readFile(filePath, 'utf8')) : null;
  if (current === expected) return;

  const relative = path.relative(ROOT, filePath);
  if (CHECK_ONLY) {
    pending.push(relative);
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, expected, 'utf8');
  console.log(`wrote ${relative}`);
}

async function main() {
  for (const name of CATALOGS) {
    const source = path.join(ROOT, 'content', `${name}.yml`);
    if (!(await exists(source))) throw new Error(`Missing content/${name}.yml`);
    const data = yaml.load(await fs.readFile(source, 'utf8')) || {};
    validateCatalog(name, data);
    await emit(
      path.join(ROOT, 'content', 'generated', `${name}.json`),
      JSON.stringify({ ...data, generatedBy: `content/${name}.yml` }, null, 2),
    );
  }

  if (CHECK_ONLY && pending.length) {
    console.error('Generated asset catalogs are out of date:');
    for (const file of pending.sort()) console.error(`- ${file}`);
    console.error('Run: npm run build:assets');
    process.exit(1);
  }

  console.log(CHECK_ONLY ? 'Asset catalogs are up to date.' : 'Asset catalogs generated.');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
