export interface ToolItem {
	id: string;
	title: { en: string; zh: string };
	desc: { en: string; zh: string };
	url: { en: string; zh: string };
	icon: string;
	tag: { en: string; zh: string };
	keywords: { en: string; zh: string };
	pinned?: boolean;    // 是否置顶显示
	priority?: number;  // 排序权重 (数字越大越靠前)
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
			en: 'AI Productivity',
			zh: 'AI 效率助手'
		},
		keywords: {
			en: 'prompt refiner structurer costar framework chatgpt claude generator',
			zh: 'prompt 提示词 costar 优化 催化剂 chatgpt claude 指令工程'
		},
		pinned: true,
		priority: 100
	},
	{
		id: 'token-calculator',
		title: {
			en: 'LLM Token & Context Limit Calculator',
			zh: 'Token & 上下文限制计算器'
		},
		desc: {
			en: 'Calculate exact token counts for LLMs and avoid context cutoff issues.',
			zh: '精确计算大语言模型的 Token 数量，避免上下文超出与费用截断问题。'
		},
		url: {
			en: '/tools/token-calculator',
			zh: '/zh/tools/token-calculator'
		},
		icon: '📊',
		tag: {
			en: 'Developer Tool',
			zh: '开发者工具'
		},
		keywords: {
			en: 'token calculator context limit count gpt4o claude deepseek gemini tiktoken',
			zh: 'token 计算器 上下文 限制 扣费 gpt4o claude deepseek gemini 字符统计'
		},
		pinned: true,
		priority: 95
	},
	{
		id: 'seo-meta-generator',
		title: {
			en: 'SEO Meta Title & Desc Generator',
			zh: 'SEO Meta 标题与元描述生成器'
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
			en: 'Web & Growth',
			zh: '网站运营与增长'
		},
		keywords: {
			en: 'seo meta title description generator google serp preview ctr tags geo',
			zh: 'seo meta 标题 元描述 描述生成器 google serp 点击率 ctr 搜索引擎优化'
		},
		priority: 90
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
			en: 'Developer Tool',
			zh: '开发者工具'
		},
		keywords: {
			en: 'json formatter validator minify prettify developer tools parse',
			zh: 'json 格式化 校验 美化 压缩 排错 解析器'
		},
		priority: 85
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
			en: 'Security & Utility',
			zh: '实用工具'
		},
		keywords: {
			en: 'base64 encoder decoder url encode decode query string converter',
			zh: 'base64 编码 解码 url 转义 网址 解码器 转换器'
		},
		priority: 80
	},
	{
		id: 'markdown-cleaner',
		title: {
			en: 'Markdown & Text Formatter',
			zh: 'Markdown 文本清理排版器'
		},
		desc: {
			en: 'Strip inline HTML, normalize line breaks, and format AI-generated text instantly.',
			zh: '快速清理 AI 生成文本中的无用 HTML 标签、格式化段落与规范标点。'
		},
		url: {
			en: '/tools/markdown-cleaner',
			zh: '/zh/tools/markdown-cleaner'
		},
		icon: '🧹',
		tag: {
			en: 'Text Utility',
			zh: '文本处理'
		},
		keywords: {
			en: 'markdown cleaner text format strip html remove tags line breaks',
			zh: 'markdown 清理 文本格式化 去除 html 标签 AI 文本处理'
		},
		priority: 75
	},
	{
		id: 'image-base64-converter',
		title: {
			en: 'Image to Base64 & SVG DataURI Generator',
			zh: '图片转 Base64 & DataURI 工具'
		},
		desc: {
			en: 'Convert PNG, JPG, and SVG files into inline DataURI strings for web apps.',
			zh: '将图片或 SVG 文件一键转为 Base64 编码，方便直接嵌入前端 CSS 或 HTML 中。'
		},
		url: {
			en: '/tools/image-base64-converter',
			zh: '/zh/tools/image-base64-converter'
		},
		icon: '🖼️',
		tag: {
			en: 'Frontend Asset',
			zh: '前端资源'
		},
		keywords: {
			en: 'image to base64 svg datauri encoder png jpg inline css asset',
			zh: '图片转 base64 svg datauri 图像转码 嵌入式图片 前端小工具'
		},
		priority: 70
	}
];
