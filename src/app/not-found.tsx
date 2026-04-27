'use client';

import Link from 'next/link';
import { Pizza } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();
  const nf = t.notFound;

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '40px 24px',
        background: 'var(--background)',
        gap: 24,
      }}
    >
      <Pizza size={64} strokeWidth={1} style={{ color: 'var(--primary)', opacity: 0.8 }} />
      <p
        style={{
          fontFamily: 'var(--font-headlines), sans-serif',
          fontSize: 'clamp(6rem, 20vw, 12rem)',
          lineHeight: 1,
          color: 'var(--primary)',
          opacity: 0.15,
          fontWeight: 700,
          margin: 0,
        }}
        aria-hidden="true"
      >
        404
      </p>
      <h1
        style={{
          fontFamily: 'var(--font-headlines), sans-serif',
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          marginTop: -40,
        }}
      >
        {nf.title}
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '36ch', fontSize: '1.05rem', lineHeight: 1.65 }}>
        {nf.body}
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '14px 32px',
          background: 'var(--primary)',
          color: '#fff',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-labels), sans-serif',
          fontSize: '0.78rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.12em',
          textDecoration: 'none',
          marginTop: 8,
        }}
      >
        {nf.cta}
      </Link>
    </main>
  );
}
