'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
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

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('es');
  const t = lang === 'en' ? en : es;
  const toggle = () => setLang((l) => (l === 'en' ? 'es' : 'en'));

  return (
    <LanguageContext.Provider value={{ lang, t, toggle }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
