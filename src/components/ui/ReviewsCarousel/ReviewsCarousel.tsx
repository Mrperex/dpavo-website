'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { REVIEWS } from '@/content/reviews';
import { useLanguage } from '@/context/LanguageContext';
import styles from './ReviewsCarousel.module.css';

function StarRating({ count }: { count: number }) {
  return (
    <div className={styles.stars} aria-label={`${count} de 5 estrellas`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className={i < count ? styles.starFilled : styles.starEmpty} fill={i < count ? 'currentColor' : 'none'} />
      ))}
    </div>
  );
}

export function ReviewsCarousel() {
  const { t, lang } = useLanguage();
  const [idx, setIdx] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const prev = () => setIdx(i => (i - 1 + REVIEWS.length) % REVIEWS.length);
  const next = () => setIdx(i => (i + 1) % REVIEWS.length);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  const resetTimer = (fn: () => void) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    fn();
    intervalRef.current = setInterval(next, 5000);
  };

  const review = REVIEWS[idx];
  const quote = lang === 'es' ? review.quoteEs : review.quoteEn;

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="label">{t.reviews.label}</span>
          <h2>{t.reviews.title}</h2>
        </div>

        <div className={styles.card} aria-live="polite">
          <StarRating count={review.stars} />
          <blockquote className={styles.quote}>&ldquo;{quote}&rdquo;</blockquote>
          <div className={styles.author}>
            <span className={styles.name}>{review.nameEn}</span>
            <span className={styles.location}>{review.location}</span>
          </div>
        </div>

        <div className={styles.controls}>
          <button type="button" className={styles.arrow} onClick={() => resetTimer(prev)} aria-label="Reseña anterior">
            <ChevronLeft size={18} />
          </button>
          <div className={styles.dots}>
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`${styles.dot} ${i === idx ? styles.dotActive : ''}`}
                onClick={() => resetTimer(() => setIdx(i))}
                aria-label={`Reseña ${i + 1}`}
              />
            ))}
          </div>
          <button type="button" className={styles.arrow} onClick={() => resetTimer(next)} aria-label="Siguiente reseña">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
