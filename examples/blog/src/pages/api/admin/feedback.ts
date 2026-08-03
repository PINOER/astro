export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const { type, email, content } = body;

		if (!content || !content.trim()) {
			return new Response(JSON.stringify({ error: 'Content is required' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// 格式化唯一 key，例如：feedback:1785721800000_a3x9
		const now = Date.now();
		const randomStr = Math.random().toString(36).substring(2, 6);
		const key = `feedback:${now}_${randomStr}`;

		const feedbackData = {
			id: key,
			type: type || '其他综合建议',
			email: email || '未提供',
			content: content.trim(),
			createdAt: new Date().toISOString(),
			ip: request.headers.get('cf-connecting-ip') || '未知 IP'
		};

		// 获取 Cloudflare KV 实例
		const runtime = (locals as any)?.runtime;
		const env = runtime?.env || (import.meta as any).env;
		const kv = env?.HELPMINI_KV || (process as any)?.env?.HELPMINI_KV;

		if (kv) {
			await kv.put(key, JSON.stringify(feedbackData));
		} else {
			console.log('本地测试模式（无 KV 绑定）：', feedbackData);
		}

		return new Response(JSON.stringify({ success: true, id: key }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		return new Response(JSON.stringify({ error: 'Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
