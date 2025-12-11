import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const VIDEO_DIR = path.join(process.cwd(), '..', 'ai-engine', 'datasets', 'videos');

function resolvePath(file: string) {
  const normal = path.normalize(file).replace(/^(\.\.[/\\])+/, '');
  const full = path.join(VIDEO_DIR, normal);
  if (!full.startsWith(VIDEO_DIR)) {
    throw new Error('invalid_path');
  }
  return full;
}

export async function GET(req: NextRequest) {
  const file = req.nextUrl.searchParams.get('file');
  if (!file) {
    return NextResponse.json({ error: 'file query param required' }, { status: 400 });
  }

  let target: string;
  try {
    target = resolvePath(file);
  } catch {
    return NextResponse.json({ error: 'invalid file path' }, { status: 400 });
  }

  if (!fs.existsSync(target) || !fs.statSync(target).isFile()) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 });
  }

  const stat = fs.statSync(target);
  const range = req.headers.get('range');

  if (range) {
    const [startStr, endStr] = range.replace(/bytes=/, '').split('-');
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : stat.size - 1;
    const chunkSize = end - start + 1;

    const stream = fs.createReadStream(target, { start, end });
    return new NextResponse(stream as any, {
      status: 206,
      headers: {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize.toString(),
        'Content-Type': 'video/mp4',
      },
    });
  }

  const stream = fs.createReadStream(target);
  return new NextResponse(stream as any, {
    headers: {
      'Content-Length': stat.size.toString(),
      'Content-Type': 'video/mp4',
      'Cache-Control': 'public, max-age=60',
    },
  });
}



