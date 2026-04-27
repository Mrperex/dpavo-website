'use client';

import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_CATERING, WA_GENERAL } from '@/content/config';
import { ChefHat, Settings, Users, Truck, MessageCircle } from 'lucide-react';
import { ClipReveal } from '@/components/animations';
import styles from './catering.module.css';

const SERVICE_ICONS = [
  <ChefHat key="chef" size={28} strokeWidth={1.3} />,
  <Settings key="settings" size={28} strokeWidth={1.3} />,
  <Users key="users" size={28} strokeWidth={1.3} />,
  <Truck key="truck" size={28} strokeWidth={1.3} />,
];

export default function CateringPage() {
  const { t } = useLanguage();
  const cp = t.cateringPage;
  const [servicesRef, servicesInView] = useInView<HTMLDivElement>();
  const [stepsRef, stepsInView] = useInView<HTMLDivElement>();

  return (
    <main>
      <Navbar />

      <PageHero
        label={cp.label}
        title={<>{cp.title.replace('.', '')} <span style={{ color: 'var(--primary)' }}>.</span></>}
        subtitle={cp.subtitle}
        tone="dark"
        backgroundImage="/media/dpavo-food-2.jpg"
      />

      {/* Intro */}
      <section className={styles.introSection}>
        <div className="container">
          <ClipReveal start="top 85%" duration={1.0}>
            <div className={styles.introGrid}>
              <div className={styles.introText}>
                <h2 className={styles.introTitle}>{cp.introTitle}</h2>
                <p className={styles.introBody}>{cp.introBody}</p>
                <a href={WA_CATERING} className="btn-primary" target="_blank" rel="noopener noreferrer">
                  <MessageCircle size={15} /> {cp.ctaBtn}
                </a>
              </div>
              <div className={styles.introVisual}>
                <img src="/media/dpavo-food-1.jpg" alt="D'Pavo catering" className={styles.introImg} />
              </div>
            </div>
          </ClipReveal>
        </div>
      </section>

      {/* Services */}
      <section className={styles.servicesSection}>
        <div className="container">
          <SectionHeader label={cp.servicesLabel} title={cp.servicesTitle} align="center" />
          <div ref={servicesRef} className={styles.servicesGrid}>
            {cp.services.map((svc, i) => (
              <div
                key={svc.title}
                className={`${styles.serviceCard} animate-scale ${servicesInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <div className={styles.serviceIcon}>{SERVICE_ICONS[i]}</div>
                <h3>{svc.title}</h3>
                <p>{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.stepsSection}>
        <div className="container">
          <SectionHeader label={cp.stepsLabel} title={cp.stepsTitle} align="center" />
          <div ref={stepsRef} className={styles.stepsRow}>
            {cp.steps.map((step, i) => (
              <div
                key={step.num}
                className={`${styles.stepItem} animate-in ${stepsInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
                <span className={styles.stepNum}>{step.num}</span>
                {i < cp.steps.length - 1 && <span className={styles.stepArrow} aria-hidden="true" />}
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.ctaSection}>
        <div className="container">
          <div className={styles.ctaBox}>
            <span className="label">{cp.ctaLabel}</span>
            <h2>{cp.ctaTitle}</h2>
            <p>{cp.ctaBody}</p>
            <a href={WA_CATERING} className="btn-primary" target="_blank" rel="noopener noreferrer">
              <MessageCircle size={15} /> {cp.ctaBtn}
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
        findUs={t.footer.findUs}
        openingHours={t.footer.openingHours}
        connect={t.footer.connect}
        schedule={t.footer.schedule}
        navLabels={{ home: t.nav.home, menu: t.nav.menu, events: t.nav.events, about: t.nav.about, gallery: t.nav.gallery, contact: t.nav.contact, catering: t.nav.catering }}
        waHref={WA_GENERAL}
      />
    </main>
  );
}
