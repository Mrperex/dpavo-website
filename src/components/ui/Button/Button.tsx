import type { ReactNode, AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';
import Link from 'next/link';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = {
  variant?: Variant;
  href?: string;
  external?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement> & AnchorHTMLAttributes<HTMLAnchorElement>, 'href'>;

export function Button({ variant = 'primary', href, external, children, className = '', ...props }: ButtonProps) {
  const cls = `${styles.btn} ${styles[variant]} ${className}`.trim();

  if (href) {
    if (external) {
      return <a href={href} className={cls} target="_blank" rel="noopener noreferrer" {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
    }
    return <Link href={href} className={cls} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</Link>;
  }

  return <button className={cls} {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}>{children}</button>;
}
