import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	// 1. 将 schema 改为接收 ({ image }) 的函数
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			// 2. 将 z.string().optional() 改为 image().optional()
			heroImage: image().optional(), 
			lang: z.enum(['en', 'es', 'de', 'ja', 'zh']).default('en'), // 支持的多语言列表
		}),
});

export const collections = { blog };
