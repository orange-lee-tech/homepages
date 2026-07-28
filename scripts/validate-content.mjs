import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';
import matter from 'gray-matter';

const ROOT = process.cwd();
const SITE_FILE = path.join(ROOT, 'content', 'site.yml');
const MANIFEST_FILE = path.join(ROOT, 'content', 'generated', 'content-index.json');
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const errors = [];
const warnings = [];

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
  try {
    return yaml.load(await readText(filePath)) || {};
  } catch (error) {
    errors.push(`${path.relative(ROOT, filePath)}: invalid YAML (${error.message})`);
    return {};
  }
}

function isValidDate(value) {
  const text = value instanceof Date && !Number.isNaN(value.getTime())
    ? value.toISOString().slice(0, 10)
    : String(value ?? '').trim();
  if (!DATE_PATTERN.test(text)) return false;
  const date = new Date(`${text}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === text;
}

function cleanLinkTarget(rawTarget) {
  let target = String(rawTarget || '').trim();
  if (target.startsWith('<') && target.endsWith('>')) target = target.slice(1, -1);
  target = target.split(/\s+["']/)[0];
  target = target.split('#')[0].split('?')[0];
  try {
    return decodeURIComponent(target);
  } catch {
    return target;
  }
}

function shouldValidateLocalLink(target) {
  if (!target) return false;
  if (/^(?:[a-z]+:|\/\/|#)/i.test(target)) return false;
  if (/^(?:mailto|tel|javascript):/i.test(target)) return false;
  return true;
}

async function validateLocalLinks(filePath, markdown) {
  const pattern = /!?\[[^\]]*\]\(([^)]+)\)/g;
  for (const match of markdown.matchAll(pattern)) {
    const target = cleanLinkTarget(match[1]);
    if (!shouldValidateLocalLink(target)) continue;
    const resolved = path.resolve(path.dirname(filePath), target);
    if (!resolved.startsWith(ROOT + path.sep) && resolved !== ROOT) {
      errors.push(`${path.relative(ROOT, filePath)}: link escapes repository (${target})`);
      continue;
    }
    if (!(await exists(resolved))) {
      errors.push(`${path.relative(ROOT, filePath)}: missing local target (${target})`);
    }
  }
}

async function validateSectionFiles(site) {
  const sourceLanguage = site.sourceLanguage;
  const sections = Array.isArray(site.sections) ? site.sections : [];
  if (!sections.length) errors.push('content/site.yml: sections must not be empty');

  for (const section of sections) {
    const source = path.join(ROOT, 'contents', sourceLanguage, `${section}.md`);
    if (!(await exists(source))) {
      errors.push(`Missing source section: contents/${sourceLanguage}/${section}.md`);
      continue;
    }
    await validateLocalLinks(source, await readText(source));
  }
}

async function validatePosts(language) {
  const directory = path.join(ROOT, 'posts', language);
  if (!(await exists(directory))) {
    errors.push(`Missing posts directory: posts/${language}`);
    return [];
  }

  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.md')).map((entry) => entry.name).sort();
  const posts = [];
  const seenTitles = new Map();

  for (const file of files) {
    const filePath = path.join(directory, file);
    const raw = await readText(filePath);
    let parsed;
    try {
      parsed = matter(raw);
    } catch (error) {
      errors.push(`posts/${language}/${file}: invalid front matter (${error.message})`);
      continue;
    }

    const title = String(parsed.data.title ?? '').trim();
    if (!title) errors.push(`posts/${language}/${file}: missing title`);
    if (!isValidDate(parsed.data.date)) errors.push(`posts/${language}/${file}: date must be YYYY-MM-DD`);
    if (!String(parsed.content || '').trim()) warnings.push(`posts/${language}/${file}: empty article body`);

    if (title) {
      if (seenTitles.has(title)) {
        warnings.push(`posts/${language}/${file}: duplicate title also used by ${seenTitles.get(title)}`);
      } else {
        seenTitles.set(title, file);
      }
    }

    await validateLocalLinks(filePath, parsed.content || '');
    posts.push(file);
  }

  return posts;
}

async function validateGalleries(site) {
  for (const [name, gallery] of Object.entries(site.galleries || {})) {
    if (!gallery?.directory || !gallery?.configKey) {
      errors.push(`content/site.yml: gallery ${name} requires directory and configKey`);
      continue;
    }
    const directory = path.join(ROOT, gallery.directory);
    if (!(await exists(directory))) {
      errors.push(`Missing gallery directory: ${gallery.directory}`);
      continue;
    }
    const entries = await fs.readdir(directory, { withFileTypes: true });
    if (!entries.some((entry) => entry.isFile())) warnings.push(`Gallery is empty: ${gallery.directory}`);
  }
}

async function validateConfigs(site) {
  for (const language of site.languages || []) {
    const filePath = path.join(ROOT, 'contents', `config.${language}.yml`);
    if (!(await exists(filePath))) {
      errors.push(`Missing config: contents/config.${language}.yml`);
      continue;
    }
    const config = await readYaml(filePath);
    for (const key of ['title', 'page-top-title', 'posts']) {
      if (config[key] === undefined) errors.push(`contents/config.${language}.yml: missing ${key}`);
    }
    if (config.posts !== undefined && !Array.isArray(config.posts)) {
      errors.push(`contents/config.${language}.yml: posts must be an array`);
    }
  }
}

async function validateManifest(site, postsByLanguage) {
  if (!(await exists(MANIFEST_FILE))) {
    errors.push('Missing content/generated/content-index.json; run npm run build');
    return;
  }

  let manifest;
  try {
    manifest = JSON.parse(await readText(MANIFEST_FILE));
  } catch (error) {
    errors.push(`content/generated/content-index.json: invalid JSON (${error.message})`);
    return;
  }

  if (manifest.version !== 1) errors.push('content-index.json: unsupported version');
  if (manifest.sourceLanguage !== site.sourceLanguage) errors.push('content-index.json: sourceLanguage mismatch');

  for (const language of site.languages || []) {
    const indexed = Array.isArray(manifest.posts?.[language]) ? manifest.posts[language] : [];
    const indexedFiles = new Set(indexed.map((post) => post.file));
    for (const file of postsByLanguage[language] || []) {
      if (!indexedFiles.has(file)) errors.push(`content-index.json: missing posts/${language}/${file}`);
    }
    for (const post of indexed) {
      const target = path.join(ROOT, 'posts', language, String(post.file || ''));
      if (!(await exists(target))) errors.push(`content-index.json: missing referenced file posts/${language}/${post.file}`);
      if (!post.title || !isValidDate(post.date)) errors.push(`content-index.json: invalid post metadata for ${language}/${post.file}`);
    }
  }
}

async function main() {
  if (!(await exists(SITE_FILE))) {
    console.error('Missing content/site.yml');
    process.exit(1);
  }

  const site = await readYaml(SITE_FILE);
  const languages = Array.isArray(site.languages) ? site.languages : [];
  if (!site.sourceLanguage) errors.push('content/site.yml: sourceLanguage is required');
  if (!languages.length) errors.push('content/site.yml: languages must not be empty');
  if (site.sourceLanguage && !languages.includes(site.sourceLanguage)) {
    errors.push('content/site.yml: sourceLanguage must be listed in languages');
  }

  await validateSectionFiles(site);
  await validateGalleries(site);
  await validateConfigs(site);

  const postsByLanguage = {};
  for (const language of languages) postsByLanguage[language] = await validatePosts(language);
  await validateManifest(site, postsByLanguage);

  for (const warning of warnings) console.warn(`warning: ${warning}`);
  if (errors.length) {
    console.error(`Content validation failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log(`Content validation passed (${languages.length} languages, ${Object.values(postsByLanguage).flat().length} posts).`);
}

main().catch((error) => {
  console.error(error.stack || error.message);
  process.exit(1);
});
