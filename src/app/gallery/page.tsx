'use client';

import { useState } from 'react';
import Image from 'next/image';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { Badge } from '@/components/ui/Badge/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_GENERAL } from '@/content/config';
import { GALLERY_ITEMS } from '@/content/gallery';
import { ClipReveal } from '@/components/animations';
import { InstagramEmbed } from 'react-social-media-embed';
import { X } from 'lucide-react';
import { INSTAGRAM_POSTS } from '@/content/instagram';
import styles from './gallery.module.css';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [active, setActive] = useState<string>('All');
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [gridRef, gridInView] = useInView<HTMLDivElement>();

  const cats = ['All', 'Food', 'Venue', 'Events']; // internal filter keys

  const filtered = active === 'All'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((i) => i.category === active);

  const lightboxItem = lightbox !== null ? GALLERY_ITEMS.find((i) => i.id === lightbox) : null;

  return (
    <main>
      <Navbar />

      <PageHero
        label={t.galleryPage.label}
        title={<>{t.galleryPage.title.replace('.', '')} <span style={{ color: 'var(--primary)' }}>.</span></>}
        subtitle={t.galleryPage.subtitle}
        tone="dark"
      >
        <div className={styles.cats}>
          {cats.map((cat, i) => (
            <button
              key={cat}
              className={`${styles.catBtn} ${active === cat ? styles.active : ''}`}
              onClick={() => setActive(cat)}
            >
              {t.galleryPage.categories[i]}
            </button>
          ))}
        </div>
      </PageHero>

      <section className={styles.gridSection}>
        <div className="container">
          <ClipReveal start="top 90%" duration={1.1}>
          <div ref={gridRef} className={styles.masonry}>
            {filtered.map((item, i) => (
              <div
                key={item.id}
                className={`${styles.item} animate-in ${gridInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
                onClick={() => setLightbox(item.id)}
              >
                {item.src
                  ? <Image src={item.src} alt={item.alt} width={800} height={600} className={styles.img} />
                  : <div className={`${styles.placeholder} ${styles[item.tone]}`} />
                }
                <div className={styles.overlay}>
                  <Badge>{item.category}</Badge>
                  <p>{item.alt}</p>
                </div>
              </div>
            ))}
          </div>
          </ClipReveal>
        </div>
      </section>

      {/* Instagram feed */}
      {INSTAGRAM_POSTS.some((url) => !url.includes('REPLACE_WITH')) && (
        <section className={styles.instaSection}>
          <div className="container">
            <p className={styles.instaLabel}>@dpavo_pizzeria_y_restaurante</p>
            <div className={styles.instaGrid}>
              {INSTAGRAM_POSTS.map((url) => (
                <InstagramEmbed key={url} url={url} width="100%" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Lightbox */}
      {lightboxItem && (
        <div className={styles.lightbox} onClick={() => setLightbox(null)}>
          <button className={styles.close} onClick={() => setLightbox(null)} aria-label="Close">
            <X size={24} />
          </button>
          <div className={styles.lightboxInner} onClick={(e) => e.stopPropagation()}>
            {lightboxItem.src
              ? <Image src={lightboxItem.src} alt={lightboxItem.alt} width={1200} height={900} className={styles.lightboxImg} />
              : <div className={`${styles.lightboxPlaceholder} ${styles[lightboxItem.tone]}`} />
            }
            <p className={styles.lightboxCaption}>{lightboxItem.alt}</p>
          </div>
        </div>
      )}

      <Footer
        tagline={t.footer.tagline}
        explore={t.footer.explore}
        visit={t.footer.visit}
        address={t.footer.address}
        hoursShort={t.footer.hoursShort}
        whatsapp={t.footer.whatsapp}
        rights={t.footer.rights}
        findUs={t.footer.findUs}
        openingHours={t.footer.openingHours}
        connect={t.footer.connect}
        schedule={t.footer.schedule}
        navLabels={{ home: t.nav.home, menu: t.nav.menu, events: t.nav.events, about: t.nav.about, gallery: t.nav.gallery, contact: t.nav.contact }}
        waHref={WA_GENERAL}
      />
    </main>
  );
}
