import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = "Eventos y Vida Nocturna — D'Pavo Pizza Verón";
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: '#0d0d0d', fontFamily: 'sans-serif', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse at 70% 40%, rgba(236,186,35,0.2) 0%, transparent 55%)',
        }} />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14, position: 'relative' }}>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.22em', color: '#ECBA23', textTransform: 'uppercase' }}>
            Vie & Sáb — Noche
          </div>
          <div style={{ fontSize: 80, fontWeight: 900, color: '#fff', letterSpacing: '-1px', lineHeight: 1 }}>
            NOCHE DE DJ
          </div>
          <div style={{ fontSize: 22, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.04em' }}>
            Karaoke · Sets en vivo · Eventos temáticos
          </div>
          <div style={{
            marginTop: 20, padding: '10px 28px', background: '#BD1F17',
            borderRadius: 8, fontSize: 16, fontWeight: 700, color: '#fff',
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>
            D&apos;Pavo Pizza — Verón, Punta Cana
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
