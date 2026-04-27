'use client';

import { useEffect, useRef } from 'react';
import { X, ArrowUpRight, Pizza, Fish, Utensils, GlassWater } from 'lucide-react';
import { MENU_ITEMS } from '@/content/menu';
import { WA_ORDER } from '@/content/config';
import styles from './OrderModal.module.css';

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  orderLabel: string;
  title?: string;
}

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Pizza:     <Pizza      size={14} strokeWidth={1.4} />,
  Mariscos:  <Fish       size={14} strokeWidth={1.4} />,
  Picaderas: <Utensils   size={14} strokeWidth={1.4} />,
  Drinks:    <GlassWater size={14} strokeWidth={1.4} />,
};

export function OrderModal({ open, onClose, orderLabel, title = 'Our Menu' }: OrderModalProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className={styles.backdrop}
      onClick={(e) => { if (e.target === backdropRef.current) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="order-modal-title"
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="order-modal-title" className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className={styles.grid}>
          {MENU_ITEMS.map((item) => (
            <a
              key={item.id}
              href={WA_ORDER(item.name)}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.card}
              onClick={onClose}
            >
              <div className={styles.cardImg}>
                {item.image
                  ? <img src={item.image} alt={item.name} />
                  : <span className={styles.cardIconPlaceholder}>{CATEGORY_ICONS[item.category]}</span>
                }
              </div>
              <div className={styles.cardBody}>
                <p className={styles.cardCategory}>
                  {CATEGORY_ICONS[item.category]} {item.category}
                </p>
                <p className={styles.cardName}>{item.name}</p>
                <p className={styles.cardPrice}>{item.price}</p>
              </div>
              <span className={styles.cardCta}>
                {orderLabel} <ArrowUpRight size={12} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
