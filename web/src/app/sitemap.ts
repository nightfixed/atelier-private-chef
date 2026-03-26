import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

const BASE = 'https://atelierprivatedining.ro';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: BASE,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${BASE}/manifest`,
      lastModified: new Date('2026-03-23'),
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: `${BASE}/codex-guest-system.html`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
  ];
}
