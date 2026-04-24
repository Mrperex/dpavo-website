'use client';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_GENERAL } from '@/content/config';
import { SHOW_TEAM_SECTION, TEAM_MEMBERS } from '@/content/about';
import { Clock3, MapPin, MessageCircle } from 'lucide-react';
import { ClipReveal } from '@/components/animations';
import styles from './about.module.css';

export default function AboutPage() {
  const { t } = useLanguage();
  const [storyRef, storyInView] = useInView<HTMLDivElement>();
  const [valuesRef, valuesInView] = useInView<HTMLDivElement>();

  return (
    <main>
      <Navbar />

      <PageHero
        label={t.aboutPage.label}
        title={<>{t.aboutPage.title.replace('.', '')} <span style={{ color: 'var(--primary)' }}>.</span></>}
        subtitle={t.aboutPage.subtitle}
        tone="warm"
      />

      {/* Origin story */}
      <section className={styles.storySection}>
        <div className="container">
          <div
            ref={storyRef}
            className={`${styles.storySplit} animate-in ${storyInView ? 'visible' : ''}`}
          >
            <div className={styles.storyText}>
              <SectionHeader label={t.aboutPage.storyTitle} title="" />
              {t.aboutPage.storyBody.map((para, i) => (
                <p key={i} className={styles.storyPara}>{para}</p>
              ))}
            </div>
            <div className={styles.storyVisual}>
              <ClipReveal start="top 80%" duration={1.0}>
                <img
                  src="/media/pizza-venue.jpg"
                  alt="D'Pavo Pizza venue — Verón, Punta Cana"
                  className={styles.storyImg}
                />
              </ClipReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className={styles.valuesSection}>
        <div className="container">
          <SectionHeader label={t.aboutPage.valuesLabel} title={t.aboutPage.valuesTitle} align="center" />
          <div ref={valuesRef} className={styles.valuesGrid}>
            {t.aboutPage.values.map((v, i) => (
              <div
                key={i}
                className={`${styles.valueCard} surface-low animate-scale ${valuesInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.valueNum}>{String(i + 1).padStart(2, '0')}</div>
                <h3>{v.title}</h3>
                <p>{v.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team (hidden by default) */}
      {SHOW_TEAM_SECTION && (
        <section className={styles.teamSection}>
          <div className="container">
            <SectionHeader label="The Team" title="The people behind D'Pavo." align="center" />
            <div className={styles.teamGrid}>
              {TEAM_MEMBERS.map((member, i) => (
                <div key={i} className={`${styles.teamCard} surface-low`}>
                  <div className={styles.teamAvatar} />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Location & Visit */}
      <section className={styles.visitSection}>
        <div className="container">
          <div className={styles.visitBox}>
            <div>
              <SectionHeader label={t.aboutPage.visitLabel} title={t.aboutPage.visitTitle} />
              <div className={styles.visitDetails}>
                <p><MapPin size={16} /> {t.hours.address}</p>
                <p><Clock3 size={16} /> {t.footer.hoursShort}</p>
              </div>
              <a href={WA_GENERAL} className="btn-primary" target="_blank" rel="noopener noreferrer" style={{ marginTop: 24, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <MessageCircle size={15} /> {t.aboutPage.visitCta}
              </a>
            </div>
            <div className={styles.visitMapPlaceholder}>
              <MapPin size={40} style={{ color: 'var(--primary)', opacity: 0.6 }} />
              <p>Plaza Verón Center</p>
            </div>
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
