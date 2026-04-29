import { NextResponse } from 'next/server';

// When EDGE_CONFIG env var is set (Vercel Edge Config store), reads from there.
// Otherwise returns disabled so the banner never shows in dev/without config.
export async function GET() {
  try {
    const connectionString = process.env.EDGE_CONFIG;
    if (!connectionString) return NextResponse.json({ enabled: false });

    const { get } = await import('@vercel/edge-config');
    const promo = await get('promo');
    return NextResponse.json(promo ?? { enabled: false });
  } catch {
    return NextResponse.json({ enabled: false });
  }
}
