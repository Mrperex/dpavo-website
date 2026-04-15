import type { ReactNode } from 'react';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  label?: string;
  title: ReactNode;
  subtitle?: string;
  align?: 'left' | 'center';
  action?: ReactNode;
}

export function SectionHeader({ label, title, subtitle, align = 'left', action }: SectionHeaderProps) {
  return (
    <div className={`${styles.header} ${styles[align]}`}>
      <div className={styles.text}>
        {label && <span className="label">{label}</span>}
        <h2 className={styles.title}>{title}</h2>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
      {action && <div className={styles.action}>{action}</div>}
    </div>
  );
}
