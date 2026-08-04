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
      title: "Google Search",
      desc: "Search Console tools and reports help you measure your site's Search traffic and performance, fix issues, and make your site shine in Google Search results.",
      url: "https://Google.com",
      type: 'sponsor',
      icon: "💎",
      tag: "AD",
      keywords: "Google Search",
      pinned: false,
      priority: 10
    }
  ],
  en: [
    {
      title: "Google Search",
      desc: "Search Console tools and reports help you measure your site's Search traffic and performance, fix issues, and make your site shine in Google Search results.",
      url: "https://Google.com",
      type: 'sponsor',
      icon: "💎",
      tag: "Sponsored",
      keywords: "Google Search",
      pinned: false,
      priority: 10
    }
  ]
};
