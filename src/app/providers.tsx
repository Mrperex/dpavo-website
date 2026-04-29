// src/app/providers.tsx
'use client';

import { useEffect } from 'react';
import { LanguageProvider } from '@/context/LanguageContext';
import { ThemeProvider } from '@/context/ThemeContext';
import type { ReactNode } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Respect prefers-reduced-motion: skip smooth scrolling entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const onLoad = () => ScrollTrigger.refresh();
      if (document.readyState === 'complete') onLoad();
      else window.addEventListener('load', onLoad);
      return () => window.removeEventListener('load', onLoad);
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    const onRaf = (time: number) => lenis.raf(time * 1000);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === 'complete') {
      onLoad();
    } else {
      window.addEventListener('load', onLoad);
    }
    void document.fonts?.ready.then(onLoad);

    return () => {
      window.removeEventListener('load', onLoad);
      lenis.off('scroll', ScrollTrigger.update);
      lenis.destroy();
      gsap.ticker.remove(onRaf);
    };
  }, []);

  return <ThemeProvider><LanguageProvider>{children}</LanguageProvider></ThemeProvider>;
}
