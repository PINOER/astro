import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
	type: 'content',
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(), 
			lang: z.enum(['en', 'es', 'de', 'ja', 'zh']).default('en'),
			tag: z.string().optional(),
			pinned: z.boolean().optional(),
			priority: z.number().optional(),
		}),
});

export const collections = { blog };
