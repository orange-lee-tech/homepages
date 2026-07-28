import fs from 'node:fs/promises';
import path from 'node:path';

const title = process.argv.slice(2).join(' ') || 'New Post';
const date = new Date().toISOString().slice(0, 10);
const filename = `${date}-${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.md`;
const file = path.join('posts', 'zh', filename);

const content = `---\ntitle: "${title}"\ndate: ${date}\n---\n\nWrite your content here.\n`;

await fs.writeFile(file, content, 'utf8');
console.log(`Created ${file}`);
