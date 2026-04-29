import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, date, time, guests, notes } = await req.json();

    if (!name || !phone || !date || !time || !guests) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const RESEND_KEY = process.env.RESEND_API_KEY;
    const STAFF_EMAIL = process.env.RESERVATIONS_EMAIL ?? 'reservas@dpavorestaurant.com';

    if (!RESEND_KEY) {
      // Dev mode: log and return success without sending
      console.log('[Reservation]', { name, phone, date, time, guests, notes });
      return NextResponse.json({ ok: true });
    }

    const body = `
Nueva reserva en D'Pavo Pizza

Nombre: ${name}
Teléfono: ${phone}
Fecha: ${date}
Hora: ${time}
Personas: ${guests}
${notes ? `Notas: ${notes}` : ''}
    `.trim();

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${RESEND_KEY}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: 'reservas@dpavorestaurant.com',
        to: [STAFF_EMAIL],
        subject: `Nueva Reserva — ${name} · ${date} ${time}`,
        text: body,
        reply_to: phone,
      }),
    });

    if (!res.ok) throw new Error(await res.text());
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[Reservation error]', err);
    return NextResponse.json({ error: 'Failed to send reservation' }, { status: 500 });
  }
}
