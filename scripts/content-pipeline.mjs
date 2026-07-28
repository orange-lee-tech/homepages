import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';
import matter from 'gray-matter';
import OpenCC from 'opencc-js';

const ROOT = process.cwd();
const CHECK_ONLY = process.argv.includes('--check');
const SITE_FILE = path.join(ROOT, 'content', 'site.yml');
const GENERATED_DIR = path.join(ROOT, 'content', 'generated');
const IMAGE_EXTENSIONS = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.svg', '.webp']);
const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });
const pending = [];

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

async function readYaml(filePath) {
  return yaml.load(await readText(filePath)) || {};
}

function normalizeText(text) {
  return String(text).replace(/\r\n/g, '\n').replace(/\s*$/, '') + '\n';
}

async function emit(filePath, content) {
  const expected = normalizeText(content);
  const current = (await exists(filePath)) ? normalizeText(await readText(filePath)) : null;
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

async function removeUnexpectedFiles(directory, expectedNames) {
  if (!(await exists(directory))) return;
  const entries = await fs.readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md') || expectedNames.has(entry.name)) continue;
    const filePath = path.join(directory, entry.name);
    if (CHECK_ONLY) {
      pending.push(path.relative(ROOT, filePath));
    } else {
      await fs.unlink(filePath);
      console.log(`removed ${path.relative(ROOT, filePath)}`);
    }
  }
}

function toTraditional(value) {
  if (typeof value === 'string') return converter(value);
  if (Array.isArray(value)) return value.map(toTraditional);
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, toTraditional(item)]));
  }
  return value;
}

function formatDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString().slice(0, 10);
  const text = String(value ?? '').trim();
  const match = text.match(/^\d{4}-\d{2}-\d{2}$/);
  return match ? match[0] : text;
}

function normalizePost(post) {
  return {
    title: String(post.title).trim(),
    date: formatDate(post.date),
    file: String(post.file).trim(),
  };
}

function sortPosts(posts) {
  return posts.map(normalizePost).sort((a, b) => {
    const byDate = b.date.localeCompare(a.date);
    return byDate || a.file.localeCompare(b.file, 'zh-Hans-CN', { numeric: true });
  });
}

async function collectPosts(language) {
  const directory = path.join(ROOT, 'posts', language);
  if (!(await exists(directory))) return [];
  const files = (await fs.readdir(directory)).filter((file) => file.endsWith('.md')).sort();
  const posts = [];

  for (const file of files) {
    const parsed = matter(await readText(path.join(directory, file)));
    if (!parsed.data.title || !parsed.data.date) {
      throw new Error(`Missing title/date in posts/${language}/${file}`);
    }
    posts.push({ title: parsed.data.title, date: parsed.data.date, file });
  }

  return sortPosts(posts);
}

async function syncTraditionalSections(site) {
  const expected = new Set();
  for (const section of site.sections || []) {
    const source = path.join(ROOT, 'contents', site.sourceLanguage, `${section}.md`);
    if (!(await exists(source))) throw new Error(`Missing source section: ${path.relative(ROOT, source)}`);
    const target = path.join(ROOT, 'contents', 'chinese-traditional', `${section}.md`);
    expected.add(`${section}.md`);
    await emit(target, converter(await readText(source)));
  }
  await removeUnexpectedFiles(path.join(ROOT, 'contents', 'chinese-traditional'), expected);
}

async function syncTraditionalPosts(site) {
  const sourceDir = path.join(ROOT, 'posts', site.sourceLanguage);
  const targetDir = path.join(ROOT, 'posts', 'chinese-traditional');
  const files = (await fs.readdir(sourceDir)).filter((file) => file.endsWith('.md')).sort();
  const expected = new Set(files);
  const posts = [];

  for (const file of files) {
    const parsed = matter(await readText(path.join(sourceDir, file)));
    if (!parsed.data.title || !parsed.data.date) {
      throw new Error(`Missing title/date in posts/${site.sourceLanguage}/${file}`);
    }
    const data = toTraditional(parsed.data);
    const body = converter(parsed.content || '');
    await emit(path.join(targetDir, file), matter.stringify(body, data));
    posts.push({ title: data.title, date: data.date, file });
  }

  await removeUnexpectedFiles(targetDir, expected);
  return sortPosts(posts);
}

async function collectGalleries(site) {
  const result = {};
  for (const [name, gallery] of Object.entries(site.galleries || {})) {
    const directory = path.join(ROOT, gallery.directory);
    if (!(await exists(directory))) throw new Error(`Missing gallery directory: ${gallery.directory}`);
    const files = (await fs.readdir(directory, { withFileTypes: true }))
      .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, 'zh-Hans-CN', { numeric: true }));
    result[name] = { configKey: gallery.configKey, directory: gallery.directory, files };
  }
  return result;
}

function applyManagedCollections(config, posts, galleries) {
  const next = { ...config };
  for (const gallery of Object.values(galleries)) next[gallery.configKey] = gallery.files;
  next.posts = posts;
  return next;
}

function stabilizeTraditionalConfig(config) {
  const next = toTraditional(config);
  next['nav-lang-zh'] = '中文';
  next['nav-lang-en'] = 'English';
  next['nav-lang-cht'] = '繁體中文';
  next['nav-gallery-show'] = 'Show';
  next['nav-gallery-person'] = 'Person';
  next['show-subtitle'] = '<i class="bi bi-stars"></i>&nbsp;Show';
  next['person-subtitle'] = '<i class="bi bi-camera"></i>&nbsp;Person';
  return next;
}

function dumpYaml(data) {
  return yaml.dump(data, { lineWidth: 120, noRefs: true, sortKeys: false, quotingType: '"' });
}

async function main() {
  if (!(await exists(SITE_FILE))) throw new Error('Missing content/site.yml');
  const site = await readYaml(SITE_FILE);
  const languages = site.languages || [];
  if (!languages.includes(site.sourceLanguage)) throw new Error('sourceLanguage must be listed in languages');

  await syncTraditionalSections(site);
  const traditionalPosts = await syncTraditionalPosts(site);
  const galleries = await collectGalleries(site);
  const postsByLanguage = {};

  for (const language of languages) {
    postsByLanguage[language] = language === 'chinese-traditional'
      ? traditionalPosts
      : await collectPosts(language);
  }

  const zhConfigPath = path.join(ROOT, 'contents', `config.${site.sourceLanguage}.yml`);
  const sourceConfig = await readYaml(zhConfigPath);

  for (const language of languages) {
    const configPath = path.join(ROOT, 'contents', `config.${language}.yml`);
    let config;
    if (language === 'chinese-traditional') {
      config = stabilizeTraditionalConfig(sourceConfig);
    } else {
      config = await readYaml(configPath);
    }
    config = applyManagedCollections(config, postsByLanguage[language], galleries);
    await emit(configPath, dumpYaml(config));
  }

  const manifest = {
    version: 1,
    sourceLanguage: site.sourceLanguage,
    languages,
    sections: site.sections || [],
    galleries,
    posts: postsByLanguage,
  };
  await emit(path.join(GENERATED_DIR, 'content-index.json'), JSON.stringify(manifest, null, 2));

  if (CHECK_ONLY && pending.length) {
    console.error('Generated content is out of date:');
    for (const file of [...new Set(pending)].sort()) console.error(`- ${file}`);
    console.error('Run: npm run build');
    process.exit(1);
  }

  console.log(CHECK_ONLY ? 'Generated content is up to date.' : 'Content build completed.');
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
