// src/pages/api/admin/articles.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const prerender = false;

// ⚡ 自动化扫描原生 MD/MDX 文件内容
const rawBlogFiles = import.meta.glob('/src/content/blog/**/*.{md,mdx}', { query: '?raw', eager: true });

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    const url = new URL(request.url);
    const lang = url.searchParams.get('lang') || 'zh';

    // 1. 读取 Astro Content Collection 博客数据
    const allPosts = await getCollection('blog');
    
    // 2. 匹配对应语言目录下的文章 (例如 id 为 "zh/seo-tools.md" 或 "en/seo-tools.md")
    const filteredPosts = allPosts.filter((post) => {
      return post.id.startsWith(`${lang}/`) || post.data?.lang === lang;
    });

    // 3. 读取 Cloudflare KV 中的自定义属性覆写
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

    // 4. 组装文章完整属性（含 Markdown 真实正文）
    const articles = filteredPosts.map((post) => {
      const kvData = kvMap.get(post.id) || {};
      
      // 提取纯字符 Slug (例如 "zh/seo-tools.md" -> "seo-tools")
      const cleanSlug = post.id
        .replace(new RegExp(`^${lang}/`), '')
        .replace(/\.(md|mdx)$/, '')
        .replace(/\/index$/, '');
      
      // ⚡ 核心修复：获取完整的 Markdown Raw 源码正文
      let rawContent = post.body || '';
      
      // 如果 post.body 缺失，通过 import.meta.glob 读取绝对文件内容
      if (!rawContent) {
        const matchingPath = Object.keys(rawBlogFiles).find(p => p.includes(post.id));
        if (matchingPath && (rawBlogFiles[matchingPath] as any)?.default) {
          rawContent = (rawBlogFiles[matchingPath] as any).default;
        }
      }

      const previewUrl = `/${lang}/blog/${cleanSlug}/`;

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
        content: rawContent, // 👈 关键修复：传输完整正文给编辑器
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
