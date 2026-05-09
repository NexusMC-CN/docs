import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkMdx from 'remark-mdx';
import remarkGfm from 'remark-gfm';

type MarkdownNode = {
  type: string;
  value?: string;
  children?: MarkdownNode[];
  [key: string]: unknown;
};

type ContainerOpener = {
  type: string;
  title: string;
};

type CodeGroupItem = {
  lang: string;
  meta: string;
  title: string;
  value: string;
};

type VFileLike = {
  value?: unknown;
};

const CALLOUT_TYPES = new Set(['note', 'info', 'tip', 'important', 'warning', 'caution', 'danger']);
const CALLOUT_ALIASES = new Map<string, string>([
  ['info', 'note'],
  ['danger', 'caution'],
]);

const DEFAULT_TITLES: Record<string, string> = {
  note: 'NOTE',
  tip: 'TIP',
  important: 'IMPORTANT',
  warning: 'WARNING',
  caution: 'CAUTION',
};

function escapeHtml(value: unknown) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function normalizeCalloutType(type: unknown) {
  const normalized = String(type || '').trim().toLowerCase();
  return CALLOUT_ALIASES.get(normalized) || normalized;
}

function parseContainerOpener(line: string): ContainerOpener | null {
  const raw = line.trim();
  if (!raw.startsWith(':::')) return null;
  if (/^:::\s*$/.test(raw)) return null;
  const value = raw.slice(3).trim();
  const match = value.match(/^([A-Za-z][\w-]*)(?:\[(.*?)\])?(?:\s+(.*))?$/);
  if (!match) return null;
  const type = match[1].toLowerCase();
  const bracketTitle = match[2];
  const restTitle = match[3];
  if (type !== 'details' && type !== 'code-group' && !CALLOUT_TYPES.has(type)) return null;
  return {
    type,
    title: (bracketTitle || restTitle || '').trim(),
  };
}

function parseMarkdownChildren(source: string): MarkdownNode[] {
  if (!source.trim()) return [];
  return unified().use(remarkParse).use(remarkGfm).use(remarkMdx).parse(source).children as MarkdownNode[];
}

function getFenceMarker(line: string) {
  const match = String(line || '').match(/^\s*(`{3,}|~{3,})/);
  return match ? match[1][0] : null;
}

function buildCalloutNodes(type: string, title: string, innerSource: string): MarkdownNode[] {
  const normalizedType = normalizeCalloutType(type);
  const label = title || DEFAULT_TITLES[normalizedType] || normalizedType.toUpperCase();
  const children = parseCustomMarkdown(innerSource);
  return [
    {
      type: 'html',
      value: `<aside class="docs-callout docs-callout--${escapeHtml(normalizedType)}" data-callout="${escapeHtml(normalizedType)}"><div class="docs-callout__title">${escapeHtml(label)}</div>`,
    },
    ...children,
    { type: 'html', value: '</aside>' },
  ];
}

function buildDetailsNodes(title: string, innerSource: string): MarkdownNode[] {
  const label = title || 'Details';
  const children = parseCustomMarkdown(innerSource);
  return [
    {
      type: 'html',
      value: `<details class="docs-details"><summary>${escapeHtml(label)}</summary><div class="docs-details__content">`,
    },
    ...children,
    { type: 'html', value: '</div></details>' },
  ];
}

function parseFenceStart(line: string) {
  const match = line.match(/^\s*(`{3,}|~{3,})([^\s`]*)?\s*(.*?)\s*$/);
  if (!match) return null;
  return {
    marker: match[1],
    char: match[1][0],
    lang: match[2] || '',
    meta: match[3] || '',
  };
}

function parseCodeGroupTitle(lang: string, meta: string, index: number) {
  const titleMatch = meta.match(/\[([^\]]+)\]/);
  if (titleMatch?.[1]?.trim()) return titleMatch[1].trim();
  if (lang) return lang;
  return `代码 ${index + 1}`;
}

function parseCodeGroupItems(source: string): CodeGroupItem[] {
  const lines = source.split(/\r?\n/);
  const items: CodeGroupItem[] = [];
  let index = 0;

  while (index < lines.length) {
    const start = parseFenceStart(lines[index]);
    if (!start) {
      index += 1;
      continue;
    }

    const body: string[] = [];
    index += 1;
    while (index < lines.length) {
      const line = lines[index];
      const trimmed = line.trim();
      if (trimmed.startsWith(start.char.repeat(start.marker.length))) break;
      body.push(line);
      index += 1;
    }

    items.push({
      lang: start.lang,
      meta: start.meta,
      title: parseCodeGroupTitle(start.lang, start.meta, items.length),
      value: body.join('\n'),
    });

    index += 1;
  }

  return items;
}

function buildCodeGroupNodes(innerSource: string): MarkdownNode[] {
  const items = parseCodeGroupItems(innerSource);
  if (!items.length) return parseMarkdownChildren(innerSource);

  const tabs = items
    .map((item, index) => {
      const langLabel = item.lang ? `<span class="docs-code-group__lang">${escapeHtml(item.lang.toUpperCase())}</span>` : '';
      const active = index === 0 ? ' is-active' : '';
      const selected = index === 0 ? 'true' : 'false';
      return `<button class="docs-code-group__tab${active}" type="button" role="tab" aria-selected="${selected}" data-code-group-tab="${index}">${langLabel}<span>${escapeHtml(item.title)}</span></button>`;
    })
    .join('');

  const nodes: MarkdownNode[] = [
    { type: 'html', value: '<div class="docs-code-group" data-code-group>' },
    { type: 'html', value: `<div class="docs-code-group__tabs" role="tablist">${tabs}</div>` },
    { type: 'html', value: '<div class="docs-code-group__panels">' },
  ];

  for (const [index, item] of items.entries()) {
    const active = index === 0 ? ' is-active' : '';
    nodes.push(
      { type: 'html', value: `<div class="docs-code-group__panel${active}" role="tabpanel" data-code-group-panel="${index}">` },
      {
        type: 'code',
        lang: item.lang || undefined,
        meta: item.meta || undefined,
        value: item.value,
      },
      { type: 'html', value: '</div>' },
    );
  }

  nodes.push({ type: 'html', value: '</div></div>' });
  return nodes;
}

function parseCustomMarkdown(source: unknown): MarkdownNode[] {
  const lines = String(source || '').split(/\r?\n/);
  const nodes: MarkdownNode[] = [];
  let normalStart = 0;
  let index = 0;
  let activeFence: string | null = null;

  function flushNormal(endIndex: number) {
    if (endIndex <= normalStart) return;
    const chunk = lines.slice(normalStart, endIndex).join('\n');
    nodes.push(...parseMarkdownChildren(chunk));
  }

  while (index < lines.length) {
    const fence = getFenceMarker(lines[index]);
    if (fence && (!activeFence || activeFence === fence)) {
      activeFence = activeFence ? null : fence;
      index += 1;
      continue;
    }
    if (activeFence) {
      index += 1;
      continue;
    }

    const opener = parseContainerOpener(lines[index]);
    if (!opener) {
      index += 1;
      continue;
    }

    let depth = 1;
    let cursor = index + 1;
    let innerFence: string | null = null;
    while (cursor < lines.length) {
      const cursorFence = getFenceMarker(lines[cursor]);
      if (cursorFence && (!innerFence || innerFence === cursorFence)) {
        innerFence = innerFence ? null : cursorFence;
        cursor += 1;
        continue;
      }
      if (innerFence) {
        cursor += 1;
        continue;
      }

      if (parseContainerOpener(lines[cursor])) {
        depth += 1;
      } else if (/^:::\s*$/.test(lines[cursor].trim())) {
        depth -= 1;
        if (depth === 0) break;
      }
      cursor += 1;
    }

    if (depth !== 0) {
      index += 1;
      continue;
    }

    flushNormal(index);
    const innerSource = lines.slice(index + 1, cursor).join('\n');
    nodes.push(
      ...(opener.type === 'code-group'
        ? buildCodeGroupNodes(innerSource)
        : opener.type === 'details'
          ? buildDetailsNodes(opener.title, innerSource)
          : buildCalloutNodes(opener.type, opener.title, innerSource)),
    );
    index = cursor + 1;
    normalStart = index;
  }

  flushNormal(lines.length);
  transformGitHubAlerts({ type: 'root', children: nodes });
  transformSpoilers({ type: 'root', children: nodes });
  return nodes;
}

function getTextFromChildren(children?: MarkdownNode[]): string {
  return (children || [])
    .map((child): string => {
      if (child.type === 'text' || child.type === 'inlineCode') return child.value || '';
      if (Array.isArray(child.children)) return getTextFromChildren(child.children);
      return '';
    })
    .join('');
}

function stripAlertMarker(blockquote: MarkdownNode, type: string): MarkdownNode[] {
  const first = blockquote.children?.[0];
  if (!first || first.type !== 'paragraph' || !Array.isArray(first.children)) return blockquote.children || [];
  const marker = new RegExp(`^\\[!${type}\\]\\s*\\n?`, 'i');
  const children = [...first.children];
  for (let index = 0; index < children.length; index += 1) {
    const node = children[index];
    if (node.type !== 'text') continue;
    const nextValue = String(node.value || '').replace(marker, '');
    if (nextValue !== node.value) {
      if (nextValue) children[index] = { ...node, value: nextValue };
      else children.splice(index, 1);
      break;
    }
  }

  const nextBlockquoteChildren = [...(blockquote.children || [])];
  if (children.length) nextBlockquoteChildren[0] = { ...first, children };
  else nextBlockquoteChildren.shift();
  return nextBlockquoteChildren;
}

function transformGitHubAlerts(tree: MarkdownNode) {
  function visitParent(parent: MarkdownNode) {
    if (!Array.isArray(parent.children)) return;
    for (let index = 0; index < parent.children.length; index += 1) {
      const child = parent.children[index];
      if (child.type === 'blockquote') {
        const first = child.children?.[0];
        const text = first?.type === 'paragraph' ? getTextFromChildren(first.children) : '';
        const match = text.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
        if (match) {
          const type = normalizeCalloutType(match[1]);
          const label = DEFAULT_TITLES[type] || type.toUpperCase();
          const contentChildren = stripAlertMarker(child, match[1]);
          parent.children.splice(index, 1, ...[
            {
              type: 'html',
              value: `<aside class="docs-callout docs-callout--${escapeHtml(type)}" data-callout="${escapeHtml(type)}"><div class="docs-callout__title">${escapeHtml(label)}</div>`,
            },
            ...contentChildren,
            { type: 'html', value: '</aside>' },
          ]);
          index += contentChildren.length + 1;
          continue;
        }
      }
      visitParent(child);
    }
  }
  visitParent(tree);
}

function transformSpoilers(tree: MarkdownNode) {
  function visitParent(parent: MarkdownNode) {
    if (!Array.isArray(parent.children)) return;
    if (parent.type === 'paragraph' || parent.type === 'heading') {
      parent.children = transformSpoilerChildren(parent.children);
    }
    for (const child of parent.children) visitParent(child);
  }
  visitParent(tree);
}

function transformSpoilerChildren(children: MarkdownNode[]): MarkdownNode[] {
  const result: MarkdownNode[] = [];
  for (let index = 0; index < children.length; index += 1) {
    const node = children[index];
    if (node.type !== 'text' || !String(node.value || '').includes(':spoiler[')) {
      result.push(node);
      continue;
    }

    const value = String(node.value || '');
    const start = value.indexOf(':spoiler[');
    const before = value.slice(0, start);
    const inner: MarkdownNode[] = [];
    let closed = false;

    if (before) result.push({ ...node, value: before });

    let cursor = index;
    let current: MarkdownNode | undefined = { ...node, value: value.slice(start + ':spoiler['.length) };
    while (cursor < children.length && current) {
      const currentValue = String(current.value || '');
      if (current.type === 'text') {
        const end = currentValue.indexOf(']');
        if (end >= 0) {
          const beforeClose = currentValue.slice(0, end);
          const afterClose = currentValue.slice(end + 1);
          if (beforeClose) inner.push({ ...current, value: beforeClose });
          result.push(
            {
              type: 'html',
              value: '<span class="docs-spoiler" tabindex="0" role="button" aria-label="剧透内容">',
            },
            ...inner,
            { type: 'html', value: '</span>' },
          );
          if (afterClose) result.push({ ...current, value: afterClose });
          closed = true;
          break;
        }
        if (currentValue) inner.push({ ...current, value: currentValue });
      } else {
        inner.push(current);
      }
      cursor += 1;
      current = children[cursor];
    }

    if (!closed) {
      result.push({ ...node, value: value.slice(start) });
    } else {
      index = cursor;
    }
  }
  return result;
}

export function remarkDocsEnhancements() {
  return (tree: MarkdownNode, file: VFileLike) => {
    const source = String(file.value || '');
    tree.children = parseCustomMarkdown(source);
  };
}
