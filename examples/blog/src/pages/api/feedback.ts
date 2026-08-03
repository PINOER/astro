// examples/blog/src/pages/api/feedback.ts
export const prerender = false; // 👈 必须加在最顶部！

import type { APIRoute } from 'astro';

const corsHeaders = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Methods': 'POST, OPTIONS',
	'Access-Control-Allow-Headers': 'Content-Type',
	'Content-Type': 'application/json',
};

export const OPTIONS: APIRoute = async () => {
	return new Response(null, { status: 204, headers: corsHeaders });
};

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

		const runtime = (locals as any)?.runtime;
		const env = runtime?.env || (locals as any)?.env || (import.meta as any).env;
		const kv = env?.ADMIN_KV || (process as any)?.env?.ADMIN_KV;

		if (!kv) {
			return new Response(
				JSON.stringify({ success: false, error: '未能匹配到 ADMIN_KV 绑定，请检查 Cloudflare Pages 设置' }),
				{ status: 500, headers: corsHeaders }
			);
		}

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
