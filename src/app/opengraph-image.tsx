import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "D'Pavo Pizza — Pizzería Urbana Tropical Verón Punta Cana";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#1a0a08',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Red gradient accent */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 20% 50%, rgba(189,31,23,0.4) 0%, transparent 60%)',
        }} />
        {/* Gold accent */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 80% 30%, rgba(236,186,35,0.15) 0%, transparent 50%)',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, position: 'relative' }}>
          <div style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: '#ECBA23',
          }}>
            Verón, Punta Cana · República Dominicana
          </div>
          <div style={{
            fontSize: 96,
            fontWeight: 900,
            color: '#FFFFFF',
            letterSpacing: '-2px',
            lineHeight: 1,
          }}>
            D&apos;PAVO
          </div>
          <div style={{
            fontSize: 28,
            fontWeight: 400,
            color: 'rgba(255,255,255,0.65)',
            letterSpacing: '0.05em',
          }}>
            Pizza · Mariscos · Vida Nocturna
          </div>
          <div style={{
            marginTop: 24,
            padding: '12px 32px',
            background: '#BD1F17',
            borderRadius: 8,
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            Ordena por WhatsApp
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
