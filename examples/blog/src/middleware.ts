import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware(async (context, next) => {
	const url = new URL(context.request.url);

	// 拦截所有以 /admin 开头的路由（除登录接口和登录页外）
	if (url.pathname.startsWith('/admin') && !url.pathname.startsWith('/admin/login')) {
		// 获取认证 Cookie（需替换为你项目真实的 Cookie 名称，如 admin_session 或 auth_token）
		const authCookie = context.cookies.get('admin_session');

		// 💡 关键操作：如果未登录，直接返回 404 状态码
		// 这会让黑客和 Google 爬虫误以为该后台路径根本不存在！
		if (!authCookie || !authCookie.value) {
			return new Response('404 Not Found', {
				status: 404,
				headers: { 'Content-Type': 'text/plain; charset=utf-8' }
			});

			// 如果你希望直接重定向到登录页，可以使用下面这行（但更推荐 404 防爬虫）：
			// return context.redirect('/admin/login');
		}
	}

	return next();
});
