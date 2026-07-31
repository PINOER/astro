// src/pages/api/admin/articles/save.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const body = await request.json();
    const { id, lang, slug, title, heroImage, relatedTool, content } = body;

    if (!id || !slug || !title) {
      return new Response(
        JSON.stringify({ success: false, message: '缺少必填字段 (id, slug, title)' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const currentLang = lang || 'zh';
    
    // 多环境容错提取 KV 实例
    const runtime = (locals as any)?.runtime;
    const kv = runtime?.env?.ADMIN_KV || (globalThis as any)?.ADMIN_KV;

    // 1. 保存到 Cloudflare KV 缓存覆盖层 (支持实时跨节点渲染)
    if (kv) {
      // 获取当前语言下的配置列表
      const rawConfig = await kv.get(`articles_v1_${currentLang}`);
      let articlesList = rawConfig ? JSON.parse(rawConfig) : [];

      // 查找现有的配置项或创建新记录
      const existingIndex = articlesList.findIndex(
        (item: any) => item.id === id || item.slug === slug
      );

      const updatedArticleData = {
        id: id,
        slug: slug,
        title: title,
        heroImage: heroImage || '', // ⚡ 成功持久化保存封面图链接/Base64
        relatedTool: relatedTool || '',
        content: content,
        updatedAt: new Date().toISOString()
      };

      if (existingIndex > -1) {
        // 合并更新，保留已设定的权重/阅读量/置顶状态
        articlesList[existingIndex] = {
          ...articlesList[existingIndex],
          ...updatedArticleData
        };
      } else {
        articlesList.push(updatedArticleData);
      }

      // 写回 Cloudflare KV 数据库
      await kv.put(`articles_v1_${currentLang}`, JSON.stringify(articlesList));
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: '文章保存成功',
        data: { id, slug, title, heroImage }
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    console.error('保存文章接口抛出错误:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: '保存失败: ' + (error?.message || '服务器内部错误')
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
