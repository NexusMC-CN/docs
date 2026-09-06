import { readFile, writeFile } from 'node:fs/promises';

const sourceUrl = new URL('../imports/help-center/growth-assets.zh-CN.json', import.meta.url);
const targetUrl = new URL('../imports/help-center/growth-assets.zh-CN.csv', import.meta.url);

function csvCell(value) {
  const normalized = String(value ?? '').replace(/\r?\n/g, '\n');
  return `"${normalized.replace(/"/g, '""')}"`;
}

function joinSteps(steps = []) {
  return steps.join(' || ');
}

function joinRelated(related = []) {
  return related.map((item) => `${item.label}=>${item.href}`).join(' || ');
}

const data = JSON.parse(await readFile(sourceUrl, 'utf8'));
const headers = [
  'schema_version',
  'locale',
  'category_key',
  'category_name',
  'category_description',
  'question_id',
  'question',
  'answer',
  'steps',
  'related_links',
  'keywords',
  'sort_order',
  'status',
];

const rows = data.questions.map((item) => [
  data.schemaVersion,
  data.locale,
  data.category.key,
  data.category.name,
  data.category.description,
  item.id,
  item.question,
  item.answer,
  joinSteps(item.steps),
  joinRelated(item.related),
  (item.keywords || []).join(' || '),
  item.sortOrder,
  item.status,
]);

const csv = [headers.map(csvCell), ...rows.map((row) => row.map(csvCell))]
  .map((row) => row.join(','))
  .join('\r\n');

await writeFile(targetUrl, `\uFEFF${csv}\r\n`, 'utf8');
