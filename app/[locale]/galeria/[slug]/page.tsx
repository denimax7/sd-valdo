import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Camera } from 'lucide-react';
import { notFound } from 'next/navigation';
import { PhotoMasonry } from '@/components/gallery/PhotoMasonry';
import { SectionHeader } from '@/components/common/SectionHeader';
import { fetchAlbums, fetchAlbum } from '@/lib/gallery';
import { createT } from '@/lib/i18n';
import { LOCALES, type Locale, isLocale } from '@/lib/locales';

interface Params { locale: string; slug: string }

// Pre-renderiza todas as combinacións locale × slug en build time
export async function generateStaticParams(): Promise<Params[]> {
  const albums = await fetchAlbums();
  const out: Params[] = [];
  for (const locale of LOCALES) {
    for (const album of albums) {
      out.push({ locale, slug: album.slug });
    }
  }
  // Placeholder so static export doesn't fail when Google Drive isn't configured.
  // These paths hit notFound() at render time, producing clean 404 pages.
  if (out.length === 0) {
    return LOCALES.map((locale) => ({ locale, slug: '__empty__' }));
  }
  return out;
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const album = await fetchAlbum(params.slug);
  if (!album) return {};
  return { title: album.title[params.locale as Locale] };
}

export default async function AlbumPage({ params }: { params: Params }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);

  const album = await fetchAlbum(params.slug);
  if (!album) notFound();

  const dateLabel = new Date(album.date + 'T00:00:00').toLocaleDateString(
    locale === 'gl' ? 'gl-ES' : 'es-ES',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );

  return (
    <div className="container flex flex-col gap-8 py-8 md:py-12">
      {/* Breadcrumb */}
      <Link
        href={`/${locale}/galeria`}
        className="inline-flex items-center gap-1 font-kicker text-sm uppercase tracking-wider text-muted hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        {t('gallery.back')}
      </Link>

      <SectionHeader
        as="h1"
        kicker={dateLabel + (album.team ? ` · ${t(`teams.${album.team}`)}` : '')}
        title={album.title[locale]}
        description={t('gallery.photos').replace('{n}', String(album.photoCount))}
      />

      {album.photos.length === 0 ? (
        <div className="rounded border border-dashed border-border p-10 text-center text-muted">
          <Camera className="mx-auto mb-3 h-10 w-10 opacity-30" aria-hidden />
          <p className="text-sm">{t('gallery.empty')}</p>
        </div>
      ) : (
        <PhotoMasonry
          photos={album.photos}
          albumTitle={album.title[locale]}
          openLabel={t('gallery.open_photo')}
          prevLabel={t('gallery.prev')}
          nextLabel={t('gallery.next')}
          closeLabel={t('gallery.close_lightbox')}
        />
      )}
    </div>
  );
}
