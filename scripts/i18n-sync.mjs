import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import process from 'node:process';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import OpenCC from 'opencc-js';
import 'dotenv/config';

const ROOT = process.cwd();
const CONTENTS_DIR = path.join(ROOT, 'contents');
const POSTS_DIR = path.join(ROOT, 'posts');
const I18N_DIR = path.join(ROOT, 'i18n');
const CACHE_FILE = path.join(I18N_DIR, 'cache.json');
const GLOSSARY_FILE = path.join(I18N_DIR, 'glossary.yml');

const args = new Set(process.argv.slice(2));
const TRADITIONAL_ONLY = args.has('--traditional-only');
const DRY_RUN = args.has('--dry-run');

const mdSections = ['home', 'about', 'interests', 'publications', 'experience', 'practice', 'awards'];
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

function sha256(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

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

async function loadCache() {
  if (!(await exists(CACHE_FILE))) return { version: 1, items: {} };
  try {
    return JSON.parse(await readText(CACHE_FILE));
  } catch {
    return { version: 1, items: {} };
  }
}

async function saveCache(cache) {
  await writeText(CACHE_FILE, JSON.stringify(cache, null, 2) + '\n');
}

function toTraditionalText(text) {
  return converter(text);
}

function toTraditionalYamlValue(value) {
  if (typeof value === 'string') return toTraditionalText(value);
  if (Array.isArray(value)) return value.map(toTraditionalYamlValue);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, toTraditionalYamlValue(v)]));
  }
  return value;
}

function buildTraditionalConfig(zhConfig) {
  const cfg = toTraditionalYamlValue(zhConfig);
  cfg['nav-lang-zh'] = '中文';
  cfg['nav-lang-en'] = 'English';
  cfg['nav-lang-cht'] = '繁體中文';
  cfg['nav-gallery-show'] = 'Show';
  cfg['nav-gallery-person'] = 'Person';
  cfg['show-subtitle'] = '<i class="bi bi-stars"></i>&nbsp;Show';
  cfg['person-subtitle'] = '<i class="bi bi-camera"></i>&nbsp;Person';
  return cfg;
}

function buildEnglishConfig(zhConfig) {
  // Conservative config generation. Long content translation is handled in Markdown/posts.
  const cfg = structuredClone(zhConfig);
  cfg['page-top-title'] = 'Li Yucheng';
  cfg['home-subtitle'] = '<i class="bi bi-house-fill"></i>&nbsp;Home';
  cfg['awards-subtitle'] = '<i class="bi bi-award-fill"></i>&nbsp;Awards';
  cfg['experience-subtitle'] = '<i class="bi bi-briefcase-fill"></i>&nbsp;Experience';
  cfg['publications-subtitle'] = '<i class="bi bi-file-text-fill"></i>&nbsp;Research & Competitions';
  cfg['show-subtitle'] = '<i class="bi bi-stars"></i>&nbsp;Show';
  cfg['design-subtitle'] = '<i class="bi bi-palette"></i>&nbsp;Graphic Design';
  cfg['person-subtitle'] = '<i class="bi bi-camera"></i>&nbsp;Person';
  cfg['about-subtitle'] = '<i class="bi bi-person-badge"></i>&nbsp;About';
  cfg['interests-subtitle'] = '<i class="bi bi-compass"></i>&nbsp;Interests';
  cfg['copyright-text'] = '&copy; Li Yucheng 2023-2026. All Rights Reserved.';
  cfg['nav-home'] = 'Home';
  cfg['nav-home-top'] = 'Top';
  cfg['nav-home-now'] = 'Now';
  cfg['nav-home-about'] = 'About';
  cfg['nav-home-interests'] = 'Interests';
  cfg['nav-publications'] = 'Research';
  cfg['nav-experience'] = 'Experience';
  cfg['nav-practice'] = 'Social Practice';
  cfg['nav-awards'] = 'Awards';
  cfg['nav-awards-hs'] = 'High School Brief';
  cfg['nav-awards-ug'] = 'Undergraduate Brief';
  cfg['nav-posts'] = 'Updates';
  cfg['nav-gallery'] = 'Gallery';
  cfg['nav-gallery-show'] = 'Show';
  cfg['nav-gallery-design'] = 'Graphic Design';
  cfg['nav-gallery-person'] = 'Person';
  cfg['nav-lang'] = 'Language';
  cfg['nav-lang-zh'] = '中文';
  cfg['nav-lang-en'] = 'English';
  cfg['nav-lang-cht'] = '繁體中文';
  return cfg;
}

function dumpYaml(data) {
  return yaml.dump(data, { lineWidth: 120, noRefs: true, sortKeys: false });
}

function applyGlossaryHints(text, glossary) {
  // This does not translate. It appends deterministic glossary guidance for future AI translation.
  const flat = [];
  for (const group of Object.values(glossary || {})) {
    if (group && typeof group === 'object') {
      for (const [source, target] of Object.entries(group)) flat.push(`${source} => ${target}`);
    }
  }
  return { text, glossaryHints: flat };
}

async function translateToEnglish(text, cacheKey, cache, glossary) {
  const hash = sha256(text);
  const cached = cache.items?.[cacheKey];
  if (cached?.sourceHash === hash && cached?.en) return cached.en;

  // Placeholder by design: no API call is made unless explicitly implemented later.
  // This keeps the first tooling version safe and usable without API keys.
  const { glossaryHints } = applyGlossaryHints(text, glossary);
  const note = [
    '<!-- TODO: AI English translation pending.',
    'Source hash: ' + hash,
    glossaryHints.length ? 'Glossary hints: ' + glossaryHints.join('; ') : '',
    '-->'
  ].filter(Boolean).join('\n');

  const output = `${note}\n\n${text}`;
  cache.items[cacheKey] = { sourceHash: hash, en: output, updatedAt: new Date().toISOString() };
  return output;
}

async function syncMarkdownSections({ cache, glossary }) {
  for (const name of mdSections) {
    const zhPath = path.join(CONTENTS_DIR, 'zh', `${name}.md`);
    if (!(await exists(zhPath))) continue;

    const zh = await readText(zhPath);
    await writeText(path.join(CONTENTS_DIR, 'chinese-traditional', `${name}.md`), toTraditionalText(zh));

    if (!TRADITIONAL_ONLY) {
      const en = await translateToEnglish(zh, `contents/zh/${name}.md`, cache, glossary);
      await writeText(path.join(CONTENTS_DIR, 'en', `${name}.md`), en);
    }
  }
}

function normalizePostFilename(file) {
  const base = String(file || '').replace(/^posts\//, '').replace(/^zh\//, '');
  return base;
}

async function syncPosts({ cache, glossary }) {
  const zhPostsDir = path.join(POSTS_DIR, 'zh');
  if (!(await exists(zhPostsDir))) return;
  const files = (await fs.readdir(zhPostsDir)).filter(f => f.endsWith('.md'));

  for (const file of files) {
    const zhPath = path.join(zhPostsDir, file);
    const zh = await readText(zhPath);
    const parsed = matter(zh);

    const traditionalData = toTraditionalYamlValue(parsed.data || {});
    const traditionalBody = toTraditionalText(parsed.content || '');
    const traditional = matter.stringify(traditionalBody, traditionalData);
    await writeText(path.join(POSTS_DIR, 'chinese-traditional', normalizePostFilename(file)), traditional);

    if (!TRADITIONAL_ONLY) {
      const enBody = await translateToEnglish(parsed.content || '', `posts/zh/${file}`, cache, glossary);
      const enData = { ...(parsed.data || {}) };
      if (typeof enData.title === 'string') {
        enData.title = await translateToEnglish(enData.title, `posts/zh/${file}#title`, cache, glossary);
        enData.title = enData.title.replace(/<!--[^]*?-->\s*/g, '').trim();
      }
      const en = matter.stringify(enBody, enData);
      await writeText(path.join(POSTS_DIR, 'en', normalizePostFilename(file)), en);
    }
  }
}

async function syncConfigs() {
  const zhConfigPath = path.join(CONTENTS_DIR, 'config.zh.yml');
  const zhConfig = await loadYaml(zhConfigPath, {});
  if (!Object.keys(zhConfig).length) {
    console.warn('config.zh.yml not found or empty; skipped config sync.');
    return;
  }

  const traditional = buildTraditionalConfig(zhConfig);
  await writeText(path.join(CONTENTS_DIR, 'config.chinese-traditional.yml'), dumpYaml(traditional));

  if (!TRADITIONAL_ONLY) {
    const english = buildEnglishConfig(zhConfig);
    await writeText(path.join(CONTENTS_DIR, 'config.en.yml'), dumpYaml(english));
  }
}

async function main() {
  const glossary = await loadYaml(GLOSSARY_FILE, {});
  const cache = await loadCache();

  await syncMarkdownSections({ cache, glossary });
  await syncPosts({ cache, glossary });
  await syncConfigs();
  await saveCache(cache);

  console.log('i18n sync completed.');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
