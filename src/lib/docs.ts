import type { CollectionEntry } from 'astro:content';

export type DocEntry = CollectionEntry<'docs'>;
export type DocLocale = 'zh-CN' | 'en';

export const DEFAULT_DOC_LOCALE: DocLocale = 'zh-CN';

export const DOC_LOCALES: Array<{
  code: DocLocale;
  label: string;
  htmlLang: string;
  pathPrefix: string;
}> = [
  { code: 'zh-CN', label: '简体中文', htmlLang: 'zh-CN', pathPrefix: '' },
  { code: 'en', label: 'English', htmlLang: 'en', pathPrefix: 'en' },
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
      return a.data.section.localeCompare(b.data.section, 'zh-CN');
    }
    if (a.data.order !== b.data.order) {
      return a.data.order - b.data.order;
    }
    return a.data.title.localeCompare(b.data.title, 'zh-CN');
  });
}

export function groupDocs(entries: DocEntry[]) {
  const groups = new Map<string, DocEntry[]>();
  for (const entry of sortDocs(entries)) {
    const key = entry.data.section;
    const list = groups.get(key) || [];
    list.push(entry);
    groups.set(key, list);
  }
  return Array.from(groups.entries()).map(([section, items]) => ({ section, items }));
}

export function getPrevNext(entries: DocEntry[], slug: string) {
  const sorted = sortDocs(entries);
  const index = sorted.findIndex((entry) => entry.slug === slug);
  return {
    prev: index > 0 ? sorted[index - 1] : null,
    next: index >= 0 && index < sorted.length - 1 ? sorted[index + 1] : null,
  };
}
