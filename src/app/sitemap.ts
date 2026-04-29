import type { MetadataRoute } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dpavorestaurant.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
      images: [
        `${SITE_URL}/media/og-image.jpg`,
        `${SITE_URL}/media/red-hero-background.webp`,
        `${SITE_URL}/media/pizza-hero.webp`,
      ],
    },
    {
      url: `${SITE_URL}/menu`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
      images: [
        `${SITE_URL}/media/menu-hero-background.webp`,
        `${SITE_URL}/media/pizza-ham-and-pepperonni.webp`,
        `${SITE_URL}/media/pizza-cheese.webp`,
        `${SITE_URL}/media/pizza-shrimps.webp`,
      ],
    },
    {
      url: `${SITE_URL}/events`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
      images: [`${SITE_URL}/media/dj-events.webp`, `${SITE_URL}/media/nightlife.webp`],
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
      images: [`${SITE_URL}/media/pizza-venue.webp`, `${SITE_URL}/media/dpavo-food-1.webp`],
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
      images: [
        `${SITE_URL}/media/nightlife.webp`,
        `${SITE_URL}/media/dpavo-food-1.webp`,
        `${SITE_URL}/media/dpavo-food-2.webp`,
        `${SITE_URL}/media/dpavo-food-3.webp`,
      ],
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${SITE_URL}/media/pizza-venue.webp`],
    },
    {
      url: `${SITE_URL}/catering`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
      images: [`${SITE_URL}/media/catering-hero.jpg`, `${SITE_URL}/media/dpavo-food-1.webp`],
    },
  ];
}
