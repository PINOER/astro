// src/pages/api/admin/articles.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'zh';

    // 1. 读取 Content Collections 博客列表
    const allPosts = await getCollection('blog');
    
    // 2. ⚡ 精准匹配子目录：匹配 id 以 "zh/" 或 "en/" 等开头的文章
    const filteredPosts = allPosts.filter((post) => {
      // id 格式例如: "zh/seo-tools-guide.md" 或 "en/seo-tools-guide.md"
      return post.id.startsWith(`${lang}/`) || post.data?.lang === lang;
    });

    // 3. 读取 Cloudflare KV 覆盖配置 (articles_v1_zh / en)
    let kvMap = new Map();
    const runtime = (locals as any).runtime;
    const kv = runtime?.env?.ADMIN_KV;
    
    if (kv) {
      const raw = await kv.get(`articles_v1_${lang}`);
      if (raw) {
        const list = JSON.parse(raw);
        list.forEach((item: any) => {
          if (item.id) kvMap.set(item.id, item);
        });
      }
    }

    // 4. 组装文章属性并正确计算纯 Slug 与前台 Preview URL
    const articles = filteredPosts.map((post) => {
      const kvData = kvMap.get(post.id) || {};
      
      // 去除语言前缀与文件扩展名，得到纯 Slug (例如 "zh/seo-guide.md" -> "seo-guide")
      const rawSlug = post.id.replace(new RegExp(`^${lang}/`), '');
      const cleanSlug = rawSlug.replace(/\.(md|mdx)$/, '').replace(/\/index$/, '');
      
      return {
        id: post.id,
        slug: cleanSlug,
        title: kvData.title || post.data.title || cleanSlug,
        description: kvData.description || post.data.description || '',
        category: kvData.category || post.data.category || '教程指南',
        relatedTool: kvData.relatedTool || (post.data as any).relatedTool || '',
        pubDate: post.data.pubDate ? new Date(post.data.pubDate).toISOString().slice(0, 10) : '',
        priority: kvData.priority !== undefined ? Number(kvData.priority) : ((post.data as any).priority || 0),
        pinned: kvData.pinned !== undefined ? Boolean(kvData.pinned) : Boolean((post.data as any).pinned || false),
        views: kvData.views !== undefined ? Number(kvData.views) : (kvData.views || 0),
        status: kvData.status || 'active',
        // 前台预览 URL 修正为 /blog/en/... 或 /blog/...
        url: `/blog/${cleanSlug}/`
      };
    });

    // 5. 按 Priority 降序与置顶排序
    articles.sort((a, b) => {
      if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
      return b.priority - a.priority;
    });

    return new Response(JSON.stringify({ success: true, data: articles }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ success: false, message: e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
