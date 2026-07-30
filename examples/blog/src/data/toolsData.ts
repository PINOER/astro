// src/data/toolsData.ts

export interface ToolItem {
	id: string;
	name: string;
	icon: string;
	category: string;
	description: string;
	url: string;
	defaultPriority: number;
}

// 1. 全局自动扫描所有工具页面文件的元数据（多重安全兼容）
export async function getAllScannedTools(): Promise<ToolItem[]> {
	// 自动读取 /src/pages/zh/tools/ 目录下的所有 .astro 文件
	const modules = import.meta.glob('/src/pages/zh/tools/*.astro', { eager: true });
	const tools: ToolItem[] = [];

	for (const path in modules) {
		const mod = modules[path] as any;
		
		// 兼容性检测：优先读取 toolInfo，其次读取 frontmatter
		const info = mod.toolInfo || mod.frontmatter || mod.default?.frontmatter;

		if (info && (info.id || info.name)) {
			// 自动解析文件路径作为 URL 兜底
			const fileName = path.split('/').pop()?.replace('.astro', '') || '';
			const fallbackUrl = `/zh/tools/${fileName}/`;

			tools.push({
				id: info.id || fileName,
				name: info.name || info.title || fileName,
				icon: info.icon || '🛠️',
				category: info.category || info.tag || '默认分类',
				description: info.description || '',
				url: info.url || fallbackUrl,
				defaultPriority: Number(info.defaultPriority || info.priority || 50),
			});
		}
	}

	return tools;
}

// 2. 供【后台】和【前台】调用的统一大联动获取函数
export async function getOrderedTools(locals: any): Promise<ToolItem[]> {
	// 自动获取全部真实扫描到的工具
	const masterTools = await getAllScannedTools();

	// 读取 Cloudflare KV 中的权重与状态覆盖配置
	let kvToolsConfig: Record<string, { priority: number; pinned: boolean; status: 'active' | 'disabled' }> = {};

	try {
		const runtime = locals?.runtime;
		const kv = runtime?.env?.ADMIN_KV;

		if (kv) {
			const saved = await kv.get('config_tools_v2', { type: 'json' });
			if (saved) {
				kvToolsConfig = saved as typeof kvToolsConfig;
			}
		}
	} catch (e) {
		console.error('读取 Cloudflare KV 失败，降级使用默认文件权重', e);
	}

	// 将自动化扫描到的列表与 KV 数据库合并
	const mergedTools = masterTools
		.map((tool) => {
			const kvData = kvToolsConfig[tool.id];
			return {
				...tool,
				priority: kvData?.priority !== undefined ? Number(kvData.priority) : tool.defaultPriority,
				pinned: kvData?.pinned !== undefined ? Boolean(kvData.pinned) : false,
				status: kvData?.status || 'active',
			};
		})
		.filter((tool) => tool.status === 'active'); // 过滤已下架的工具

	// 按 (置顶优先 -> 权重降序) 进行最终排序
	return mergedTools.sort((a, b) => {
		if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
		return b.priority - a.priority;
	});
}
