// src/pages/api/admin/media/upload.ts
import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    let buffer: Buffer;
    let fileName = `upload_${Date.now()}.webp`;

    const contentType = request.headers.get('content-type') || '';

    // 模式 A: Base64 JSON 上传 (100% 兼容所有 API 运行环境)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      if (!body.base64) {
        return new Response(JSON.stringify({ success: false, message: '未收到图片 Base64 数据' }), { status: 400 });
      }
      // 过滤 base64 头部声明
      const base64Data = body.base64.replace(/^data:image\/\w+;base64,/, '');
      buffer = Buffer.from(base64Data, 'base64');
      if (body.filename) fileName = body.filename;
    } 
    // 模式 B: FormData 表单上传
    else {
      const formData = await request.formData();
      const file = formData.get('file');
      if (!file) {
        return new Response(JSON.stringify({ success: false, message: 'FormData 未包含 file 字段' }), { status: 400 });
      }
      if (typeof file === 'string') {
        return new Response(JSON.stringify({ success: false, message: '上传的文件格式非法' }), { status: 400 });
      }
      const arrayBuffer = await (file as Blob).arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
      if ((file as any).name) fileName = (file as any).name;
    }

    // 确保文件名以 .webp 结尾
    if (!fileName.endsWith('.webp')) {
      fileName = `${Date.now()}.webp`;
    }

    // 目标存储目录：public/uploads (用于浏览器访问) 与 src/assets (同步备份)
    const cwd = process.cwd();
    const publicUploadsDir = path.resolve(cwd, 'public/uploads');
    const srcAssetsDir = path.resolve(cwd, 'src/assets');

    if (!fs.existsSync(publicUploadsDir)) fs.mkdirSync(publicUploadsDir, { recursive: true });
    if (!fs.existsSync(srcAssetsDir)) fs.mkdirSync(srcAssetsDir, { recursive: true });

    // 写入文件
    fs.writeFileSync(path.join(publicUploadsDir, fileName), buffer);
    try {
      fs.writeFileSync(path.join(srcAssetsDir, fileName), buffer);
    } catch (e) {
      console.warn('同步写入 src/assets 失败，忽略:', e);
    }

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
    console.error('媒体上传处理异常:', error);
    return new Response(
      JSON.stringify({
        success: false,
        message: '保存失败: ' + (error?.message || '未知错误')
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
