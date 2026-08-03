export const prerender = false;

import type { APIRoute } from 'astro';

// 通用 CORS 响应头配置
const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Content-Type': 'application/json',
};

// 处理 OPTIONS 预检请求（解决浏览器跨域拦截）
export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: corsHeaders,
	});
};

// 明确导出 POST 处理表单提交
export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const { type, email, content } = body;

		if (!content || !content.trim()) {
			return new Response(
				JSON.stringify({ success: false, error: '内容不能为空' }), 
				{ status: 400, headers: corsHeaders }
			);
		}

		const key = `feedback:${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
		const feedbackData = {
			id: key,
			type: type || '其他综合建议',
			email: email || '未提供',
			content: content.trim(),
			createdAt: new Date().toISOString(),
			ip: request.headers.get('cf-connecting-ip') || '未知 IP'
		};

		// ⚡ 全路径兼容获取 Cloudflare ADMIN_KV 绑定
		const runtime = (locals as any)?.runtime;
		const env = runtime?.env || (locals as any)?.env || (import.meta as any).env;
		const kv = env?.ADMIN_KV || (process as any)?.env?.ADMIN_KV;

		if (!kv) {
			return new Response(
				JSON.stringify({ 
					success: false, 
					error: '未能匹配到 ADMIN_KV 绑定，请检查 Cloudflare Pages 控制台 Functions 绑定设置。' 
				}),
				{ status: 500, headers: corsHeaders }
			);
		}

		// 写入 Cloudflare KV 数据库
		await kv.put(key, JSON.stringify(feedbackData));

		return new Response(
			JSON.stringify({ success: true, id: key }), 
			{ status: 200, headers: corsHeaders }
		);
	} catch (err: any) {
		return new Response(
			JSON.stringify({ success: false, error: err?.message || '服务器内部异常' }),
			{ status: 500, headers: corsHeaders }
		);
	}
};
