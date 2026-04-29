import { NextResponse } from 'next/server';

// Vercel Cron: runs daily at 4am to revalidate sitemap cache
export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';
    await fetch(`${siteUrl}/sitemap.xml`, { cache: 'no-store' });
    return NextResponse.json({ ok: true, refreshed: new Date().toISOString() });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
