// src/pages/api/admin/auth.ts
import type { APIRoute } from 'astro';

// ⚠️ 必须声明：确保 Cloudflare/Astro 按动态 API 运行
export const prerender = false;

// 1. 管理员登录接口
export const POST: APIRoute = async ({ request, locals, cookies }) => {
	try {
		const body = await request.json();
		const { username, password } = body;

		// ⚡ 1. 从 Cloudflare KV 尝试读取后台修改后保存的账号密码
		const kv = (locals as any)?.runtime?.env?.ADMIN_KV || (globalThis as any)?.ADMIN_KV;

		let targetUsername = 'admin';    // 默认账号
		let targetPassword = 'admin123'; // 默认密码

		if (kv) {
			try {
				const savedAccount = await kv.get('admin_account_config');
				if (savedAccount) {
					const config = JSON.parse(savedAccount);
					if (config.username) targetUsername = config.username;
					if (config.password) targetPassword = config.password;
				}
			} catch (e) {
				console.warn('读取 KV 账号配置失败，回退默认账号密码:', e);
			}
		}

		// ⚡ 2. 校验账号和密码
		if (username === targetUsername && password === targetPassword) {
			// 写入与 login.astro 顶部一致的 Cookie Token
			cookies.set('admin_session', 'astro_admin_secure_session_token_2026', {
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
			JSON.stringify({ success: false, message: '请求解析异常' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};

// 2. 退出登录接口（清除 Cookie）
export const DELETE: APIRoute = async ({ cookies }) => {
	try {
		cookies.delete('admin_session', { path: '/' });

		return new Response(
			JSON.stringify({ success: true, message: '已安全退出登录' }),
			{ status: 200, headers: { 'Content-Type': 'application/json' } }
		);
	} catch (error) {
		return new Response(
			JSON.stringify({ success: false, message: '退出登录失败' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};
