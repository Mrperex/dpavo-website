import { MENU_ITEMS } from '@/content/menu';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export const restaurantJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Restaurant',
  '@id': `${SITE_URL}/#restaurant`,
  name: "D'Pavo Pizza",
  alternateName: "D'Pavo Pizzería y Restaurante",
  description: 'Pizzería artesanal urbana tropical en Verón, Punta Cana. Pizza de masa madre, mariscos frescos y vida nocturna.',
  url: SITE_URL,
  telephone: '+18297531995',
  email: 'info@dpavorestaurant.com',
  priceRange: '$$',
  acceptsReservations: 'True',
  currenciesAccepted: 'DOP',
  paymentAccepted: 'Cash, Credit Card',
  servesCuisine: ['Pizza', 'Seafood', 'Dominican', 'Italian'],
  menu: `${SITE_URL}/menu`,
  hasMenu: `${SITE_URL}/#menu`,
  image: [
    `${SITE_URL}/media/red-hero-background.webp`,
    `${SITE_URL}/media/pizza-venue.webp`,
    `${SITE_URL}/media/dpavo-food-1.webp`,
  ],
  logo: `${SITE_URL}/icon.png`,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Plaza Verón Center',
    addressLocality: 'Verón',
    addressRegion: 'La Altagracia',
    postalCode: '23000',
    addressCountry: 'DO',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 18.7073,
    longitude: -68.4538,
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Sunday'], opens: '11:00', closes: '00:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Friday', 'Saturday'], opens: '11:00', closes: '02:00' },
  ],
  sameAs: [
    'https://www.instagram.com/dpavo_pizzeria_y_restaurante',
    'https://www.facebook.com/dpavopizzeria',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Catering Services',
    url: `${SITE_URL}/catering`,
  },
};

export const menuJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Menu',
  '@id': `${SITE_URL}/#menu`,
  name: "D'Pavo Pizza — Menú Completo",
  url: `${SITE_URL}/menu`,
  inLanguage: ['es', 'en'],
  hasMenuSection: ['Pizza', 'Mariscos', 'Picaderas', 'Drinks'].map((category) => ({
    '@type': 'MenuSection',
    name: category,
    hasMenuItem: MENU_ITEMS.filter((i) => i.category === category).map((item) => ({
      '@type': 'MenuItem',
      name: item.name,
      description: item.description,
      image: item.image ? `${SITE_URL}${item.image}` : undefined,
      offers: {
        '@type': 'Offer',
        price: item.price.replace(/[^0-9]/g, ''),
        priceCurrency: 'DOP',
        availability: 'https://schema.org/InStock',
      },
    })),
  })),
};

export function breadcrumbJsonLd(crumbs: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: `${SITE_URL}${c.path}`,
    })),
  };
}
