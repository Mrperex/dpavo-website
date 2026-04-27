import { NextResponse } from 'next/server';

const TOKEN = process.env.INSTAGRAM_ACCESS_TOKEN;
const LIMIT = 20;

export interface InstaPost {
  id: string;
  media_url: string;
  thumbnail_url?: string;
  permalink: string;
  caption?: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
}

export async function GET() {
  if (!TOKEN) {
    return NextResponse.json({ error: 'INSTAGRAM_ACCESS_TOKEN not set' }, { status: 503 });
  }

  try {
    const url = `https://graph.instagram.com/me/media?fields=id,caption,media_url,thumbnail_url,permalink,media_type&limit=${LIMIT}&access_token=${TOKEN}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      const body = await res.text();
      return NextResponse.json({ error: 'Instagram API error', detail: body }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json(data.data as InstaPost[]);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch Instagram posts' }, { status: 500 });
  }
}
