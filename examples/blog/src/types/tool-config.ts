// src/types/tool-config.ts

export interface ToolPresetParam {
  key: string;       // 参数 key，如 "defaultInterestRate" 或 "defaultDungeonDifficulty"
  label: string;     // 参数名称，如 "默认年化利率 (%)" 或 "默认初始难度"
  value: string | number | boolean; // 参数预设值
  type: 'text' | 'number' | 'boolean' | 'json'; // 类型
}

export interface ToolConfigItem {
  id: string;            // 唯一标识 (通常等同于 slug)
  name: string;          // 工具名称
  slug: string;          // URL路径，如 "compound-interest-fire-calculator"
  category: string;      // 对应分类ID/名称 (编程/金融/几何等)
  icon: string;          // 图标/Emoji，如 "📈" 或 "⚔️"
  astroComponent: string;// 对应 Astro 组件路径，如 "src/components/tools/FinanceCalc.astro"
  tags: string[];        // 独立标签数组 ["热门", "STEM", "计算器"]
  
  // 🟢 状态控制
  status: 'active' | 'disabled' | 'maintenance'; // 开启 | 关闭(404) | 维护中提示
  isNew: boolean;        // 新工具打标
  isFeatured: boolean;   // 首页/分类页推荐标记
  priority: number;      // 基础排序权重

  // ⚙️ 动态配置参数/预设场景
  presetParams: ToolPresetParam[];
  
  updatedAt: string;     // 最后修改时间
}
