import type { APIRoute } from 'astro';

export const prerender = false;

const SESSION_TOKEN = 'astro_admin_secure_session_token_2026';

export const PUT: APIRoute = async ({ request, cookies }) => {
	const session = cookies.get('admin_session')?.value;

	if (session !== SESSION_TOKEN) {
		return new Response(JSON.stringify({ success: false, message: '未授权访问' }), {
			status: 403,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	try {
		const body = await request.json();
		const { id, priority, pinned, status } = body;

		// 模拟更新操作，实际项目中在此更新数据库或写入配置 JSON
		console.log(`[API Update Tool] ID: ${id}, Priority: ${priority}, Pinned: ${pinned}, Status: ${status}`);

		return new Response(JSON.stringify({ success: true, message: '工具状态与排序配置更新成功' }), {
			status: 200,
			headers: { 'Content-Type': 'application/json' }
		});
	} catch {
		return new Response(JSON.stringify({ success: false, message: '服务器处理请求失败' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
