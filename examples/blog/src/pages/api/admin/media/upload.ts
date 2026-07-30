// src/pages/api/admin/media/upload.ts
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return new Response(JSON.stringify({ success: false, message: '未找到上传的文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. 获取上传文件数据 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. 确定保存的目标绝对路径 (examples/blog/src/assets)
    const fileName = file.name || `${Date.now()}.webp`;
    
    // 兼容本地开发环境与生产路径
    const targetDir = path.resolve(process.cwd(), 'src/assets');
    
    // 确保 assets 目录存在
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    const filePath = path.join(targetDir, fileName);

    // 3. 将文件写入本地磁盘 src/assets 目录
    fs.writeFileSync(filePath, buffer);

    // 4. 返回前端 Markdown 引入的相对资源路径 (Astro 推荐使用的 ~assets/ 或相对路径)
    // 在 Astro Markdown 中可以渲染成 /src/assets/文件名
    const publicUrl = `/src/assets/${fileName}`;

    return new Response(
      JSON.stringify({
        success: true,
        url: publicUrl,
        filename: fileName
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error: any) {
    console.error('上传图片至 src/assets 失败:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: '写入文件失败: ' + error.message
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
