export const prerender = false;

import type { APIRoute } from 'astro';

// 处理 OPTIONS 预检请求（解决跨域拦截）
export const OPTIONS: APIRoute = async () => {
	return new Response(null, {
		status: 204,
		headers: {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, OPTIONS',
			'Access-Control-Allow-Headers': 'Content-Type',
		},
	});
};

// 明确导出 POST 方法处理表单提交
export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const { type, email, content } = body;

		if (!content || !content.trim()) {
			return new Response(JSON.stringify({ success: false, error: '内容不能为空' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
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

		// 获取 Cloudflare ADMIN_KV 绑定
		const env = (locals as any)?.runtime?.env || (import.meta as any).env;
		const kv = env?.ADMIN_KV;

		if (!kv) {
			return new Response(
				JSON.stringify({ success: false, error: '未能匹配到 ADMIN_KV 绑定，请检查 Cloudflare Pages 设置' }),
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
