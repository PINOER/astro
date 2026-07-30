// src/pages/api/admin/config.ts
import type { APIRoute } from 'astro';

// ⚠️ 必须声明动态运行，禁止 Cloudflare / Astro 预渲染此接口
export const prerender = false;

// 1. 获取配置数据 (前台 & 后台通用)
export const GET: APIRoute = async ({ locals, url }) => {
	const type = url.searchParams.get('type') || 'tools_v2';

	try {
		const runtime = (locals as any).runtime;
		const kv = runtime?.env?.ADMIN_KV;

		if (kv) {
			const data = await kv.get(`config_${type}`, { type: 'json' });
			return new Response(JSON.stringify({ success: true, data: data || null }), {
				status: 200,
				headers: {
					'Content-Type': 'application/json',
					// 禁用浏览器/节点中转强缓存，保证后台改完前台刷新立刻生效
					'Cache-Control': 'no-cache, no-store, must-revalidate',
				},
			});
		}

		return new Response(JSON.stringify({ success: true, data: null }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, message: '读取 Cloudflare KV 失败' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};

// 2. 保存配置数据 (后台专属)
export const POST: APIRoute = async ({ request, locals, cookies }) => {
	// 校验 Admin Cookie 身份
	const session = cookies.get('admin_session')?.value;
	if (session !== 'astro_admin_secure_session_token_2026') {
		return new Response(
			JSON.stringify({ success: false, message: '无访问权限，请先登录后台' }),
			{ status: 401, headers: { 'Content-Type': 'application/json' } }
		);
	}

	try {
		const { type, configData } = await request.json();
		const runtime = (locals as any).runtime;
		const kv = runtime?.env?.ADMIN_KV;

		if (kv) {
			// 写入 Cloudflare KV
			await kv.put(`config_${type}`, JSON.stringify(configData));
			return new Response(
				JSON.stringify({ success: true, message: '配置已成功同步写入 Cloudflare KV！' }),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			);
		}

		return new Response(
			JSON.stringify({ success: false, message: '未找到 ADMIN_KV 绑定，请检查 Cloudflare 后台设置' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, message: '保存配置过程解析异常' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
