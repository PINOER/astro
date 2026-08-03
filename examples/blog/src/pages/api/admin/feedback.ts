export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const { type, email, content } = body;

		if (!content || !content.trim()) {
			return new Response(JSON.stringify({ error: '内容不能为空' }), {
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

		// ⚡ 关键修正：读取绑定名 ADMIN_KV
		const runtime = (locals as any)?.runtime;
		const env = runtime?.env || (import.meta as any).env;
		const kv = env?.ADMIN_KV || (process as any)?.env?.ADMIN_KV;

		if (kv) {
			await kv.put(key, JSON.stringify(feedbackData));
		} else {
			console.error('未检测到 ADMIN_KV 绑定！数据未存入 Cloudflare');
			return new Response(JSON.stringify({ error: 'KV未绑定' }), { status: 500 });
		}

		return new Response(JSON.stringify({ success: true, id: key }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e: any) {
		return new Response(JSON.stringify({ error: e?.message || 'Server Error' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
