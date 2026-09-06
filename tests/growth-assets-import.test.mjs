import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { test } from 'node:test';

const importRoot = new URL('../imports/help-center/', import.meta.url);

function parseCsv(source) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    if (quoted) {
      if (char === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (char === '"') {
        quoted = false;
      } else {
        field += char;
      }
      continue;
    }
    if (char === '"') quoted = true;
    else if (char === ',') {
      row.push(field);
      field = '';
    } else if (char === '\n') {
      row.push(field.replace(/\r$/, ''));
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += char;
    }
  }
  if (field || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers, ...values] = rows;
  return values.filter((item) => item.some(Boolean)).map((item) => Object.fromEntries(
    headers.map((header, index) => [header.replace(/^\uFEFF/, ''), item[index] ?? '']),
  ));
}

test('growth and assets JSON is a complete import source', async () => {
  const data = JSON.parse(await readFile(new URL('growth-assets.zh-CN.json', importRoot), 'utf8'));
  assert.equal(data.schemaVersion, 1);
  assert.equal(data.locale, 'zh-CN');
  assert.equal(data.category.key, 'growth-assets');
  assert.ok(data.questions.length >= 16);

  const ids = data.questions.map((item) => item.id);
  assert.equal(new Set(ids).size, ids.length, 'question ids must be unique');
  assert.deepEqual(data.questions.map((item) => item.sortOrder), data.questions.map((_, index) => index + 1));

  const searchableText = data.questions
    .flatMap((item) => [item.question, item.answer, ...(item.keywords || [])])
    .join('\n');
  for (const subject of ['等级', '贡献度', '任务', '能力', '积分', '签到', '道具']) {
    assert.match(searchableText, new RegExp(subject), `expected coverage for ${subject}`);
  }

  for (const item of data.questions) {
    assert.match(item.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(item.question.endsWith('？'));
    assert.ok(item.answer.length >= 20);
    assert.equal(item.status, 'published');
  }
});

test('growth and assets CSV is generated from the JSON question set', async () => {
  const [data, csvSource] = await Promise.all([
    readFile(new URL('growth-assets.zh-CN.json', importRoot), 'utf8').then(JSON.parse),
    readFile(new URL('growth-assets.zh-CN.csv', importRoot), 'utf8'),
  ]);
  const rows = parseCsv(csvSource);
  assert.equal(rows.length, data.questions.length);
  assert.deepEqual(rows.map((item) => item.question_id), data.questions.map((item) => item.id));
  assert.ok(rows.every((item) => item.category_key === 'growth-assets'));
  assert.ok(rows.every((item) => item.question && item.answer && item.status === 'published'));
});
