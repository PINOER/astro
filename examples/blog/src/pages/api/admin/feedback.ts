export const prerender = false;

import type { APIRoute } from 'astro';

export const DELETE: APIRoute = async ({ request, locals }) => {
	try {
		const { id } = await request.json();

		if (!id || typeof id !== 'string') {
			return new Response(JSON.stringify({ error: '无效的留言 ID' }), { status: 400 });
		}

		const env = (locals as any)?.runtime?.env || (import.meta as any).env;
		const kv = env?.ADMIN_KV;

		if (kv) {
			await kv.delete(id);
		}

		return new Response(JSON.stringify({ success: true }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (e: any) {
		return new Response(JSON.stringify({ error: e?.message || '服务器删除处理失败' }), { status: 500 });
	}
};
