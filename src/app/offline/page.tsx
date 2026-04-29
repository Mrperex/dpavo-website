export default function OfflinePage() {
  return (
    <main id="main-content" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '100vh', gap: 16, padding: '0 24px', background: 'var(--bg)', textAlign: 'center',
    }}>
      <span style={{ fontSize: '3rem' }}>🍕</span>
      <h1 style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '2rem', color: 'var(--text)', textTransform: 'uppercase' }}>
        Sin conexión
      </h1>
      <p style={{ color: 'var(--text-muted)', maxWidth: 380 }}>
        Parece que no tienes internet. Vuelve cuando tengas señal — la pizza te espera.
      </p>
      <a href="/" style={{
        marginTop: 12, display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '12px 28px', background: 'var(--red)', color: '#fff',
        borderRadius: 'var(--radius-sm)', fontFamily: 'var(--font-display), sans-serif',
        fontWeight: 700, fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase',
        textDecoration: 'none',
      }}>
        Intentar de nuevo
      </a>
    </main>
  );
}
