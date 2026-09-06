import type { CollectionEntry } from 'astro:content';

export type DocEntry = CollectionEntry<'docs'>;
export type DocLocale = 'zh-CN' | 'en';

export const DEFAULT_DOC_LOCALE: DocLocale = 'zh-CN';

const SECTION_ORDER: Record<string, number> = {
  '快速开始': 10,
  '站点机制': 20,
  '账号与安全': 30,
  '消息与通知': 40,
  '投稿流程': 50,
  '资源规范': 60,
  '找服玩规范': 65,
  '内容规范': 67,
  'API': 70,
  '主站信息': 80,
};

const SIDEBAR_GROUP_ORDER: Record<string, number> = {
  '接入基础': 10,
  '现成工具': 15,
  '资源接口': 20,
  '内容投稿': 30,
  '正文格式': 40,
  'OAuth2': 50,
  '站点 API': 51,
  'WebSocket 接口': 52,
};

export const DOC_LOCALES: Array<{
  code: DocLocale;
  label: string;
  htmlLang: string;
  pathPrefix: string;
}> = [
  { code: 'zh-CN', label: '简体中文', htmlLang: 'zh-CN', pathPrefix: '' },
  { code: 'en', label: 'English', htmlLang: 'en', pathPrefix: 'en' },
];

export const DOCS_PRIMARY_NAV: Array<{
  label: string;
  sections: string[];
  defaultSlug?: string;
  href?: string;
}> = [
  {
    label: '入门',
    sections: ['快速开始'],
    defaultSlug: 'getting-started/overview',
  },
  {
    label: '站点功能',
    sections: ['站点机制', '账号与安全', '消息与通知', '主站信息'],
    defaultSlug: 'site-info/site-faq',
  },
  {
    label: '投稿与资源',
    sections: ['投稿流程', '资源规范', '找服玩规范', '内容规范'],
    defaultSlug: 'operations/resource-submission-flow',
  },
  {
    label: '开发接入',
    sections: ['API'],
    defaultSlug: 'api/personal-api-tokens',
  },
  {
    label: '帮助中心',
    sections: [],
    href: '/help',
  },
];

const DOC_LOCALE_CODES = new Set<DocLocale>(DOC_LOCALES.map((locale) => locale.code));

export function normalizeDocLocale(input: unknown): DocLocale {
  return DOC_LOCALE_CODES.has(input as DocLocale) ? input as DocLocale : DEFAULT_DOC_LOCALE;
}

export function getDocLocale(entry: DocEntry): DocLocale {
  const declared = normalizeDocLocale(entry.data.locale);
  if (entry.data.locale) return declared;
  const firstSlugPart = entry.slug.split('/')[0];
  const matched = DOC_LOCALES.find((locale) => locale.pathPrefix === firstSlugPart);
  return matched?.code || DEFAULT_DOC_LOCALE;
}

export function getDocLocaleMeta(locale: DocLocale) {
  return DOC_LOCALES.find((item) => item.code === locale) || DOC_LOCALES[0];
}

export function stripDocLocalePrefix(slug: string, locale: DocLocale = DEFAULT_DOC_LOCALE) {
  const normalizedSlug = String(slug || '').replace(/^\/+|\/+$/g, '');
  const localeMeta = getDocLocaleMeta(locale);
  if (!localeMeta.pathPrefix) return normalizedSlug;
  const prefix = `${localeMeta.pathPrefix}/`;
  return normalizedSlug.startsWith(prefix) ? normalizedSlug.slice(prefix.length) : normalizedSlug;
}

export function buildDocsIndexHref(locale: DocLocale = DEFAULT_DOC_LOCALE) {
  const localeMeta = getDocLocaleMeta(locale);
  return localeMeta.pathPrefix ? `/${localeMeta.pathPrefix}/docs` : '/docs';
}

export function buildDocHref(slug: string, locale: DocLocale = DEFAULT_DOC_LOCALE) {
  const localeMeta = getDocLocaleMeta(locale);
  const cleanSlug = stripDocLocalePrefix(slug, locale);
  const prefix = localeMeta.pathPrefix ? `/${localeMeta.pathPrefix}` : '';
  return `${prefix}/docs/${cleanSlug}`;
}

export function buildDocEntryHref(entry: DocEntry) {
  return buildDocHref(entry.slug, getDocLocale(entry));
}

export function getPrimaryNavForSection(section?: string) {
  return DOCS_PRIMARY_NAV.find((item) => section && item.sections.includes(section)) || null;
}

export function buildPrimaryNavHref(item: typeof DOCS_PRIMARY_NAV[number], locale: DocLocale = DEFAULT_DOC_LOCALE) {
  if (item.href) return item.href;
  return item.defaultSlug ? buildDocHref(item.defaultSlug, locale) : buildDocsIndexHref(locale);
}

export function filterDocsByPrimaryNav(entries: DocEntry[], section?: string) {
  const currentNav = getPrimaryNavForSection(section);
  if (!currentNav) return entries;
  return entries.filter((entry) => currentNav.sections.includes(entry.data.section));
}

export function filterPublicDocsByLocale(entries: DocEntry[], locale: DocLocale = DEFAULT_DOC_LOCALE) {
  return entries.filter((entry) => !entry.data.draft && getDocLocale(entry) === locale);
}

export function buildEditLabel(entry: DocEntry) {
  return `${entry.data.section} / ${entry.data.title}`;
}

export function sortDocs(entries: DocEntry[]) {
  return [...entries].sort((a, b) => {
    const localeCompare = getDocLocale(a).localeCompare(getDocLocale(b));
    if (localeCompare !== 0) return localeCompare;
    if (a.data.section !== b.data.section) {
      const aSectionOrder = SECTION_ORDER[a.data.section] ?? Number.MAX_SAFE_INTEGER;
      const bSectionOrder = SECTION_ORDER[b.data.section] ?? Number.MAX_SAFE_INTEGER;
      if (aSectionOrder !== bSectionOrder) {
        return aSectionOrder - bSectionOrder;
      }
      return a.data.section.localeCompare(b.data.section, 'zh-CN');
    }
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }
    return a.data.title.localeCompare(b.data.title, 'zh-CN');
  });
}

function getSidebarGroup(entry: DocEntry) {
  return entry.data.sidebarGroup || entry.data.section;
}

export function groupDocs(entries: DocEntry[]) {
  const groups = new Map<string, DocEntry[]>();
  for (const entry of sortDocs(entries)) {
    const key = getSidebarGroup(entry);
    const list = groups.get(key) || [];
    list.push(entry);
    groups.set(key, list);
  }
  return Array.from(groups.entries())
    .sort(([a], [b]) => {
      const aOrder = SIDEBAR_GROUP_ORDER[a] ?? Number.MAX_SAFE_INTEGER;
      const bOrder = SIDEBAR_GROUP_ORDER[b] ?? Number.MAX_SAFE_INTEGER;
      if (aOrder !== bOrder) return aOrder - bOrder;
      return a.localeCompare(b, 'zh-CN');
    })
    .map(([section, items]) => ({ section, items }));
}

export function getPrevNext(entries: DocEntry[], slug: string) {
  const sorted = sortDocs(entries);
  const index = sorted.findIndex((entry) => entry.slug === slug);
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}
