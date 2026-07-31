import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals, cookies }) => {
	// 验证 session
	const session = cookies.get('admin_session')?.value;
	if (session !== 'astro_admin_secure_session_token_2026') {
		return new Response(JSON.stringify({ success: false, message: '未授权访问' }), { status: 401 });
	}

	try {
		const { newUsername, newPassword } = await request.json();

		if (!newUsername || !newPassword) {
			return new Response(JSON.stringify({ success: false, message: '账号和密码不能为空' }), { status: 400 });
		}

		const kv = (locals as any)?.runtime?.env?.ADMIN_KV || (globalThis as any)?.ADMIN_KV;

		if (kv) {
			// 写入 Cloudflare KV 保存最新的账号和密码
			await kv.put('admin_account_config', JSON.stringify({
				username: newUsername,
				password: newPassword,
				updatedAt: new Date().toISOString()
			}));

			return new Response(JSON.stringify({ success: true, message: '账号密码修改成功，下次登录生效' }), { status: 200 });
		} else {
			return new Response(JSON.stringify({ success: false, message: '未找到 Cloudflare KV 绑定服务' }), { status: 500 });
		}
	} catch (e) {
		return new Response(JSON.stringify({ success: false, message: '修改失败' }), { status: 500 });
	}
};
