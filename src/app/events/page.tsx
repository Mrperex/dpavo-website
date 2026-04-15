'use client';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { Badge } from '@/components/ui/Badge/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_RESERVE, WA_EVENTS, WA_GENERAL } from '@/content/config';
import { EVENTS } from '@/content/events';
import { Calendar, Clock3, MapPin, Mic2, Music4, MessageCircle } from 'lucide-react';
import styles from './events.module.css';

export default function EventsPage() {
  const { t } = useLanguage();
  const [calRef, calInView] = useInView<HTMLDivElement>();
  const [vibeRef, vibeInView] = useInView<HTMLElement>();
  const featured = EVENTS.find((e) => e.featured) ?? EVENTS[1];

  return (
    <main>
      <Navbar />

      <PageHero
        label={t.eventsPage.label}
        title={<>{t.eventsPage.title.replace('.', '')} <span style={{ color: 'var(--primary)' }}>.</span></>}
        subtitle={t.eventsPage.subtitle}
        tone="dark"
      />

      {/* Featured event */}
      <section className={styles.featuredSection}>
        <div className="container">
          <div className={styles.featCard}>
            <div className={styles.featVisual}>
              <div className={styles.liveBadge}>{t.eventsPage.featuredLabel}</div>
            </div>
            <div className={styles.featInfo}>
              <Badge color="red">{featured.tag}</Badge>
              <h2>{t.nav.lang === 'EN' ? featured.titleEs : featured.titleEn}</h2>
              <p>{t.nav.lang === 'EN' ? featured.descriptionEs : featured.descriptionEn}</p>
              <div className={styles.details}>
                <span><Calendar size={15} /> {featured.date}</span>
                <span><Clock3 size={15} /> {featured.time}</span>
                <span><MapPin size={15} /> {featured.location}</span>
              </div>
              <a href={WA_RESERVE(featured.titleEn)} className="btn-primary" target="_blank" rel="noopener noreferrer">
                {t.eventsPage.reserve}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly calendar */}
      <section className={styles.calSection}>
        <div className="container">
          <SectionHeader label={t.eventsPage.weeklyLabel} title={t.eventsPage.weeklyTitle} />
          <div ref={calRef} className={styles.calGrid}>
            {EVENTS.map((ev, i) => (
              <article
                key={ev.id}
                className={`${styles.calCard} surface-low animate-scale ${calInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.calIcon}>
                  {i === 0 ? <Mic2 size={32} /> : <Music4 size={32} />}
                </div>
                <div className={styles.calBody}>
                  <div className={styles.calMeta}>
                    <Badge>{ev.tag}</Badge>
                    <span className={styles.calDate}>{ev.date}</span>
                  </div>
                  <h3>{t.nav.lang === 'EN' ? ev.dayEs : ev.dayEn} — {t.nav.lang === 'EN' ? ev.titleEs : ev.titleEn}</h3>
                  <p>{t.nav.lang === 'EN' ? ev.descriptionEs : ev.descriptionEn}</p>
                  <div className={styles.calFooter}>
                    <span><Clock3 size={13} /> {ev.time}</span>
                    <a href={WA_RESERVE(ev.titleEn)} className={styles.reserveBtn} target="_blank" rel="noopener noreferrer">
                      {t.eventsPage.reserveNow} →
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Vibe section */}
      <section className={styles.vibeSection} ref={vibeRef}>
        <div className="container">
          <SectionHeader label={t.eventsPage.vibeLabel} title={t.eventsPage.vibeTitle} align="center" />
          <div className={styles.vibeGrid}>
            {t.eventsPage.vibes.map((v, i) => (
              <div
                key={i}
                className={`${styles.vibeCard} animate-in ${vibeInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <h3>{v.title}</h3>
                <p>{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp broadcast */}
      <section className={styles.notifySection}>
        <div className="container">
          <div className={styles.notifyBox}>
            <div>
              <span className="label">{t.eventsPage.notifyLabel}</span>
              <h2>{t.eventsPage.notifyTitle}</h2>
            </div>
            <a href={WA_EVENTS} className="btn-primary" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} /> {t.eventsPage.notifyCta}
            </a>
          </div>
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
