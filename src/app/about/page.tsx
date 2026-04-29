'use client';

import Script from 'next/script';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader/SectionHeader';
import { FAQ } from '@/components/ui/FAQ/FAQ';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_GENERAL } from '@/content/config';
import { SHOW_TEAM_SECTION, TEAM_MEMBERS } from '@/content/about';
import Image from 'next/image';
import { Clock3, MapPin, MessageCircle } from 'lucide-react';
import { ClipReveal } from '@/components/animations';
import styles from './about.module.css';

const FAQ_ITEMS = [
  {
    q: '¿Hacen delivery?',
    a: 'Sí, hacemos delivery en Verón y zonas cercanas. Escríbenos por WhatsApp con tu dirección y te confirmamos disponibilidad y tiempo de entrega.',
  },
  {
    q: '¿Cuáles son los horarios de apertura?',
    a: 'Lunes a jueves: 11:00 AM – 11:00 PM · Viernes: 11:00 AM – 2:00 AM · Sábado: 11:00 AM – 3:00 AM · Domingo: 12:00 PM – 10:00 PM.',
  },
  {
    q: '¿Cómo puedo hacer un pedido?',
    a: 'La forma más rápida es por WhatsApp. Entra al menú, elige lo que quieres y toca el botón de WhatsApp. Te respondemos de inmediato.',
  },
  {
    q: '¿Tienen opciones vegetarianas?',
    a: 'Sí. Nuestras pizzas Veggies Supreme, Triple Queso, Pavo Blanco y Hongos & Trufa son 100% vegetarianas. Están marcadas en el menú.',
  },
  {
    q: '¿Aceptan reservas?',
    a: 'Sí, especialmente para viernes y sábados con DJ. Escríbenos por WhatsApp con la fecha, hora y número de personas y te confirmamos disponibilidad.',
  },
  {
    q: '¿Tienen opciones sin gluten?',
    a: 'Algunos platos como nuestros mariscos y bebidas son naturalmente sin gluten. Escríbenos si tienes alguna restricción dietética y te asesoramos.',
  },
  {
    q: '¿Cuál es la dirección exacta?',
    a: 'Estamos en Plaza Verón Center, Verón, Punta Cana 23000 — en el corazón de Verón. También puedes escribirnos por WhatsApp y te mandamos la ubicación.',
  },
  {
    q: '¿Tienen estacionamiento?',
    a: 'Sí, hay estacionamiento disponible en Plaza Verón Center frente al local.',
  },
  {
    q: '¿Hacen catering para eventos?',
    a: "Sí, hacemos catering completo para cumpleaños, bodas, eventos corporativos y más. Visita nuestra página de Catering o escríbenos para una cotización.",
  },
  {
    q: '¿Cuáles métodos de pago aceptan?',
    a: 'Aceptamos efectivo (DOP y USD), tarjetas de crédito/débito y transferencias bancarias.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_ITEMS.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
};

export default function AboutPage() {
  const { t } = useLanguage();
  const [storyRef, storyInView] = useInView<HTMLDivElement>();
  const [valuesRef, valuesInView] = useInView<HTMLDivElement>();

  return (
    <main id="main-content">
      <Script id="ld-faq" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify(faqJsonLd)}
      </Script>

      <Navbar />

      <PageHero
        label={t.aboutPage.label}
        title={<>{t.aboutPage.title.replace('.', '')} <span style={{ color: 'var(--primary)' }}>.</span></>}
        subtitle={t.aboutPage.subtitle}
        tone="warm"
        backgroundImage="/media/pizza-venue.webp"
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
              {t.aboutPage.storyBody.map((para) => (
                <p key={para.slice(0, 24)} className={styles.storyPara}>{para}</p>
              ))}
            </div>
            <div className={styles.storyVisual}>
              <ClipReveal start="top 80%" duration={1.0}>
                <div style={{ position: 'relative', height: 420, borderRadius: 'var(--radius-xl)', overflow: 'hidden' }}>
                  <Image
                    src="/media/pizza-venue.webp"
                    alt="D'Pavo Pizza venue — Verón, Punta Cana"
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
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
                key={v.title}
                className={`${styles.valueCard} animate-scale ${valuesInView ? 'visible' : ''}`}
                style={{ '--index': i } as React.CSSProperties}
              >
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
            <SectionHeader label={t.aboutPage.teamLabel} title={t.aboutPage.teamTitle} align="center" />
            <div className={styles.teamGrid}>
              {TEAM_MEMBERS.map((member) => (
                <div key={member.role} className={`${styles.teamCard} surface-low`}>
                  <div className={styles.teamAvatar} />
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <FAQ
        label="Preguntas Frecuentes"
        title="¿Tienes Dudas?"
        items={FAQ_ITEMS}
      />

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
            <iframe
              src="https://maps.google.com/maps?q=HHXG%2BJ29%2C+Punta+Cana+23000&z=16&output=embed"
              className={styles.visitMap}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="D'Pavo Pizza location"
            />
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
