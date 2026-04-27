'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import { useScrolled } from '@/hooks/useScrolled';
import { WA_GENERAL } from '@/content/config';
import { MagneticButton } from '@/components/animations/MagneticButton';
import styles from './Navbar.module.css';

const WA_ICON = (
  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

export default function Navbar() {
  const { t, toggle } = useLanguage();
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.wrapper}>

          {/* Logo — left */}
          <Link href="/" className={styles.logo} onClick={() => setOpen(false)}>
            <Image src="/media/Logo Pavo Nav Bar.svg" alt="D'Pavo Pizza" width={966} height={386} className={styles.logoImg} />
          </Link>

          {/* Nav links — center */}
          <ul className={styles.links}>
            {([
              ['/', t.nav.home],
              ['/menu', t.nav.menu],
              ['/events', t.nav.events],
              ['/about', t.nav.about],
              ['/gallery', t.nav.gallery],
              ['/contact', t.nav.contact],
            ] as [string, string][]).map(([href, label]) => (
              <li key={href}>
                <Link
                  href={href}
                  className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Actions — right */}
          <div className={styles.actions}>
            <a href={WA_GENERAL} className={styles.waPhone} target="_blank" rel="noopener noreferrer">
              <Phone size={13} /> (829) 753-1995
            </a>
            <MagneticButton>
              <a href={WA_GENERAL} className={styles.orderBtn} target="_blank" rel="noopener noreferrer">
                <span className={styles.orderBtnPulse} />
                <span className={styles.orderBtnPulse2} />
                {WA_ICON} {t.nav.order}
              </a>
            </MagneticButton>
            <button className={styles.langBtn} onClick={toggle} aria-label="Toggle language">
              {t.nav.lang}
            </button>
            <button
              className={`${styles.hamburger} ${open ? styles.hamburgerOpen : ''}`}
              aria-label="Toggle menu"
              onClick={() => setOpen(v => !v)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>

        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}>
        <ul className={styles.drawerLinks}>
          {([
            ['/', t.nav.home],
            ['/menu', t.nav.menu],
            ['/events', t.nav.events],
            ['/about', t.nav.about],
            ['/gallery', t.nav.gallery],
            ['/contact', t.nav.contact],
          ] as [string, string][]).map(([href, label]) => (
            <li key={href}>
              <Link
                href={href}
                className={`${styles.navLink} ${pathname === href ? styles.active : ''}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
        <div className={styles.drawerActions}>
          <button className={styles.langBtn} onClick={toggle}>{t.nav.lang}</button>
          <MagneticButton>
            <a href={WA_GENERAL} className={styles.orderBtn} target="_blank" rel="noopener noreferrer">
              {WA_ICON} {t.nav.order}
            </a>
          </MagneticButton>
        </div>
      </div>

      {open && <div className={styles.overlay} onClick={() => setOpen(false)} />}
    </>
  );
}
