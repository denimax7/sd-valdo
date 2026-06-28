import type { MetadataRoute } from 'next';
import { LOCALES } from '@/lib/locales';
import { TEAM_IDS } from '@/lib/schemas';
import { getNews } from '@/lib/data';
import { fetchAlbums } from '@/lib/gallery';

const BASE = 'https://sdvaldovino.gal';

const staticRoutes = [
  '',
  '/club',
  '/club/historia',
  '/club/instalacions',
  '/club/directiva',
  '/club/corpo-tecnico',
  '/club/contacto',
  '/equipos',
  '/valdovino',
  '/valdovino/concello',
  '/valdovino/praias-e-natureza',
  '/valdovino/cultura-e-festas',
  '/calendario',
  '/novas',
  '/galeria',
  '/legal/aviso-legal',
  '/legal/privacidade',
  '/legal/cookies',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = [];
  for (const locale of LOCALES) {
    for (const r of staticRoutes) {
      urls.push({
        url: `${BASE}/${locale}${r}`,
        lastModified: now,
        changeFrequency: r === '' || r === '/calendario' || r === '/novas' ? 'weekly' : 'monthly',
        priority: r === '' ? 1 : 0.6,
      });
    }
    for (const id of TEAM_IDS) {
      urls.push({
        url: `${BASE}/${locale}/equipos/${id}`,
        lastModified: now,
        changeFrequency: 'monthly',
        priority: 0.5,
      });
    }
    for (const album of await fetchAlbums()) {
      urls.push({
        url: `${BASE}/${locale}/galeria/${album.slug}`,
        lastModified: new Date(album.date),
        changeFrequency: 'yearly',
        priority: 0.4,
      });
    }
    for (const n of getNews()) {
      urls.push({
        url: `${BASE}/${locale}/novas/${n.slug}`,
        lastModified: new Date(n.date),
        changeFrequency: 'yearly',
        priority: 0.4,
      });
    }
  }
  return urls;
}
