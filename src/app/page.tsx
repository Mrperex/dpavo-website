'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Phone, ArrowRight, Flame, Star,
  Pizza, Fish, Music, Utensils, Camera, Calendar,
  MapPin, Zap, Heart, Waves, ChefHat, GlassWater,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_GENERAL, WA_ORDER } from '@/content/config';
import { MENU_ITEMS } from '@/content/menu';
import { REVIEWS } from '@/content/reviews';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './page.module.css';

function AnimSection({ children, className }: { children: React.ReactNode; className?: string }) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <section ref={ref} className={`${className ?? ''} animate-in ${inView ? 'visible' : ''}`}>
      {children}
    </section>
  );
}

function CountUp({ target, active }: { target: number; active: boolean }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let cur = 0;
    const interval = setInterval(() => {
      cur += 1;
      setCount(cur);
      if (cur >= target) clearInterval(interval);
    }, Math.max(20, Math.round(900 / target)));
    return () => clearInterval(interval);
  }, [active, target]);
  return <>{count}</>;
}

const CAT_ITEMS = [
  { label: 'Pizzas',    href: '/menu',    icon: (s: number) => <Pizza      size={s} strokeWidth={1.2} />, count: 8 },
  { label: 'Mariscos', href: '/menu',    icon: (s: number) => <Fish       size={s} strokeWidth={1.2} />, count: 1 },
  { label: 'Picaderas',href: '/menu',    icon: (s: number) => <Utensils   size={s} strokeWidth={1.2} />, count: 2 },
  { label: 'Drinks',   href: '/menu',    icon: (s: number) => <GlassWater size={s} strokeWidth={1.2} />, count: 1 },
  { label: 'Events',   href: '/events',  icon: (s: number) => <Calendar   size={s} strokeWidth={1.2} />, count: 4 },
  { label: 'Gallery',  href: '/gallery', icon: (s: number) => <Camera     size={s} strokeWidth={1.2} />, count: 10 },
];

function CategoriesSection({ title }: { title: string }) {
  const [ref, inView] = useInView<HTMLElement>();
  return (
    <section ref={ref} className={`${styles.categoriesSection} animate-in ${inView ? 'visible' : ''}`}>
      <div className="container">
        <p className={styles.catTitle}>{title}</p>
        <div className={styles.catGrid}>
          {CAT_ITEMS.map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`${styles.catItem} ${inView ? styles.catItemVisible : ''}`}
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className={styles.catIconWrap}>
                <div className={styles.catIcon}>{cat.icon(40)}</div>
                <span className={styles.catCount}>
                  <CountUp target={cat.count} active={inView} />
                </span>
              </div>
              <span className={styles.catLabel}>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const featured = MENU_ITEMS.filter((i) => i.featured);
  const allItems = MENU_ITEMS;

  return (
    <main>
      <Navbar />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <span className={styles.heroScript}>{t.home.heroScript}</span>
          <h1 className={styles.heroTitle}>
            D&apos;<span>P</span>avo
          </h1>
          <div className={styles.heroCtas}>
            <Link href="/menu" className={styles.heroCtaDark}>
              {t.hero.cta1} <ArrowRight size={15} />
            </Link>
            <Link href="/events" className={styles.heroCtaOutline}>
              {t.hero.cta2}
            </Link>
          </div>
        </div>

        {/* Pizza image + badges */}
        <div className={styles.heroImageArea}>
          <div className={styles.heroImageWrap}>
            <img
              src="/media/pizza-hero.png"
              alt="La Pavorosa - D'Pavo signature pizza"
              className={styles.heroImg}
            />
          </div>
          <a href={WA_ORDER('La Pavorosa')} target="_blank" rel="noopener noreferrer" className={styles.todayBadge}>
            <strong>Today&apos;s</strong>
            <span>Special</span>
          </a>
        </div>

        {/* Bottom wave into next section */}
        <div className={styles.heroWave}>
          <svg viewBox="0 0 1440 100" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0,0 C360,100 1080,100 1440,0 L1440,100 L0,100 Z" fill="#ffffff" />
          </svg>
        </div>

        {/* Order button — straddles hero / next section boundary */}
        <a href={WA_ORDER('La Pavorosa')} target="_blank" rel="noopener noreferrer" className={styles.ordenaBtn}>
          <span className={styles.ordenaPulse} />
          <span className={styles.ordenaPulse2} />
          <strong>Ordena</strong>
          <span>Tu Pizza</span>
        </a>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      <CategoriesSection title={t.home.categoriesTitle} />

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <AnimSection className={styles.aboutSection}>
        <div className="container">
          <div className={styles.aboutGrid}>

            {/* Image side */}
            <div className={styles.aboutImageSide}>
              <span className={styles.verticalText}>SIGNATURE</span>
              <span className={styles.aboutDelicious} aria-hidden="true">
                <span>DELI</span>
                <span>CIOUS</span>
              </span>
              <div className={styles.aboutImgWrap}>
                <img
                  src="/media/pizza-pepperoni.png"
                  alt="D'Pavo signature pizza"
                />
              </div>
              <div className={styles.authenticBadge}>
                <span>100%</span>
                <strong>Authentic</strong>
                <span>Flavor</span>
              </div>
            </div>

            {/* Text side */}
            <div className={styles.aboutText}>
              <h2 className={styles.aboutHeading}>
                {t.home.aboutHeading1}<br />{t.home.aboutHeading2}
              </h2>
              <p className={styles.aboutPara}>
                {t.aboutPage.storyBody[0]}
              </p>
              <div className={styles.aboutActions}>
                <Link href="/about" className={styles.heroCtaDark}>
                  {t.home.aboutCta} <ArrowRight size={14} />
                </Link>
                <a href={WA_GENERAL} className={styles.aboutPhone} target="_blank" rel="noopener noreferrer">
                  <Phone size={15} /> (829) 753-1995
                </a>
              </div>
              <div className={styles.featuresRow}>
                {[
                  { icon: <ChefHat size={22} strokeWidth={1.4} />, ...t.home.features[0] },
                  { icon: <Waves   size={22} strokeWidth={1.4} />, ...t.home.features[1] },
                  { icon: <Music   size={22} strokeWidth={1.4} />, ...t.home.features[2] },
                ].map((f) => (
                  <div key={f.title} className={styles.featureItem}>
                    <div className={styles.featureIconWrap}>{f.icon}</div>
                    <div>
                      <h4>{f.title}</h4>
                      <p>{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </AnimSection>

      {/* ══════════════════════════════════════
          POPULAR PICKS
      ══════════════════════════════════════ */}
      <AnimSection className={styles.picksSection}>
        <span className={styles.picksWatermark}>DELICIOSO</span>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionHeaderLabel}>{t.home.picksLabel}</span>
            <span className={styles.sectionHeaderDivider} />
            <h2 className={styles.sectionHeaderTitle}>{t.home.picksTitle}</h2>
          </div>

          <div className={styles.picksGrid}>
            {featured.map((item) => (
              <a
                key={item.id}
                href={WA_ORDER(item.name)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.pickCard}
              >
                <div className={styles.pickImgWrap}>
                  {item.image ? (
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: '#f5f4f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Pizza size={40} strokeWidth={1.2} color="var(--red)" />
                    </div>
                  )}
                </div>
                <div className={styles.pickRating}>
                  <span className={styles.pickStars}>★★★★★</span>
                  <span className={styles.pickScore}>5.0</span>
                </div>
                <p className={styles.pickName}>{item.name}</p>
                <div className={styles.pickPricing}>
                  <span className={styles.pickPrice}>{item.price}</span>
                </div>
              </a>
            ))}

            {/* 4th card - featured Wings */}
            {(() => {
              const alitas = MENU_ITEMS.find((i) => i.id === 5);
              if (!alitas) return null;
              return (
                <a
                  key="alitas"
                  href={WA_ORDER(alitas.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.pickCard}
                >
                  <div className={styles.pickImgWrap}>
                    <img src="/media/alitas-infierno.png" alt={alitas.name} />
                  </div>
                  <div className={styles.pickRating}>
                    <span className={styles.pickStars}>★★★★★</span>
                    <span className={styles.pickScore}>5.0</span>
                  </div>
                  <p className={styles.pickName}>{alitas.name}</p>
                  <div className={styles.pickPricing}>
                    <span className={styles.pickPrice}>{alitas.price}</span>
                  </div>
                </a>
              );
            })()}
          </div>

          <div className={styles.exploreCircleWrap}>
            <Link href="/menu" className={styles.exploreCircle}>
              <ArrowRight size={18} />
              Full<br />Menu
            </Link>
          </div>
        </div>
      </AnimSection>

      {/* ══════════════════════════════════════
          EXCLUSIVE MENU LIST
      ══════════════════════════════════════ */}
      <AnimSection className={styles.menuListSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionHeaderLabel}>Exclusive</span>
            <span className={styles.sectionHeaderDivider} />
            <h2 className={styles.sectionHeaderTitle}>Our Menu</h2>
          </div>

          <div className={styles.menuListGrid}>
            {allItems.map((item) => (
              <a
                key={item.id}
                href={WA_ORDER(item.name)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.menuListItem}
              >
                <div>
                  {item.image ? (
                    <div className={styles.menuListImg}>
                      <img src={item.image} alt={item.name} />
                    </div>
                  ) : (
                    <div className={styles.menuListImgPlaceholder}>
                      {item.category === 'Pizza' ? <Pizza size={24} strokeWidth={1.2} /> : item.category === 'Mariscos' ? <Fish size={24} strokeWidth={1.2} /> : item.category === 'Drinks' ? <GlassWater size={24} strokeWidth={1.2} /> : <Utensils size={24} strokeWidth={1.2} />}
                    </div>
                  )}
                </div>
                <div className={styles.menuListInfo}>
                  <p className={styles.menuListName}>
                    {item.name}
                    {item.featured && (
                      <span className={styles.menuListBadge}>
                        <Flame size={9} /> Hot
                      </span>
                    )}
                  </p>
                  <p className={styles.menuListDesc}>{item.description}</p>
                </div>
                <p className={styles.menuListPrice}>
                  {item.price}
                </p>
              </a>
            ))}
          </div>
        </div>
      </AnimSection>


      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <AnimSection className={styles.whySection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionHeaderLabel}>Why D&apos;Pavo</span>
            <span className={styles.sectionHeaderDivider} />
            <h2 className={styles.sectionHeaderTitle}>The Difference</h2>
          </div>

          <div className={styles.whyGrid}>
            {[
              { icon: <Pizza  size={24} strokeWidth={1.4} />, title: 'Artisan Pizzas',       desc: 'Made fresh daily with premium imported and local ingredients.' },
              { icon: <Fish   size={24} strokeWidth={1.4} />, title: 'Fresh Mariscos',       desc: 'Caribbean seafood sourced daily — shrimp, calamari and more.' },
              { icon: <Music  size={24} strokeWidth={1.4} />, title: 'Nightlife Energy',     desc: 'DJs every weekend and themed events that keep Verón moving.' },
              { icon: <MapPin size={24} strokeWidth={1.4} />, title: 'Prime Location',       desc: "Located in Verón, the heart of Punta Cana's local culture." },
              { icon: <Zap    size={24} strokeWidth={1.4} />, title: 'Fast WhatsApp Orders', desc: 'Order directly on WhatsApp. No apps, no waiting. Instant service.' },
              { icon: <Heart  size={24} strokeWidth={1.4} />, title: 'Community Roots',      desc: "Born and built in Verón. We're proud of where we came from." },
            ].map((item) => (
              <div key={item.title} className={styles.whyItem}>
                <div className={styles.whyIconWrap}>{item.icon}</div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimSection>

      {/* ══════════════════════════════════════
          PROMO BANNERS
      ══════════════════════════════════════ */}
      <AnimSection className={styles.promoSection}>
        <div className="container">
          <div className={styles.promoBanners}>

            {/* Banner 1 — Pizza */}
            <div className={styles.promoBanner}>
              <div className={styles.promoBannerText}>
                <span className={styles.promoBannerLabel}>{t.home.banner1Label}</span>
                <h3 className={styles.promoBannerTitle}>La<br />Pavorosa</h3>
                <a href={WA_ORDER('La Pavorosa')} className={styles.heroCtaDark} target="_blank" rel="noopener noreferrer">
                  {t.home.banner1Cta} <ArrowRight size={14} />
                </a>
              </div>
              <img
                src="/media/pizza-ham-and-pepperonni.png"
                alt="La Pavorosa"
                className={styles.promoBannerImg}
              />
              <div className={styles.promoBadge}>
                <strong>{t.home.bestSeller}</strong>
                <span>2024</span>
              </div>
              <span className={styles.promoBannerBg}>PIZZA</span>
            </div>

            {/* Banner 2 — Events */}
            <div className={styles.promoBanner}>
              <div className={styles.promoBannerText}>
                <span className={styles.promoBannerLabel}>{t.home.banner2Label}</span>
                <h3 className={styles.promoBannerTitle}>{t.home.banner2Title}</h3>
                <Link href="/events" className={styles.heroCtaDark}>
                  {t.home.banner2Cta} <ArrowRight size={14} />
                </Link>
              </div>
              <img
                src="/media/dj-events.jpg"
                alt="DJ Events at D'Pavo"
                className={styles.promoBannerImg}
              />
              <div className={styles.promoBadge}>
                <strong>{t.home.friSat}</strong>
                <span>{t.home.night}</span>
              </div>
              <span className={styles.promoBannerBg}>PARTY</span>
            </div>

          </div>
        </div>
      </AnimSection>

      {/* ══════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════ */}
      <div className={styles.ctaBanner}>
        <div className="container">
          <div className={styles.ctaBannerInner}>
            <p className={styles.ctaBannerText}>
              EXPERIENCIA GASTRONÓMICA INIGUALABLE
              <span>·</span>
              VERÓN, PUNTA CANA
            </p>
            <a
              href={WA_GENERAL}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaBannerPhone}
            >
              (829) 753-1995
            </a>
          </div>
        </div>
      </div>

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
