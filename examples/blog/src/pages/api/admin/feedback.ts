export const prerender = false;

import type { APIRoute } from 'astro';

export const ALL: APIRoute = async ({ request, locals }) => {
	// 允许跨域及 OPTIONS 预检，避免浏览器拦截
	if (request.method === 'OPTIONS') {
		return new Response(null, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Access-Control-Allow-Methods': 'POST, OPTIONS',
				'Access-Control-Allow-Headers': 'Content-Type',
			},
		});
	}

	if (request.method !== 'POST') {
		return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
	}

	try {
		const body = await request.json();
		const { type, email, content } = body;

		if (!content || !content.trim()) {
			return new Response(JSON.stringify({ success: false, error: '内容不能为空' }), { status: 400 });
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

		// 获取 ADMIN_KV 实例
		const env = (locals as any)?.runtime?.env || (import.meta as any).env;
		const kv = env?.ADMIN_KV;

		if (!kv) {
			return new Response(
				JSON.stringify({ success: false, error: '未能匹配到 ADMIN_KV 绑定，请检查 Cloudflare 设置' }),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}

		await kv.put(key, JSON.stringify(feedbackData));

		return new Response(JSON.stringify({ success: true, id: key }), {
			status: 200,
			headers: { 
				'Content-Type': 'application/json',
				'Access-Control-Allow-Origin': '*'
			}
		});
	} catch (err: any) {
		return new Response(
			JSON.stringify({ success: false, error: err?.message || '服务器内部异常' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
