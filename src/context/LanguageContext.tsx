'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { en } from '@/content/en';
import { es } from '@/content/es';
import type { Content } from '@/content/en';

export type Lang = 'en' | 'es';

interface LanguageContextValue {
  lang: Lang;
  t: Content;
  toggle: () => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'es',
  t: es,
  toggle: () => {},
});

const STORAGE_KEY = 'dpavo-lang';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === 'en' || stored === 'es') setLang(stored);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'en' ? 'en' : 'es';
    }
  }, [lang]);

  const t = lang === 'en' ? en : es;
  const toggle = () => setLang((l) => {
    const next = l === 'en' ? 'es' : 'en';
    localStorage.setItem(STORAGE_KEY, next);
    return next;
  });

  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
