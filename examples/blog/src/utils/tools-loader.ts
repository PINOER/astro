// src/utils/tools-loader.ts

export interface ToolConfig {
  slug: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  priority: number;
  status: 'active' | 'disabled' | 'maintenance';
  seoTitle?: string;
  seoDescription?: string;
}

/**
 * ⚡ 在前台 SSR 渲染时获取对应语言下的工具全量配置（优先读取 Cloudflare KV，其次读取本地默认元数据）
 */
export async function getToolsList(locals: any, lang: string = 'zh'): Promise<ToolConfig[]> {
  try {
    const kv = locals?.runtime?.env?.ADMIN_KV;
    if (kv) {
      const kvKey = `config_tools_v2_${lang}`;
      const raw = await kv.get(kvKey);
      if (raw) {
        const list: ToolConfig[] = JSON.parse(raw);
        // 过滤掉已被禁用的工具 (status === 'disabled')
        return list.filter(t => t.status !== 'disabled');
      }
    }
  } catch (e) {
    console.error('前台读取 Cloudflare KV 工具列表失败:', e);
  }

  return [];
}
