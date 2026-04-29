'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import styles from './PWAInstallPrompt.module.css';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'dpavo-pwa-dismissed';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Slight delay so it doesn't appear immediately on first visit
      setTimeout(() => setVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      localStorage.setItem(DISMISSED_KEY, '1');
    }
    setVisible(false);
    setDeferredPrompt(null);
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className={styles.prompt} role="complementary" aria-label="Instalar aplicación">
      <div className={styles.icon}>🍕</div>
      <div className={styles.copy}>
        <strong>Instala D&apos;Pavo</strong>
        <span>Acceso rápido desde tu pantalla de inicio</span>
      </div>
      <button type="button" className={styles.installBtn} onClick={install}>
        <Download size={14} />
        Instalar
      </button>
      <button type="button" className={styles.closeBtn} onClick={dismiss} aria-label="Cerrar">
        <X size={16} />
      </button>
    </div>
  );
}
