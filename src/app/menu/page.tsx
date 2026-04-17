'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { Badge } from '@/components/ui/Badge/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { WA_ORDER, WA_GENERAL } from '@/content/config';
import { SplitReveal, StaggerGrid } from '@/components/animations';
import { MENU_ITEMS } from '@/content/menu';
import { MessageCircle, Flame } from 'lucide-react';
import styles from './menu.module.css';

export default function MenuPage() {
  const { t } = useLanguage();
  const [active, setActive] = useState<string>('All');
  const cats = ['All', 'Pizza', 'Mariscos', 'Picaderas', 'Drinks']; // internal filter keys

  const filtered = active === 'All'
    ? MENU_ITEMS
    : MENU_ITEMS.filter((i) => i.category === active);

  const featured = MENU_ITEMS.filter((i) => i.featured);

  return (
    <main>
      <Navbar />

      <PageHero
        label={t.menuPage.label}
        title={
          <>
            <span style={{ color: 'var(--gold)' }}>{t.menuPage.title.replace('.', '')}</span>
            {' '}<span style={{ color: 'var(--primary)' }}>.</span>
          </>
        }
        subtitle={t.menuPage.subtitle}
        tone="default"
      />

      <div className={styles.catsBar}>
        <div className="container">
          <div className={styles.cats}>
            {cats.map((cat, i) => (
              <button
                key={cat}
                className={`${styles.catBtn} ${active === cat ? styles.active : ''}`}
                onClick={() => setActive(cat)}
              >
                {t.menuPage.categories[i]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className={styles.featured}>
        <div className="container">
          <SplitReveal key={t.menuPage.featured} as="p" by="words" stagger={0.05} y={30}>
            {t.menuPage.featured}
          </SplitReveal>
          <StaggerGrid className={styles.featuredGrid} stagger={0.12} y={40} scale={0.94}>
            {featured.map((item) => (
              <article
                key={item.id}
                className={styles.featCard}
              >
                <div className={styles.featVisual}>
                  {item.image
                    ? <img src={item.image} alt={item.name} className={styles.featImg} />
                    : <div className={`${styles.featPlaceholder} ${styles[item.tone]}`} />
                  }
                  <Badge color="red"><Flame size={12} /> {t.menuPage.trending}</Badge>
                </div>
                <div className={styles.featInfo}>
                  <div className={styles.featHeader}>
                    <div>
                      <h3>{item.name}</h3>
                      <span className={styles.subtitle}>{item.subtitle}</span>
                    </div>
                    <span className={styles.price}>{item.price}</span>
                  </div>
                  <p>{item.description}</p>
                  <a href={WA_ORDER(item.name)} className="btn-primary" target="_blank" rel="noopener noreferrer">
                    <MessageCircle size={15} /> {t.menuPage.order}
                  </a>
                </div>
              </article>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section className={styles.allItems}>
        <div className="container">
          <StaggerGrid key={active} className={styles.listGrid} stagger={0.05} y={25} scale={0.97} start="top 90%">
            {filtered.map((item) => (
              <article
                key={item.id}
                className={`${styles.listCard} surface-low`}
              >
                <div className={styles.listTop}>
                  <Badge>{item.category}</Badge>
                  <span className={styles.price}>{item.price}</span>
                </div>
                <h3>{item.name} <span className={styles.listSubtitle}>{item.subtitle}</span></h3>
                <p>{item.description}</p>
                <a href={WA_ORDER(item.name)} className={styles.askBtn} target="_blank" rel="noopener noreferrer">
                  {t.menuPage.ask} →
                </a>
              </article>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <Footer
        tagline={t.footer.tagline}
        explore={t.footer.explore}
        visit={t.footer.visit}
        address={t.footer.address}
        hoursShort={t.footer.hoursShort}
        whatsapp={t.footer.whatsapp}
        rights={t.footer.rights}
        navLabels={{ home: t.nav.home, menu: t.nav.menu, events: t.nav.events, about: t.nav.about, gallery: t.nav.gallery }}
        waHref={WA_GENERAL}
      />
    </main>
  );
}
