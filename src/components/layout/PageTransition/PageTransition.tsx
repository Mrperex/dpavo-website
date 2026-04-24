'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import gsap from 'gsap';
import styles from './PageTransition.module.css';

export function PageTransition() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return; }
    const overlay = overlayRef.current;
    if (!overlay || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.timeline()
      .set(overlay, { clipPath: 'inset(100% 0 0% 0)', visibility: 'visible' })
      .to(overlay,  { clipPath: 'inset(0% 0 0% 0)',   duration: 0.38, ease: 'power3.inOut' })
      .to(overlay,  { clipPath: 'inset(0% 0 100% 0)', duration: 0.38, ease: 'power3.inOut', delay: 0.05 })
      .set(overlay, { visibility: 'hidden' });
  }, [pathname]);

  return <div ref={overlayRef} className={styles.overlay} aria-hidden="true" />;
}
