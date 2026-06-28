import type { Metadata } from 'next';
import { SectionHeader } from '@/components/common/SectionHeader';
import { AlbumGrid } from '@/components/gallery/AlbumGrid';
import { fetchAlbums } from '@/lib/gallery';
import { createT } from '@/lib/i18n';
import { LOCALES, type Locale, isLocale } from '@/lib/locales';
import { notFound } from 'next/navigation';

export const revalidate = 120;

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  if (!isLocale(params.locale)) return {};
  const t = createT(params.locale);
  return { title: t('gallery.title') };
}

export default async function GaleriaPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);

  const albums = await fetchAlbums();

  return (
    <div className="container flex flex-col gap-8 py-8 md:py-12">
      <SectionHeader
        as="h1"
        kicker={t('gallery.kicker')}
        title={t('gallery.title')}
        description={t('gallery.subtitle')}
      />
      <AlbumGrid albums={albums} locale={locale} />
    </div>
  );
}
