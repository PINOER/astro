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
			// ⚡ 完美兼容：既支持 Astro 原生相对路径图片 image()，也支持网络 URL / Base64 字符串
			heroImage: z.union([image(), z.string()]).optional(),
			lang: z.enum(['en', 'es', 'de', 'ja', 'zh', 'ko']).default('en'),
			tag: z.string().optional(),
			pinned: z.boolean().optional(),
			priority: z.number().optional(),
		}),
});

export const collections = { blog };
