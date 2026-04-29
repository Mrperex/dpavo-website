'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';

export interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  label?: string;
  title?: string;
  items: FAQItem[];
}

export function FAQ({ label = 'FAQ', title = 'Preguntas Frecuentes.', items }: FAQProps) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="label">{label}</span>
          <h2>{title}</h2>
        </div>
        <div className={styles.list} role="list">
          {items.map((item, i) => (
            <div key={i} className={styles.item} role="listitem">
              <button
                type="button"
                className={styles.question}
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={18}
                  className={`${styles.icon} ${open === i ? styles.iconOpen : ''}`}
                  aria-hidden="true"
                />
              </button>
              {open === i && (
                <div className={styles.answer}>
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
