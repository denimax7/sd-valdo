import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Camera } from 'lucide-react';
import { driveImgUrl } from '@/lib/drive';
import { SectionHeader } from '@/components/common/SectionHeader';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';
import type { Album } from '@/lib/schemas';

interface Props {
  albums: Album[];
  locale: Locale;
}

export function GalleryTeaser({ albums, locale }: Props) {
  const t = createT(locale);

  // 6 fotos: portada dos primeiros 6 álbumes (xa veñen ordenados por data desc)
  const previews = albums.slice(0, 6);
  if (previews.length === 0) return null;

  return (
    <section className="bg-surface py-12 md:py-20">
      <div className="container flex flex-col gap-8">
        <div className="flex items-end justify-between gap-4">
          <SectionHeader
            kicker={t('gallery.home_kicker')}
            title={t('gallery.home_title')}
          />
          <Link
            href={`/${locale}/galeria`}
            className="hidden font-kicker text-sm font-bold uppercase tracking-wider text-primary-700 hover:text-primary-900 md:inline-flex md:items-center md:gap-1 shrink-0"
          >
            {t('gallery.home_cta')} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        {/* Grid 2×3 estático */}
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:gap-3">
          {previews.map((album) => {
            const src = album.coverDriveId
              ? driveImgUrl(album.coverDriveId, 800)
              : `https://picsum.photos/seed/${album.slug}/800/500`;

            return (
              <li key={album.slug}>
                <Link
                  href={`/${locale}/galeria/${album.slug}`}
                  className="group relative block aspect-square overflow-hidden rounded border border-border/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={album.title[locale]}
                >
                  <Image
                    src={src}
                    alt={album.title[locale]}
                    fill
                    sizes="(max-width:640px) 50vw, 33vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Overlay con título */}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/70 via-black/0 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="font-display text-sm uppercase leading-tight text-white line-clamp-2">
                      {album.title[locale]}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex justify-center md:hidden">
          <Link
            href={`/${locale}/galeria`}
            className="inline-flex items-center gap-1 font-kicker text-sm font-bold uppercase tracking-wider text-primary-700 hover:text-primary-900"
          >
            <Camera className="h-4 w-4" aria-hidden />
            {t('gallery.home_cta')}
          </Link>
        </div>
      </div>
    </section>
  );
}
