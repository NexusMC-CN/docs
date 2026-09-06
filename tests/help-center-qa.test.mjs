import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { after, before, test } from 'node:test';

const docsRoot = new URL('..', import.meta.url);
const port = 4399;
const origin = `http://127.0.0.1:${port}`;
let server;

async function waitForServer() {
  const deadline = Date.now() + 15_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(origin);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('Docs server did not start within 15 seconds');
}

async function getHtml(pathname) {
  const response = await fetch(`${origin}${pathname}`);
  assert.equal(response.status, 200, `Expected ${pathname} to return HTTP 200`);
  return { html: await response.text(), url: response.url };
}

function getPrimaryNavHtml(html) {
  const match = html.match(/<nav class="docs-primary-nav"[\s\S]*?<\/nav>/);
  assert.ok(match, 'Expected the rendered page to contain the primary navigation');
  return match[0];
}

before(async () => {
  server = spawn(process.execPath, ['dist/server/entry.mjs'], {
    cwd: docsRoot,
    env: {
      ...process.env,
      HOST: '127.0.0.1',
      PORT: String(port),
    },
    stdio: 'ignore',
  });
  await waitForServer();
});

after(() => {
  server?.kill();
});

test('help center presents categorized questions with inline answers', async () => {
  const { html } = await getHtml('/help/account-login');
  const expectedCategories = [
    '账号与登录',
    '账号安全',
    '投稿与审核',
    '内容与互动',
    '消息与通知',
    '搜索与统计',
    '举报与申诉',
    '开发者接入',
  ];

  for (const category of expectedCategories) {
    assert.match(html, new RegExp(`>${category}<`));
  }
  assert.match(html, /<details class="help-question"/);
  assert.match(html, /<summary class="help-question__summary">[\s\S]*忘记密码怎么办/);
  assert.match(html, /class="help-question__answer"/);
  assert.doesNotMatch(html, /class="docs-sidebar/);
});

test('help root opens the default question category', async () => {
  const { url } = await getHtml('/help');
  assert.equal(new URL(url).pathname, '/help/account-login');
});

test('help center is an active primary navigation destination', async () => {
  const { html } = await getHtml('/help/account-login');
  const primaryNav = getPrimaryNavHtml(html);
  assert.match(
    primaryNav,
    /href="\/help"[^>]*class="docs-primary-nav__link is-active"[^>]*>\s*帮助中心\s*<\/a>/,
  );
});

test('help page title and utility link use the question center without duplicated naming', async () => {
  const { html } = await getHtml('/help/account-login');
  assert.match(html, /<title>账号与登录 - NexusMC 帮助中心<\/title>/);
  assert.doesNotMatch(html, /账号与登录 - 帮助中心 - NexusMC 帮助中心/);

  const utilityNav = html.match(/<nav class="docs-topbar__nav"[\s\S]*?<\/nav>/)?.[0] || '';
  assert.match(utilityNav, /href="\/help"[^>]*>[\s\S]*?<span class="docs-topbar__label">帮助中心<\/span>/);
});
