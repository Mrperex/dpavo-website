'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './PromoBanner.module.css';

interface PromoConfig {
  enabled: boolean;
  text: string;
  cta?: string;
  ctaHref?: string;
  bgColor?: string;
}

export function PromoBanner() {
  const [promo, setPromo] = useState<PromoConfig | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Fetch from Edge Config API route (avoids exposing connection string client-side)
    fetch('/api/promo')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data?.enabled) setPromo(data); })
      .catch(() => {});
  }, []);

  if (!promo || dismissed) return null;

  return (
    <div className={styles.banner} style={promo.bgColor ? { background: promo.bgColor } : {}}>
      <span className={styles.text}>
        {promo.text}
        {promo.cta && promo.ctaHref && (
          <a href={promo.ctaHref} className={styles.cta} target="_blank" rel="noopener noreferrer">
            {promo.cta}
          </a>
        )}
      </span>
      <button type="button" className={styles.close} onClick={() => setDismissed(true)} aria-label="Cerrar">
        <X size={14} />
      </button>
    </div>
  );
}
