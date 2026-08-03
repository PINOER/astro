// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://helpmini.com',
	
	// ⚡【关键新增 1】：开启服务端/SSR 动态渲染模式
	// 只有开启了 'server' 或 'hybrid'，/api/ 接口才会变成真正的后端动态 API 端点！
	output: 'server',

	// ⚡【关键修改 2】：配置 Cloudflare 适配器并启用平台代理
	adapter: cloudflare({
		platformProxy: {
			enabled: true, // 允许在开发和构建层继承 Cloudflare 的 KV 绑定上下文
		},
	}),

	integrations: [mdx(), sitemap()],
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Atkinson',
			cssVariable: '--font-atkinson',
			fallbacks: ['sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/atkinson-regular.woff'],
						weight: 400,
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/atkinson-bold.woff'],
						weight: 700,
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});
