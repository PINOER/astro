export const prerender = false;

import type { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ request, locals, cookies }) => {
	// 简单的后台身份校验
	const authCookie = cookies.get('admin_session');
	if (!authCookie || !authCookie.value) {
		return new Response(JSON.stringify({ error: '未经授权访问' }), { status: 401 });
	}

	try {
		const { id } = await request.json();

		if (!id || typeof id !== 'string') {
			return new Response(JSON.stringify({ error: '无效的留言 ID' }), { status: 400 });
		}

		// ⚡ 关键修正：使用 ADMIN_KV 删除元素
		const runtime = (locals as any)?.runtime;
		const env = runtime?.env || (import.meta as any).env;
		const kv = env?.ADMIN_KV || (process as any)?.env?.ADMIN_KV;

		if (kv) {
			await kv.delete(id);
		}

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e) {
		return new Response(JSON.stringify({ error: '服务器删除处理失败' }), { status: 500 });
	}
};
