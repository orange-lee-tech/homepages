import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import yaml from 'js-yaml';

const ROOT = process.cwd();
const SOURCE = path.join(ROOT, 'content', 'records.yml');
const PAGE_VALUES = new Set(['projects', 'learning', 'capabilities']);
const SIZE_VALUES = new Set(['compact', 'standard', 'extended']);
const TYPE_VALUES = new Set(['progress', 'milestone']);
const KIND_VALUES = new Set(['engineering', 'modeling', 'research', 'education', 'practice', 'service', 'honor', 'credential', 'software']);
const DATE_PATTERN = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/;
const errors = [];

const data = yaml.load(await fs.readFile(SOURCE, 'utf8')) || {};
if (data.version !== 1) errors.push('content/records.yml: version must be 1');
if (!Array.isArray(data.items)) errors.push('content/records.yml: items must be an array');
const ids = new Set();
for (const [index, item] of (data.items || []).entries()) {
  const prefix = `content/records.yml items[${index}]`;
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(item.id || ''))) errors.push(`${prefix}.id must use kebab-case`);
  if (ids.has(item.id)) errors.push(`${prefix}.id duplicates ${item.id}`); else ids.add(item.id);
  for (const field of ['title', 'role', 'summary']) {
    if (!item[field] || typeof item[field] !== 'object' || !String(item[field].zh || '').trim() || !String(item[field].en || '').trim()) {
      errors.push(`${prefix}.${field} requires zh and en`);
    }
  }
  if (!DATE_PATTERN.test(String(item.timelineDate || ''))) errors.push(`${prefix}.timelineDate must be YYYY, YYYY-MM, or YYYY-MM-DD`);
  if (!KIND_VALUES.has(item.kind)) errors.push(`${prefix}.kind is invalid`);
  if (!SIZE_VALUES.has(item.size)) errors.push(`${prefix}.size is invalid`);
  if (!TYPE_VALUES.has(item.timelineType)) errors.push(`${prefix}.timelineType is invalid`);
  if (!Array.isArray(item.pages) || item.pages.some((page) => !PAGE_VALUES.has(page))) errors.push(`${prefix}.pages contains an invalid page`);
  if (!String(item.target || '').trim()) errors.push(`${prefix}.target is required`);
  if (item.period && typeof item.period === 'object' && (!String(item.period.zh || '').trim() || !String(item.period.en || '').trim())) {
    errors.push(`${prefix}.period localized value requires zh and en`);
  }
  if (item.tags !== undefined && !Array.isArray(item.tags)) errors.push(`${prefix}.tags must be an array`);
  if (item.capabilities !== undefined && !Array.isArray(item.capabilities)) errors.push(`${prefix}.capabilities must be an array`);
  for (const [tagIndex, tag] of (item.tags || []).entries()) {
    if (tag && typeof tag === 'object' && (!String(tag.zh || '').trim() || !String(tag.en || '').trim())) {
      errors.push(`${prefix}.tags[${tagIndex}] localized value requires zh and en`);
    }
  }
  for (const [mediaIndex, entry] of (item.media || []).entries()) {
    const target = path.join(ROOT, String(entry.path || ''));
    try { await fs.access(target); } catch { errors.push(`${prefix}.media[${mediaIndex}] missing ${entry.path}`); }
    if (!entry.alt || !String(entry.alt.zh || '').trim() || !String(entry.alt.en || '').trim()) {
      errors.push(`${prefix}.media[${mediaIndex}].alt requires zh and en`);
    }
  }
  for (const [linkIndex, link] of (item.links || []).entries()) {
    if (!link.label || !String(link.label.zh || '').trim() || !String(link.label.en || '').trim()) {
      errors.push(`${prefix}.links[${linkIndex}].label requires zh and en`);
    }
    const url = String(link.url || '').trim();
    if (!url) errors.push(`${prefix}.links[${linkIndex}].url is required`);
    else if (/^[a-z]+:/i.test(url) && !/^https?:/i.test(url)) errors.push(`${prefix}.links[${linkIndex}].url uses an unsupported protocol`);
  }
  if (item.relatedPost) {
    for (const language of ['zh', 'en']) {
      const post = path.join(ROOT, 'posts', language, String(item.relatedPost));
      try { await fs.access(post); } catch { errors.push(`${prefix}.relatedPost missing posts/${language}/${item.relatedPost}`); }
    }
  }
}
if (errors.length) {
  console.error(`Portfolio record validation failed with ${errors.length} error(s):`);
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`Portfolio record validation passed (${(data.items || []).length} records).`);
