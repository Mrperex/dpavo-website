import { NextResponse } from 'next/server';

// Vercel Cron: runs daily at 6am
// When GOOGLE_PLACES_API_KEY + GOOGLE_PLACE_ID are configured, fetches live reviews.
// Without keys, returns ok (noop) — existing static reviews stay unchanged.
export async function GET(req: Request) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ ok: true, note: 'No Places API key configured — skipping' });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,user_ratings_total,reviews&key=${apiKey}`;
    const res = await fetch(url, { cache: 'no-store' });
    const data = await res.json();

    if (data.status !== 'OK') throw new Error(data.status);

    const { rating, user_ratings_total } = data.result;
    return NextResponse.json({ ok: true, rating, reviewCount: user_ratings_total });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
