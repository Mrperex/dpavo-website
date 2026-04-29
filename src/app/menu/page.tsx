'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import { PageHero } from '@/components/layout/PageHero/PageHero';
import { Badge } from '@/components/ui/Badge/Badge';
import { useLanguage } from '@/context/LanguageContext';
import { WA_GENERAL } from '@/content/config';
import { SplitReveal, StaggerGrid } from '@/components/animations';
import { MagneticButton } from '@/components/animations/MagneticButton';
import { MENU_ITEMS, type DietTag } from '@/content/menu';
import { CartDrawer } from '@/components/ui/CartDrawer/CartDrawer';
import { useCart } from '@/context/CartContext';
import { trackAddToCart, trackViewMenu, trackSearch } from '@/lib/analytics';
import { ShoppingCart, Flame, Search, X, Leaf, Fish, Zap, WheatOff } from 'lucide-react';
import styles from './menu.module.css';

const DIET_LABELS: Record<DietTag, { label: string; icon: React.ReactNode }> = {
  vegetarian:   { label: 'Vegetariano', icon: <Leaf size={12} /> },
  seafood:      { label: 'Mariscos',    icon: <Fish size={12} /> },
  spicy:        { label: 'Picante',     icon: <Zap size={12} /> },
  'gluten-free':{ label: 'Sin Gluten',  icon: <WheatOff size={12} /> },
};

const ALL_DIETS = Object.keys(DIET_LABELS) as DietTag[];

export default function MenuPage() {
  const { t } = useLanguage();
  const { addItem } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState<string>('All');
  const [activeDiet, setActiveDiet] = useState<DietTag | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  const [search, setSearch] = useState('');
  const cats = ['All', 'Pizza', 'Mariscos', 'Picaderas', 'Drinks'];
  const catsRef = useRef<HTMLDivElement>(null);
  const allItemsRef = useRef<HTMLElement>(null);

  // Hydrate from URL on mount
  useEffect(() => {
    const q = searchParams.get('q') ?? '';
    const cat = searchParams.get('cat') ?? 'All';
    const diet = searchParams.get('diet') as DietTag | null;
    if (q !== search) setSearch(q);
    if (cats.includes(cat) && cat !== active) setActive(cat);
    if (diet && ALL_DIETS.includes(diet)) setActiveDiet(diet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync URL (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams();
      if (search.trim()) params.set('q', search.trim());
      if (active !== 'All') params.set('cat', active);
      if (activeDiet) params.set('diet', activeDiet);
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 200);
    return () => clearTimeout(timer);
  }, [search, active, activeDiet, pathname, router]);

  // Track search after 600ms idle
  useEffect(() => {
    if (!search.trim()) return;
    const timer = setTimeout(() => {
      const results = MENU_ITEMS.filter(i =>
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.description.toLowerCase().includes(search.toLowerCase())
      ).length;
      trackSearch(search.trim(), results);
    }, 600);
    return () => clearTimeout(timer);
  }, [search]);

  const fireConfetti = useCallback(async () => {
    const { default: confetti } = await import('canvas-confetti');
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#E63329', '#FFD700', '#ffffff'] });
  }, []);

  const handleFilter = (cat: string) => {
    if (cat === active) return;
    trackViewMenu(cat);
    const section = allItemsRef.current;
    if (section && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const cards = section.querySelectorAll('article');
      setIsFiltering(true);
      gsap.to(cards, {
        opacity: 0, y: -18, stagger: 0.02, duration: 0.18, ease: 'power2.in',
        onComplete: () => { setActive(cat); setIsFiltering(false); },
      });
    } else {
      setActive(cat);
    }
  };

  const toggleDiet = (diet: DietTag) => {
    setActiveDiet(d => d === diet ? null : diet);
  };

  useGSAP(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pills = catsRef.current?.querySelectorAll('[data-filter-pill]');
    if (pills && pills.length && !prefersReducedMotion) {
      gsap.from(pills, { x: -10, opacity: 0, stagger: 0.06, duration: 0.55, ease: 'back.out(1.4)' });
    }
  }, { scope: catsRef });

  const searchLower = search.trim().toLowerCase();
  const filtered = MENU_ITEMS.filter((i) => {
    if (active !== 'All' && i.category !== active) return false;
    if (activeDiet && !i.diet?.includes(activeDiet)) return false;
    if (!searchLower) return true;
    return (
      i.name.toLowerCase().includes(searchLower) ||
      i.subtitle.toLowerCase().includes(searchLower) ||
      i.description.toLowerCase().includes(searchLower) ||
      i.descriptionEs.toLowerCase().includes(searchLower)
    );
  });

  const featured = MENU_ITEMS.filter((i) => i.featured);

  return (
    <main id="main-content">
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
        backgroundImage="/media/menu-hero-background-2.webp"
      />

      <div className={styles.catsBar}>
        <div className="container">
          <div className={styles.controlsRow}>
            <div ref={catsRef} className={styles.cats}>
              {cats.map((cat, i) => (
                <button type="button"
                  key={cat}
                  data-filter-pill
                  className={`${styles.catBtn} ${active === cat ? styles.active : ''}`}
                  onClick={() => handleFilter(cat)}
                >
                  {t.menuPage.categories[i]}
                </button>
              ))}
            </div>
            <label className={styles.searchWrap}>
              <Search size={14} className={styles.searchIcon} aria-hidden="true" />
              <input
                type="search"
                className={styles.searchInput}
                placeholder={t.menuPage.searchPlaceholder ?? 'Buscar…'}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label="Buscar en el menú"
              />
              {search && (
                <button
                  type="button"
                  className={styles.searchClear}
                  onClick={() => setSearch('')}
                  aria-label="Limpiar búsqueda"
                >
                  <X size={12} />
                </button>
              )}
            </label>
          </div>
          {/* Diet filter row */}
          <div className={styles.dietRow}>
            {ALL_DIETS.map((diet) => (
              <button
                type="button"
                key={diet}
                className={`${styles.dietBtn} ${activeDiet === diet ? styles.dietActive : ''}`}
                onClick={() => toggleDiet(diet)}
              >
                {DIET_LABELS[diet].icon}
                {DIET_LABELS[diet].label}
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
              <article key={item.id} className={styles.featCard}>
                <div className={styles.featVisual}>
                  {item.image
                    ? <Image src={item.image} alt={item.name} fill sizes="220px" className={styles.featImg} style={{ objectFit: 'cover' }} />
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
                  {item.diet && item.diet.length > 0 && (
                    <div className={styles.dietTags}>
                      {item.diet.map(d => (
                        <span key={d} className={styles.dietTag}>
                          {DIET_LABELS[d].icon} {DIET_LABELS[d].label}
                        </span>
                      ))}
                    </div>
                  )}
                  <MagneticButton>
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => {
                        addItem({ id: String(item.id), name: item.name, price: item.price, image: item.image });
                        trackAddToCart({ id: item.id, name: item.name, price: item.price, category: item.category });
                        fireConfetti();
                      }}
                    >
                      <ShoppingCart size={15} /> {t.menuPage.order}
                    </button>
                  </MagneticButton>
                </div>
              </article>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <section ref={allItemsRef} className={styles.allItems}>
        <div className="container">
          {isFiltering ? (
            <div className={styles.listGrid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`skeleton-${i}`} className={`${styles.listCard} ${styles.skeleton} surface-low`} aria-hidden="true">
                  <div className={styles.skeletonBadge} />
                  <div className={styles.skeletonTitle} />
                  <div className={styles.skeletonText} />
                  <div className={styles.skeletonText} style={{ width: '60%' }} />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className={styles.noResults} role="status">
              <Search size={28} strokeWidth={1.2} aria-hidden="true" />
              <p>No encontramos resultados para <strong>&quot;{search || (activeDiet && DIET_LABELS[activeDiet].label)}&quot;</strong></p>
              <button
                type="button"
                className={styles.noResultsClear}
                onClick={() => { setSearch(''); setActive('All'); setActiveDiet(null); }}
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <StaggerGrid key={`${active}-${searchLower}-${activeDiet}`} className={styles.listGrid} stagger={0.05} y={25} scale={0.97} start="top 90%">
              {filtered.map((item) => (
                <article key={item.id} className={`${styles.listCard} surface-low`}>
                  <div className={styles.listTop}>
                    <Badge>{item.category}</Badge>
                    <span className={styles.price}>{item.price}</span>
                  </div>
                  <h3>{item.name} <span className={styles.listSubtitle}>{item.subtitle}</span></h3>
                  <p>{item.description}</p>
                  {item.diet && item.diet.length > 0 && (
                    <div className={styles.dietTags}>
                      {item.diet.map(d => (
                        <span key={d} className={styles.dietTag}>
                          {DIET_LABELS[d].icon} {DIET_LABELS[d].label}
                        </span>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    className={styles.addBtn}
                    onClick={() => {
                      addItem({ id: String(item.id), name: item.name, price: item.price, image: item.image });
                      trackAddToCart({ id: item.id, name: item.name, price: item.price, category: item.category });
                      fireConfetti();
                    }}
                  >
                    <ShoppingCart size={13} /> {t.menuPage.ask}
                  </button>
                </article>
              ))}
            </StaggerGrid>
          )}
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
      <CartDrawer />
    </main>
  );
}
