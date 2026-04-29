'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: false,
        digest: error.digest,
      });
    }
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0a0a0a',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        textAlign: 'center',
        gap: 16,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', textTransform: 'uppercase', letterSpacing: '-0.02em', color: '#ECBA23' }}>
        Algo salió mal
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: 480, lineHeight: 1.65 }}>
        Tuvimos un problema cargando esta página. Intenta de nuevo, o vuelve al inicio.
      </p>
      <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
        <button
          type="button"
          onClick={reset}
          style={{
            background: '#BD1F17',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 6,
            border: 'none',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          Intentar de nuevo
        </button>
        <Link
          href="/"
          style={{
            background: 'transparent',
            color: '#fff',
            padding: '12px 28px',
            borderRadius: 6,
            border: '2px solid rgba(255,255,255,0.4)',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            fontSize: '0.85rem',
          }}
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
