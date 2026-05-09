import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    section: z.string(),
    locale: z.enum(['zh-CN', 'en']).optional(),
    translationKey: z.string().optional(),
    order: z.number().default(0),
    draft: z.boolean().default(false),
    toc: z.boolean().default(true),
  }),
});

export const collections = { docs };
