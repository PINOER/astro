import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		heroImage: z.string().optional(),
		lang: z.enum(['en', 'es', 'de', 'ja', 'zh']).default('en'), // 支持的多语言列表
	}),
});

export const collections = { blog };
