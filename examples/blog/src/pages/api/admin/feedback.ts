export const prerender = false;

import type { APIRoute } from 'astro';

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

		// 拼接唯一 Key，如 feedback:1785721800000_a3x9
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

		// ⚡ 深度兼容获取 Cloudflare ADMIN_KV 实例
		const runtime = (locals as any)?.runtime;
		const env = runtime?.env || (import.meta as any).env;
		const kv = env?.ADMIN_KV || (process as any)?.env?.ADMIN_KV;

		if (!kv) {
			console.error('🚨 [API Error] 未识别到 ADMIN_KV 命名空间！');
			return new Response(
				JSON.stringify({ 
					success: false, 
					error: '服务器端配置错误：未检测到 ADMIN_KV 命名空间绑定，请检查 Cloudflare Pages 设置。' 
				}),
				{ status: 500, headers: { 'Content-Type': 'application/json' } }
			);
		}

		// 存入 KV 数据库
		await kv.put(key, JSON.stringify(feedbackData));

		return new Response(JSON.stringify({ success: true, id: key }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		console.error('🚨 [API Exception]', err);
		return new Response(
			JSON.stringify({ success: false, error: `服务器异常: ${err?.message || '未知错误'}` }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
