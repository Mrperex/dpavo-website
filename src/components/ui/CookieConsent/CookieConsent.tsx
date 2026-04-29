'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './CookieConsent.module.css';

const STORAGE_KEY = 'dpavo-cookie-consent';

export function CookieConsent() {
  const { t } = useLanguage();
  const cc = t.cookieConsent;
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    setVisible(false);
    // Fire GA4 now that consent is given
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted',
      });
    }
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <p className={styles.text}>
        {cc.text}{' '}
        <Link href="/about" className={styles.link}>{cc.learnMore}</Link>
      </p>
      <div className={styles.actions}>
        <button className={styles.decline} onClick={decline}>{cc.decline}</button>
        <button className={styles.accept} onClick={accept}>{cc.accept}</button>
      </div>
    </div>
  );
}
