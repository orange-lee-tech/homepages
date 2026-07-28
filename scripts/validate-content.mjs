import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

const root = process.cwd();
const posts = path.join(root, 'posts', 'zh');

let errors = 0;

try {
  const files = await fs.readdir(posts);
  for (const file of files.filter(f => f.endsWith('.md'))) {
    const raw = await fs.readFile(path.join(posts, file), 'utf8');
    const parsed = matter(raw);
    if (!parsed.data.title || !parsed.data.date) {
      console.error(`Missing metadata: ${file}`);
      errors++;
    }
  }
} catch (err) {
  console.error('Cannot scan posts:', err.message);
  errors++;
}

if (errors) process.exit(1);
console.log('Content validation passed.');
