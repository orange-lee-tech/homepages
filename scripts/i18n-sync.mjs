import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import OpenCC from 'opencc-js';

const ROOT = process.cwd();
const CONTENTS_DIR = path.join(ROOT, 'contents');
const POSTS_DIR = path.join(ROOT, 'posts');

const args = new Set(process.argv.slice(2));
const DRY_RUN = args.has('--dry-run');

const mdSections = [
  'home',
  'about',
  'interests',
  'publications',
  'experience',
  'practice',
  'awards',
];

const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

async function exists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function readText(filePath) {
  return fs.readFile(filePath, 'utf8');
}

async function writeText(filePath, content) {
  if (DRY_RUN) {
    console.log(`[dry-run] write ${path.relative(ROOT, filePath)}`);
    return;
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, 'utf8');
  console.log(`wrote ${path.relative(ROOT, filePath)}`);
}

async function loadYaml(filePath, fallback = {}) {
  if (!(await exists(filePath))) return fallback;

  const text = await readText(filePath);
  return yaml.load(text) || fallback;
}

function toTraditionalText(text) {
  return converter(text);
}

function toTraditionalValue(value) {
  if (typeof value === 'string') {
    return toTraditionalText(value);
  }

  if (Array.isArray(value)) {
    return value.map(toTraditionalValue);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [key, toTraditionalValue(val)])
    );
  }

  return value;
}

function buildTraditionalConfig(zhConfig) {
  const cfg = toTraditionalValue(zhConfig);

  // These labels should stay stable and not be over-converted.
  cfg['nav-lang-zh'] = '中文';
  cfg['nav-lang-en'] = 'English';
  cfg['nav-lang-cht'] = '繁體中文';

  cfg['nav-gallery-show'] = 'Show';
  cfg['nav-gallery-person'] = 'Person';
  cfg['show-subtitle'] = '<i class="bi bi-stars"></i>&nbsp;Show';
  cfg['person-subtitle'] = '<i class="bi bi-camera"></i>&nbsp;Person';

  return cfg;
}

function dumpYaml(data) {
  return yaml.dump(data, {
    lineWidth: 120,
    noRefs: true,
    sortKeys: false,
  });
}

async function syncMarkdownSections() {
  for (const name of mdSections) {
    const source = path.join(CONTENTS_DIR, 'zh', `${name}.md`);

    if (!(await exists(source))) {
      console.warn(`skip missing file: ${path.relative(ROOT, source)}`);
      continue;
    }

    const zh = await readText(source);
    const target = path.join(CONTENTS_DIR, 'chinese-traditional', `${name}.md`);

    await writeText(target, toTraditionalText(zh));
  }
}

function normalizePostFile(file) {
  return String(file || '')
    .replace(/^posts\//, '')
    .replace(/^zh\//, '')
    .replace(/^chinese-traditional\//, '');
}

async function syncPosts() {
  const sourceDir = path.join(POSTS_DIR, 'zh');

  if (!(await exists(sourceDir))) {
    console.warn('posts/zh not found; skipped posts sync.');
    return;
  }

  const files = (await fs.readdir(sourceDir)).filter(file => file.endsWith('.md'));

  for (const file of files) {
    const source = path.join(sourceDir, file);
    const raw = await readText(source);
    const parsed = matter(raw);

    const traditionalData = toTraditionalValue(parsed.data || {});
    const traditionalBody = toTraditionalText(parsed.content || '');
    const output = matter.stringify(traditionalBody, traditionalData);

    const target = path.join(
      POSTS_DIR,
      'chinese-traditional',
      normalizePostFile(file)
    );

    await writeText(target, output);
  }
}

async function syncConfig() {
  const source = path.join(CONTENTS_DIR, 'config.zh.yml');
  const zhConfig = await loadYaml(source, {});

  if (!Object.keys(zhConfig).length) {
    console.warn('contents/config.zh.yml not found or empty; skipped config sync.');
    return;
  }

  const traditionalConfig = buildTraditionalConfig(zhConfig);
  const target = path.join(CONTENTS_DIR, 'config.chinese-traditional.yml');

  await writeText(target, dumpYaml(traditionalConfig));
}

async function main() {
  await syncMarkdownSections();
  await syncPosts();
  await syncConfig();

  console.log('Traditional Chinese sync completed. English files were not touched.');
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
