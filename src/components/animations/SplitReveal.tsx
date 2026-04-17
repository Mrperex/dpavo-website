'use client';

import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import 'splitting/dist/splitting.css';

gsap.registerPlugin(ScrollTrigger);

type Tag = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';

interface SplitRevealProps {
  children: React.ReactNode;
  as?: Tag;
  by?: 'chars' | 'words';
  stagger?: number;
  y?: number;
  duration?: number;
  ease?: string;
  start?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function SplitReveal({
  children,
  as: Tag = 'div',
  by = 'words',
  stagger = 0.05,
  y = 60,
  duration = 0.8,
  ease = 'power3.out',
  start = 'top 82%',
  className,
  style,
}: SplitRevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP((_ctx, contextSafe) => {
    const el = ref.current;
    if (!el || !contextSafe) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    import('splitting')
      .then(({ default: Splitting }) => {
        if (!ref.current) return;
        const runAnim = contextSafe(() => {
          const [result] = Splitting({ target: el, by });
          const targets = by === 'chars' ? result.chars : result.words;
          if (!targets || targets.length === 0) return;
          gsap.from(targets, {
            y,
            opacity: 0,
            stagger,
            duration,
            ease,
            scrollTrigger: { trigger: el, start },
          });
          ScrollTrigger.refresh();
        });
        runAnim();
      })
      .catch((err) => console.error('[SplitReveal] failed to load splitting:', err));
  }, { scope: ref });

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={className}
      style={style}
    >
      {children}
    </Tag>
  );
}
