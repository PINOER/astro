// src/pages/api/admin/config.ts
import type { APIRoute } from 'astro';

export const prerender = false;

// 1. 获取配置数据 (GET)
export const GET: APIRoute = async ({ locals, url }) => {
	const type = url.searchParams.get('type'); // 'tools' 或 'ads'
	
	try {
		// 尝试从 Cloudflare KV 中获取配置
		const runtime = (locals as any).runtime;
		const kv = runtime?.env?.ADMIN_KV;

		if (kv) {
			const data = await kv.get(`config_${type}`, { type: 'json' });
			if (data) {
				return new Response(JSON.stringify({ success: true, data }), { status: 200 });
			}
		}

		return new Response(JSON.stringify({ success: true, data: null }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ success: false, message: '读取配置失败' }), { status: 500 });
	}
};

// 2. 保存配置数据 (POST)
export const POST: APIRoute = async ({ request, locals, cookies }) => {
	// 校验 Admin Cookie 身份
	const session = cookies.get('admin_session')?.value;
	if (session !== 'astro_admin_secure_session_token_2026') {
		return new Response(JSON.stringify({ success: false, message: '无访问权限' }), { status: 401 });
	}

	try {
		const { type, configData } = await request.json(); // type: 'tools' | 'ads'
		
		const runtime = (locals as any).runtime;
		const kv = runtime?.env?.ADMIN_KV;

		if (kv) {
			// 保存至 Cloudflare KV
			await kv.put(`config_${type}`, JSON.stringify(configData));
		}

		return new Response(JSON.stringify({ success: true, message: '配置已成功保存！' }), { status: 200 });
	} catch (error) {
		return new Response(JSON.stringify({ success: false, message: '保存配置异常' }), { status: 500 });
	}
};
