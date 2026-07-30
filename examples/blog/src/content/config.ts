// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string().optional(),
			pubDate: z.coerce.date().optional(),
			updatedDate: z.coerce.date().optional(),
			// ⚡ 核心修改：允许填写图片 URL 或 Base64 字符串 (兼容本地相对路径与网络/动态图片)
			heroImage: z.string().optional(),
			lang: z.enum(['en', 'es', 'de', 'ja', 'zh', 'ko']).default('en'),
			tag: z.string().optional(),
			pinned: z.boolean().optional(),
			priority: z.number().optional(),
		}),
});

export const collections = { blog };
