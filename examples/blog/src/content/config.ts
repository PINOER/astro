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

// 新增 tools 集合，用于支持自动扫描、多语言、权重排序和图标配置
const tools = defineCollection({
	type: 'content',
	schema: z.object({
		title: z.string(),
		description: z.string(),
		url: z.string(),
		icon: z.string().default('⚡'),
		tag: z.string().default('工具'),
		keywords: z.string().optional(),
		lang: z.enum(['en', 'es', 'de', 'ja', 'zh']).default('en'),
		pinned: z.boolean().default(false),
		priority: z.number().default(0),
	}),
});

export const collections = { blog, tools };
