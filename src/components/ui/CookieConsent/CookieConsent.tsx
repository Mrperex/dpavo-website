'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import styles from './CookieConsent.module.css';

const STORAGE_KEY_V2 = 'dpavo-cookie-consent-v2';
const STORAGE_KEY_LEGACY = 'dpavo-cookie-consent';

interface ConsentPrefs {
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

function applyConsent(prefs: ConsentPrefs) {
  if (typeof window === 'undefined' || !window.gtag) return;
  window.gtag('consent', 'update', {
    analytics_storage: prefs.analytics ? 'granted' : 'denied',
    ad_storage: prefs.marketing ? 'granted' : 'denied',
    ad_user_data: prefs.marketing ? 'granted' : 'denied',
    ad_personalization: prefs.marketing ? 'granted' : 'denied',
    personalization_storage: prefs.preferences ? 'granted' : 'denied',
  });
}

export function CookieConsent() {
  const { t } = useLanguage();
  const cc = t.cookieConsent;
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [prefs, setPrefs] = useState<ConsentPrefs>({
    analytics: false,
    marketing: false,
    preferences: false,
  });

  useEffect(() => {
    const hasV2 = localStorage.getItem(STORAGE_KEY_V2);
    const hasLegacy = localStorage.getItem(STORAGE_KEY_LEGACY);
    if (!hasV2 && !hasLegacy) setVisible(true);
  }, []);

  const saveAndClose = (savedPrefs: ConsentPrefs) => {
    localStorage.setItem(STORAGE_KEY_V2, JSON.stringify(savedPrefs));
    applyConsent(savedPrefs);
    setVisible(false);
  };

  const acceptAll = () => saveAndClose({ analytics: true, marketing: true, preferences: true });
  const declineAll = () => saveAndClose({ analytics: false, marketing: false, preferences: false });
  const saveCustom = () => saveAndClose(prefs);

  const toggle = (key: keyof ConsentPrefs) => {
    setPrefs(p => ({ ...p, [key]: !p[key] }));
  };

  if (!visible) return null;

  return (
    <div className={styles.banner} role="dialog" aria-label="Cookie consent">
      <div className={styles.main}>
        <p className={styles.text}>
          {cc.text}{' '}
          <Link href="/about" className={styles.link}>{cc.learnMore}</Link>
        </p>

        {expanded && (
          <div className={styles.categories}>
            <label className={styles.catRow}>
              <span className={styles.catInfo}>
                <strong>Necesarias</strong>
                <span>Requeridas para que el sitio funcione.</span>
              </span>
              <input type="checkbox" checked disabled className={styles.check} />
            </label>
            <label className={styles.catRow}>
              <span className={styles.catInfo}>
                <strong>Analíticas</strong>
                <span>Google Analytics — páginas vistas, tráfico.</span>
              </span>
              <input type="checkbox" checked={prefs.analytics} onChange={() => toggle('analytics')} className={styles.check} />
            </label>
            <label className={styles.catRow}>
              <span className={styles.catInfo}>
                <strong>Marketing</strong>
                <span>Anuncios personalizados y retargeting.</span>
              </span>
              <input type="checkbox" checked={prefs.marketing} onChange={() => toggle('marketing')} className={styles.check} />
            </label>
            <label className={styles.catRow}>
              <span className={styles.catInfo}>
                <strong>Preferencias</strong>
                <span>Idioma y configuración personalizada.</span>
              </span>
              <input type="checkbox" checked={prefs.preferences} onChange={() => toggle('preferences')} className={styles.check} />
            </label>
          </div>
        )}

        <div className={styles.actions}>
          <button type="button" className={styles.customize} onClick={() => setExpanded(e => !e)}>
            {expanded ? 'Ocultar opciones' : 'Personalizar'}
          </button>
          {expanded
            ? <button type="button" className={styles.saveCustom} onClick={saveCustom}>Guardar</button>
            : <button type="button" className={styles.decline} onClick={declineAll}>{cc.decline}</button>
          }
          <button type="button" className={styles.accept} onClick={acceptAll}>{cc.accept}</button>
        </div>
      </div>
    </div>
  );
}
