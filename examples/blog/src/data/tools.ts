export interface SponsorItem {
  title: string;
  desc: string;
  url: string;
  type: 'sponsor';
  icon: string;
  tag: string;
  keywords: string;
  pinned: boolean;
  priority: number;
}

export const sponsorItems: Record<string, SponsorItem[]> = {
  zh: [
    {
      title: "定制独立站开发服务",
      desc: "专业 Shopify / 独立站定制开发与 AI 搜索优化（GEO），为您的品牌流量提速。",
      url: "https://lunchoon.com",
      type: 'sponsor',
      icon: "💎",
      tag: "赞助推广",
      keywords: "shopify 独立站 开发 优化 赞助",
      pinned: true,
      priority: 100
    }
  ],
  en: [
    {
      title: "Custom E-Commerce & Storefront Dev",
      desc: "Expert Shopify development and GEO optimization services to scale your online brand.",
      url: "https://lunchoon.com",
      type: 'sponsor',
      icon: "💎",
      tag: "Sponsored",
      keywords: "shopify development store optimization sponsor",
      pinned: true,
      priority: 100
    }
  ]
};
