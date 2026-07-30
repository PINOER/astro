// src/pages/api/admin/media/upload.ts
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    if (!body.base64) {
      return new Response(JSON.stringify({ success: false, message: '未收到图片 Base64 数据' }), { status: 400 });
    }

    const base64Data = body.base64;
    const fileName = body.filename || `upload_${Date.now()}.webp`;

    // 尝试探测 Node.js 本地文件系统环境（非 Cloudflare Edge 运行时）
    try {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const cwd = process.cwd();
      const publicUploadsDir = path.resolve(cwd, 'public/uploads');

      if (!fs.existsSync(publicUploadsDir)) {
        fs.mkdirSync(publicUploadsDir, { recursive: true });
      }

      const rawData = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(rawData, 'base64');
      fs.writeFileSync(path.join(publicUploadsDir, fileName), buffer);

      return new Response(
        JSON.stringify({
          success: true,
          url: `/uploads/${fileName}`,
          filename: fileName
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } catch (edgeEnvError) {
      // ⚡ 如果在 Cloudflare Edge/Workers 环境下没有 fs 写入权限，降级直接返回 Base64 URL 渲染
      return new Response(
        JSON.stringify({
          success: true,
          url: base64Data,
          filename: fileName
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({
        success: false,
        message: '处理异常: ' + (error?.message || '未知错误')
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
