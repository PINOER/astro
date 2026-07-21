export interface ToolItem {
	id: string;
	title: { en: string; zh: string };
	desc: { en: string; zh: string };
	url: { en: string; zh: string };
	icon: string;
	tag: { en: string; zh: string };
	keywords: { en: string; zh: string };
}

export const toolsData: ToolItem[] = [
	{
		id: 'prompt-refiner',
		title: {
			en: 'Prompt Structurer & Refiner',
			zh: '提示词结构化优化工具'
		},
		desc: {
			en: 'Transform rough ideas into structured, high-performing prompts for ChatGPT & Claude.',
			zh: '将粗糙的想法一键转化为结构清晰、高效的 ChatGPT 与 Claude 提示词。'
		},
		url: {
			en: '/tools/prompt-refiner',
			zh: '/zh/tools/prompt-refiner'
		},
		icon: '📝',
		tag: {
			en: 'Free Tool • Instant',
			zh: '免费工具 • 即时生成'
		},
		keywords: {
			en: 'prompt refiner structurer costar framework chatgpt claude generator',
			zh: 'prompt 提示词 costar 优化 催化剂 chatgpt claude'
		}
	},
	{
		id: 'token-calculator',
		title: {
			en: 'LLM Token & Context Limit Calculator',
			zh: 'Token & 上下文限制计算器'
		},
		desc: {
			en: 'Calculate exact token counts for LLMs and avoid context cutoff issues.',
			zh: '精确计算大语言模型的 Token 数量，避免上下文超出截断问题。'
		},
		url: {
			en: '/tools/token-calculator',
			zh: '/zh/tools/token-calculator'
		},
		icon: '📊',
		tag: {
			en: 'Free Tool • Instant',
			zh: '免费工具 • 即时生成'
		},
		keywords: {
			en: 'token calculator context limit count gpt4o claude deepseek gemini',
			zh: 'token 计算器 上下文 限制 扣费 gpt4o claude deepseek gemini'
		}
	},
	{
		id: 'seo-meta-generator',
		title: {
			en: 'SEO Meta Title & Desc Generator',
			zh: 'SEO Meta 标题与描述生成器'
		},
		desc: {
			en: 'Generate Google-friendly meta titles and descriptions optimized for higher CTR.',
			zh: '生成符合 Google 规范且高点击率的 SEO Meta 标题与元描述。'
		},
		url: {
			en: '/tools/seo-meta-generator',
			zh: '/zh/tools/seo-meta-generator'
		},
		icon: '🔍',
		tag: {
			en: 'Free Tool • Instant',
			zh: '免费工具 • 即时生成'
		},
		keywords: {
			en: 'seo meta title description generator google serp preview ctr tags',
			zh: 'seo meta 标题 元描述 描述生成器 google serp 点击率 ctr'
		}
	},
	{
		id: 'json-converter',
		title: {
			en: 'JSON Formatter & Validator',
			zh: 'JSON 格式化与语法校验器'
		},
		desc: {
			en: '100% private, client-side JSON formatting, validation, and minification.',
			zh: '100% 本地计算、安全不上传。支持美化排版、压缩与错误排查。'
		},
		url: {
			en: '/tools/json-converter',
			zh: '/zh/tools/json-converter'
		},
		icon: '⚙️',
		tag: {
			en: 'Free Tool • Instant',
			zh: '免费工具 • 即时生成'
		},
		keywords: {
			en: 'json formatter validator minify prettify developer tools',
			zh: 'json 格式化 校验 美化 压缩 排错'
		}
	},
	{
    id: 'base64-url-converter',
    title: {
        en: 'Base64 & URL Encoder / Decoder',
        zh: 'Base64 & URL 编码解码工具'
    },
    desc: {
        en: 'Instantly encode or decode Base64 text and URL query strings with 100% client-side privacy.',
        zh: '100% 本地计算，即时对文本进行 Base64 编解码与 URL 网址参数安全转义。'
    },
    url: {
        en: '/tools/base64-url-converter',
        zh: '/zh/tools/base64-url-converter'
    },
    icon: '🔤',
    tag: {
        en: 'Free Tool • Instant',
        zh: '免费工具 • 即时生成'
    },
    keywords: {
        en: 'base64 encoder decoder url encode decode query string converter',
        zh: 'base64 编码 解码 url 转义 网址 解码器 转换器'
    }
}
];
