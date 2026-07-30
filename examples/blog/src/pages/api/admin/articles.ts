// src/pages/api/admin/articles.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'zh';

    const allPosts = await getCollection('blog');
    
    // 匹配 post.id 以 "${lang}/" 开头的文章
    const filteredPosts = allPosts.filter((post) => {
      return post.id.startsWith(`${lang}/`) || post.data?.lang === lang;
    });

    let kvMap = new Map();
    const runtime = (locals as any).runtime;
    const kv = runtime?.env?.ADMIN_KV || (globalThis as any)?.ADMIN_KV;
    
    if (kv) {
      const raw = await kv.get(`articles_v1_${lang}`);
      if (raw) {
        const list = JSON.parse(raw);
        list.forEach((item: any) => {
          if (item.id) kvMap.set(item.id, item);
          if (item.slug) kvMap.set(item.slug, item);
        });
      }
    }

    const articles = filteredPosts.map((post) => {
      // 提取纯 Slug (例如 "zh/compound-interest-fire-calculator.md" -> "compound-interest-fire-calculator")
      const cleanSlug = post.id
        .replace(new RegExp(`^${lang}/`), '')
        .replace(/\.(md|mdx)$/, '')
        .replace(/\/index$/, '');

      // 优先根据 id 查找，退而求其次用 cleanSlug
      const kvData = kvMap.get(post.id) || kvMap.get(cleanSlug) || {};

      // 前台预览 URL 统一使用标准的 /blog/${lang}/${cleanSlug}/
      const previewUrl = `/blog/${lang}/${cleanSlug}/`;

      // ⚡ 核心修复：优先使用 KV 存储的最新正文（含图片 Base64），其次使用本地 Markdown 正文
      let rawContent = kvData.content || post.body || '';

      return {
        id: post.id,
        slug: cleanSlug,
        title: kvData.title || post.data.title || cleanSlug,
        description: kvData.description || post.data.description || '',
        category: kvData.category || post.data.category || '教程指南',
        heroImage: kvData.heroImage || post.data.heroImage || '',
        relatedTool: kvData.relatedTool || (post.data as any).relatedTool || '',
        pubDate: post.data.pubDate ? new Date(post.data.pubDate).toISOString().slice(0, 10) : '',
        priority: kvData.priority !== undefined ? Number(kvData.priority) : ((post.data as any).priority || 0),
        pinned: kvData.pinned !== undefined ? Boolean(kvData.pinned) : Boolean((post.data as any).pinned || false),
        views: kvData.views !== undefined ? Number(kvData.views) : (kvData.views || 0),
        status: kvData.status || 'active',
        content: rawContent,
        url: previewUrl
      };
    });

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
