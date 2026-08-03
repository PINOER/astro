import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, env }) => {
	try {
		const body = await request.json();
		const { type, email, content } = body;

		if (!content || !content.trim()) {
			return new Response(JSON.stringify({ error: '内容不能为空' }), {
				status: 400,
				headers: { 'Content-Type': 'application/json' }
			});
		}

		// 生成格式化主键，例如：feedback:1785721800000_a3x9
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

		// 存入 Cloudflare KV (请确保 Cloudflare Pages 绑定的 KV 空间命名为 HELPMINI_KV)
		if (env?.HELPMINI_KV) {
			await env.HELPMINI_KV.put(key, JSON.stringify(feedbackData));
		} else {
			// 本地开发环境降级日志
			console.log('本地开发预览 - 反馈数据记录：', feedbackData);
		}

		return new Response(JSON.stringify({ success: true, id: key }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		return new Response(JSON.stringify({ error: '服务器处理失败' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
