import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request, env }) => {
    try {
        const body = await request.json();
        const { type, email, content } = body;

        const id = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const feedbackData = {
            id,
            type,
            email,
            content,
            createdAt: new Date().toISOString()
        };

        // 存入 Cloudflare KV (假设你在 Cloudflare 绑定的 KV 变量名为 HELPMINI_KV)
        if (env?.HELPMINI_KV) {
            await env.HELPMINI_KV.put(`feedback:${id}`, JSON.stringify(feedbackData));
        }

        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (e) {
        return new Response(JSON.stringify({ error: 'Server Error' }), { status: 500 });
    }
};
