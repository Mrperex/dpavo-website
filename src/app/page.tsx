'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  Phone, ArrowRight, Flame, Star,
  Pizza, Fish, Music, Utensils, Camera, Calendar,
  MapPin, Zap, Heart, Waves, ChefHat, GlassWater,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useInView } from '@/hooks/useInView';
import { WA_GENERAL, WA_ORDER } from '@/content/config';
import { MENU_ITEMS } from '@/content/menu';
import { REVIEWS } from '@/content/reviews';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitReveal, ParallaxLayer, StaggerGrid } from '@/components/animations';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { OrderModal } from '@/components/ui/OrderModal/OrderModal';
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
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const iconEls = gridRef.current?.querySelectorAll(`.${styles.catItem}`);
    if (iconEls && iconEls.length && !prefersReducedMotion) {
      gsap.from(iconEls, {
        y: 30,
        scale: 0.8,
        opacity: 0,
        stagger: 0.06,
        duration: 0.55,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        },
      });
    }
  }, { scope: sectionRef });

  // Merge the two refs onto the section element
  const setSectionRef = (el: HTMLElement | null) => {
    (ref as React.MutableRefObject<HTMLElement | null>).current = el;
    (sectionRef as React.MutableRefObject<HTMLElement | null>).current = el;
  };

  return (
    <section ref={setSectionRef} className={`${styles.categoriesSection} animate-in ${inView ? 'visible' : ''}`}>
      <div className="container">
        <p className={styles.catTitle}>{title}</p>
        <div ref={gridRef} className={styles.catGrid}>
          {CAT_ITEMS.map((cat, i) => (
            <Link
              key={cat.label}
              href={cat.href}
              className={styles.catItem}
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
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const aboutRef = useRef<HTMLElement>(null);
  const heroInnerRef = useRef<HTMLDivElement>(null);
  const heroScriptRef = useRef<HTMLSpanElement>(null);
  const todayBadgeRef = useRef<HTMLAnchorElement>(null);
  const authenticBadgeRef = useRef<HTMLDivElement>(null);
  const storyPinRef = useRef<HTMLElement>(null);
  const panel1Ref = useRef<HTMLDivElement>(null);
  const panel2Ref = useRef<HTMLDivElement>(null);
  const panel3Ref = useRef<HTMLDivElement>(null);
  const hSectionRef = useRef<HTMLElement>(null);
  const hTrackRef = useRef<HTMLDivElement>(null);
  const hProgressRef = useRef<HTMLDivElement>(null);

  // Hero script char waterfall on mount
  useGSAP(() => {
    const el = heroScriptRef.current;
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    import('splitting').then(({ default: Splitting }) => {
      const [result] = Splitting({ target: el, by: 'chars' });
      if (!result.chars?.length) return;
      gsap.from(result.chars, {
        y: 80, opacity: 0, stagger: 0.03, duration: 0.8,
        ease: 'power3.out', delay: 0.1,
      });
    });
  });

  // Continuous floating animation for the two badge elements
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (todayBadgeRef.current && !prefersReducedMotion) {
      gsap.to(todayBadgeRef.current, {
        y: -8,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }

    if (authenticBadgeRef.current && !prefersReducedMotion) {
      gsap.to(authenticBadgeRef.current, {
        y: -8,
        duration: 3,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
      });
    }
  });

  // Hero text parallax — moves at a different speed than the pizza image
  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (heroInnerRef.current && !prefersReducedMotion) {
      gsap.to(heroInnerRef.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: {
          trigger: heroInnerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });
    }
  });

  // Scroll-pinned story section
  useGSAP(() => {
    const section = storyPinRef.current;
    const p1 = panel1Ref.current;
    const p2 = panel2Ref.current;
    const p3 = panel3Ref.current;
    if (!section || !p1 || !p2 || !p3) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.set([p2, p3], { opacity: 0, y: 40 });

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })
      .to(p1, { opacity: 0, y: -40, duration: 0.3 })
      .to(p2, { opacity: 1, y: 0,   duration: 0.3 }, '-=0.15')
      .to(p2, { opacity: 0, y: -40, duration: 0.3 })
      .to(p3, { opacity: 1, y: 0,   duration: 0.3 }, '-=0.15');
  }, { scope: storyPinRef });

  // Horizontal scroll picks showcase (A7)
  useGSAP(() => {
    const section = hSectionRef.current;
    const track = hTrackRef.current;
    if (!section || !track) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const totalScroll = track.scrollWidth - track.clientWidth;
    gsap.to(track, {
      x: -totalScroll,
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: () => `+=${totalScroll}`,
        pin: true,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (hProgressRef.current) {
            hProgressRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      },
    });
  }, { scope: hSectionRef });

  useGSAP(() => {
    const section = aboutRef.current;
    if (!section) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const imageSide = section.querySelector(`.${styles.aboutImageSide}`);
    const textSide = section.querySelector(`.${styles.aboutText}`);
    if (!imageSide || !textSide) return;

    gsap.set(imageSide, { opacity: 0, x: -40 });
    gsap.set(textSide, { opacity: 0, x: 40 });

    gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 60%',
      },
    })
      .to(imageSide, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, 0)
      .to(textSide, { opacity: 1, x: 0, duration: 0.7, ease: 'power2.out' }, 0.15);
  }, { scope: aboutRef });

  return (
    <main>
      <Navbar />

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section className={styles.hero}>
        <div ref={heroInnerRef} className={styles.heroInner}>
          <span ref={heroScriptRef} className={styles.heroScript}>{t.home.heroScript}</span>
          <h1 className={styles.heroTitleWrap}>
            <img src="/media/Logo Pavo Hero.svg" alt="D'Pavo" className={styles.heroTitleImg} />
          </h1>
          <div className={styles.heroCtas}>
            <MagneticButton>
              <button
                className={styles.heroCtaDark}
                onClick={() => setOrderModalOpen(true)}
                type="button"
              >
                {t.hero.cta1} <ArrowRight size={15} />
              </button>
            </MagneticButton>
            <MagneticButton>
              <Link href="/events" className={styles.heroCtaOutline}>
                {t.hero.cta2}
              </Link>
            </MagneticButton>
          </div>
        </div>

        {/* Pizza image + badges */}
        <div className={styles.heroImageArea}>
          <div className={styles.heroImageWrap}>
            <ParallaxLayer speed={0.35}>
              <img
                src="/media/pizza-hero.png"
                alt="La Pavorosa - D'Pavo signature pizza"
                className={styles.heroImg}
              />
            </ParallaxLayer>
          </div>
          <a ref={todayBadgeRef} href={WA_ORDER('La Pavorosa')} target="_blank" rel="noopener noreferrer" className={styles.todayBadge}>
            <strong>{t.home.todaysSpecialLine1}</strong>
            <span>{t.home.todaysSpecialLine2}</span>
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
          <strong>{t.home.heroOrderTitle}</strong>
          <span>{t.home.heroOrderSub}</span>
        </a>
      </section>

      {/* ══════════════════════════════════════
          STORY PIN
      ══════════════════════════════════════ */}
      <section ref={storyPinRef} className={styles.storyPin}>
        <div className={styles.storyPinSticky}>
          <div className={styles.storyPinImage}>
            <img src="/media/pizza-hero.png" alt="D'Pavo signature pizza" />
          </div>
          <div className={styles.storyPanelStack}>
            <div ref={panel1Ref} className={styles.storyPanel}>
              <h2>{t.home.storyPin[0].title}</h2>
              <p>{t.home.storyPin[0].body}</p>
            </div>
            <div ref={panel2Ref} className={styles.storyPanel}>
              <h2>{t.home.storyPin[1].title}</h2>
              <p>{t.home.storyPin[1].body}</p>
            </div>
            <div ref={panel3Ref} className={styles.storyPanel}>
              <h2>{t.home.storyPin[2].title}</h2>
              <p>{t.home.storyPin[2].body}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CATEGORIES
      ══════════════════════════════════════ */}
      <CategoriesSection title={t.home.categoriesTitle} />

      {/* ══════════════════════════════════════
          ABOUT
      ══════════════════════════════════════ */}
      <section ref={aboutRef} className={styles.aboutSection}>
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
              <div ref={authenticBadgeRef} className={styles.authenticBadge}>
                <span>100%</span>
                <strong>Authentic</strong>
                <span>Flavor</span>
              </div>
            </div>

            {/* Text side */}
            <div className={styles.aboutText}>
              <SplitReveal as="h2" by="words" stagger={0.06} y={50} className={styles.aboutHeading}>
                {t.home.aboutHeading1} {t.home.aboutHeading2}
              </SplitReveal>
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
      </section>

      {/* ══════════════════════════════════════
          HORIZONTAL SCROLL SHOWCASE (A7)
      ══════════════════════════════════════ */}
      <section ref={hSectionRef} className={styles.hSection}>
        <div className={styles.hSticky}>
          <div className={styles.hHeader}>
            <span className={styles.hLabel}>{t.home.picksLabel}</span>
            <h2 className={styles.hTitle}>{t.home.picksTitle}</h2>
          </div>
          <div ref={hTrackRef} className={styles.hTrack}>
            {allItems.map((item, i) => (
              <a
                key={item.id}
                href={WA_ORDER(item.name)}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.hCard}
              >
                <div className={styles.hCardImg}>
                  {item.image
                    ? <img src={item.image} alt={item.name} />
                    : <Pizza size={52} strokeWidth={1.1} color="var(--red)" />
                  }
                </div>
                <div className={styles.hCardBody}>
                  <p className={styles.hCardNum}>{String(i + 1).padStart(2, '0')}</p>
                  <p className={styles.hCardName}>{item.name}</p>
                  <p className={styles.hCardPrice}>{item.price}</p>
                </div>
              </a>
            ))}
          </div>
          <div className={styles.hFooter}>
            <div className={styles.hProgress}>
              <div ref={hProgressRef} className={styles.hProgressBar} />
            </div>
            <Link href="/menu" className={styles.hMenuLink}>
              Full Menu <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          POPULAR PICKS
      ══════════════════════════════════════ */}
      <section className={styles.picksSection}>
        <span className={styles.picksWatermark}>DELICIOSO</span>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionHeaderLabel}>{t.home.picksLabel}</span>
            <span className={styles.sectionHeaderDivider} />
            <h2 className={styles.sectionHeaderTitle}>{t.home.picksTitle}</h2>
          </div>

          <StaggerGrid className={styles.picksGrid} stagger={0.1} y={40} scale={0.93}>
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
          </StaggerGrid>

          <div className={styles.exploreCircleWrap}>
            <Link href="/menu" className={styles.exploreCircle}>
              <ArrowRight size={18} />
              {t.home.fullMenu.split(' ')[0]}<br />{t.home.fullMenu.split(' ').slice(1).join(' ')}
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          EXCLUSIVE MENU LIST
      ══════════════════════════════════════ */}
      <AnimSection className={styles.menuListSection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionHeaderLabel}>{t.home.exclusiveLabel}</span>
            <span className={styles.sectionHeaderDivider} />
            <h2 className={styles.sectionHeaderTitle}>{t.home.exclusiveTitle}</h2>
          </div>

          <StaggerGrid className={styles.menuListGrid} stagger={0.05} y={20} x={-20} scale={0.97} start="top 90%">
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
          </StaggerGrid>
        </div>
      </AnimSection>


      {/* ══════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════ */}
      <section className={styles.whySection}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <span className={styles.sectionHeaderLabel}>{t.home.whyLabel}</span>
            <span className={styles.sectionHeaderDivider} />
            <h2 className={styles.sectionHeaderTitle}>{t.home.whyTitle}</h2>
          </div>

          <StaggerGrid className={styles.whyGrid} stagger={0.07} y={30} scale={0.96} start="top 88%">
            {(
              [
                <Pizza  size={24} strokeWidth={1.4} key="pizza" />,
                <Fish   size={24} strokeWidth={1.4} key="fish" />,
                <Music  size={24} strokeWidth={1.4} key="music" />,
                <MapPin size={24} strokeWidth={1.4} key="mappin" />,
                <Zap    size={24} strokeWidth={1.4} key="zap" />,
                <Heart  size={24} strokeWidth={1.4} key="heart" />,
              ] as React.ReactElement[]
            ).map((icon, idx) => {
              const item = t.home.whyItems[idx];
              return (
                <div key={item.title} className={styles.whyItem}>
                  <div className={styles.whyIconWrap}>{icon}</div>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </StaggerGrid>
        </div>
      </section>

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
              {t.home.ctaBannerSlogan}
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
        findUs={t.footer.findUs}
        openingHours={t.footer.openingHours}
        connect={t.footer.connect}
        schedule={t.footer.schedule}
        navLabels={{ home: t.nav.home, menu: t.nav.menu, events: t.nav.events, about: t.nav.about, gallery: t.nav.gallery }}
        waHref={WA_GENERAL}
      />
      <OrderModal
        open={orderModalOpen}
        onClose={() => setOrderModalOpen(false)}
        orderLabel={t.menuPage.order}
      />
    </main>
  );
}
