import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type BadgeColor = 'default' | 'red' | 'teal' | 'yellow';

interface BadgeProps {
  children: ReactNode;
  color?: BadgeColor;
}

export function Badge({ children, color = 'default' }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[color]}`}>{children}</span>;
}
