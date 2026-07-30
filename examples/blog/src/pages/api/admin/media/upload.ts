// src/pages/api/admin/media/upload.ts
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || !(file instanceof Blob)) {
      return new Response(JSON.stringify({ success: false, message: '未找到有效的上传文件' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. 获取二进制 Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 2. 生成文件名
    const rawName = (file as any).name || `upload_${Date.now()}.webp`;
    const fileName = rawName.endsWith('.webp') ? rawName : `${Date.now()}.webp`;

    // 3. 确定目标绝对目录 (public/uploads 与 src/assets)
    const cwd = process.cwd();
    const publicUploadsDir = path.resolve(cwd, 'public/uploads');
    const srcAssetsDir = path.resolve(cwd, 'src/assets');

    // 自动创建文件夹
    if (!fs.existsSync(publicUploadsDir)) {
      fs.mkdirSync(publicUploadsDir, { recursive: true });
    }
    if (!fs.existsSync(srcAssetsDir)) {
      fs.mkdirSync(srcAssetsDir, { recursive: true });
    }

    // 4. 双向落盘保存：public/uploads (便于前端实时预览) + src/assets (备用归档)
    const publicFilePath = path.join(publicUploadsDir, fileName);
    const srcFilePath = path.join(srcAssetsDir, fileName);

    fs.writeFileSync(publicFilePath, buffer);
    
    try {
      fs.writeFileSync(srcFilePath, buffer);
    } catch (e) {
      console.warn('写入 src/assets 失败，忽略并继续:', e);
    }

    // 5. 返回公开可被浏览器直接访问的静态相对路径
    const publicUrl = `/uploads/${fileName}`;

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
    console.error('媒体上传失败详情:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: '写入文件失败: ' + (error?.message || '未知错误')
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
