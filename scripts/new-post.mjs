import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const args = process.argv.slice(2);
const options = new Map();
const titleParts = [];

for (let index = 0; index < args.length; index += 1) {
  const arg = args[index];
  if (arg.startsWith('--')) {
    const [key, inlineValue] = arg.slice(2).split('=', 2);
    const value = inlineValue ?? args[index + 1];
    if (inlineValue === undefined) index += 1;
    options.set(key, value);
  } else {
    titleParts.push(arg);
  }
}

const title = titleParts.join(' ').trim();
if (!title) {
  console.error('Usage: npm run new-post -- "文章标题" [--date YYYY-MM-DD] [--slug custom-slug] [--lang zh]');
  process.exit(1);
}

const site = yaml.load(await fs.readFile(path.join(ROOT, 'content', 'site.yml'), 'utf8')) || {};
const language = options.get('lang') || site.sourceLanguage || 'zh';
const date = options.get('date') || new Date().toISOString().slice(0, 10);

const slug = (options.get('slug') || title)
  .normalize('NFKC')
  .toLowerCase()
  .replace(/[^\p{Letter}\p{Number}]+/gu, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 80);

const directory = path.join(ROOT, 'posts', language);
const filePath = path.join(directory, `${date}-${slug}.md`);

try {
  await fs.access(filePath);
  throw new Error(`File already exists: ${path.relative(ROOT, filePath)}`);
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const content = `---\ntitle: "${title}"\ndate: ${date}\ncategory: "update"\ntags: []\n---\n\n在这里写正文。\n`;
await fs.mkdir(directory, { recursive: true });
await fs.writeFile(filePath, content, 'utf8');
console.log(`Created ${path.relative(ROOT, filePath)}`);
