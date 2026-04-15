import type { ReactNode } from 'react';
import styles from './PageHero.module.css';

interface PageHeroProps {
  label?: string;
  title: ReactNode;
  subtitle?: string;
  tone?: 'default' | 'warm' | 'dark';
  children?: ReactNode;
}

export function PageHero({ label, title, subtitle, tone = 'default', children }: PageHeroProps) {
  return (
    <header className={`${styles.hero} ${styles[tone]}`}>
      <div className={styles.backdrop} />
      <div className="container">
        <div className={styles.content}>
          {label && <span className="label">{label}</span>}
          <h1 className={styles.title}>{title}</h1>
          {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          {children}
        </div>
      </div>
    </header>
  );
}
