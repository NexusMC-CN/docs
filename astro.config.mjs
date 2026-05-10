import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import node from '@astrojs/node';
import remarkGfm from 'remark-gfm';
import { remarkDocsEnhancements } from './src/lib/markdownPlugins.ts';

export default defineConfig({
  site: process.env.DOCS_SITE_URL || process.env.SITE_URL || 'https://docs.nexusmc.cn',
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    tailwind(),
    sitemap(),
    mdx({
      remarkPlugins: [remarkGfm, remarkDocsEnhancements],
    }),
  ],
  server: {
    port: 4322,
    host: true,
  },
  vite: {
    cacheDir: '.astro/vite-cache',
    server: {
      allowedHosts: true,
    },
    preview: {
      allowedHosts: true,
    },
  },
});
