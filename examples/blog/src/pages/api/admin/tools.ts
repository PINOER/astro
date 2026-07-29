// src/pages/api/admin/login.ts
import type { APIRoute } from 'astro';

// ⚠️ 关键：必须显式指定 SSR 模式，避免被打包成静态文件
export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
	try {
		const body = await request.json();
		const { username, password } = body;

		// 校验账号密码
		if (username === 'admin' && password === 'admin123') {
			// 设置 Auth Cookie (安全鉴权)
			cookies.set('admin_token', 'pinoer_admin_authenticated_token_2026', {
				path: '/',
				httpOnly: true,
				secure: true,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 7, // 7 天有效
			});

			return new Response(
				JSON.stringify({ success: true, message: '登录成功' }),
				{ status: 200, headers: { 'Content-Type': 'application/json' } }
			);
		}

		return new Response(
			JSON.stringify({ success: false, message: '账号或密码错误' }),
			{ status: 400, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, message: '服务端解析请求失败' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
