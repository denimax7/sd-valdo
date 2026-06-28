import Image from 'next/image';
import Link from 'next/link';
import { Camera } from 'lucide-react';
import { driveImgUrl } from '@/lib/drive';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';
import type { Album } from '@/lib/schemas';

interface Props {
  albums: Album[];
  locale: Locale;
}

function fmtDate(iso: string, locale: Locale) {
  return new Date(iso + 'T00:00:00').toLocaleDateString(
    locale === 'gl' ? 'gl-ES' : 'es-ES',
    { day: 'numeric', month: 'long', year: 'numeric' },
  );
}

export function AlbumGrid({ albums, locale }: Props) {
  const t = createT(locale);

  if (albums.length === 0) {
    return (
      <div className="rounded border border-dashed border-border p-10 text-center text-muted">
        <Camera className="mx-auto mb-3 h-10 w-10 opacity-30" aria-hidden />
        <p className="text-sm">{t('gallery.empty')}</p>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {albums.map((album) => {
        const href = `/${locale}/galeria/${album.slug}`;
        const coverSrc = album.coverDriveId
          ? driveImgUrl(album.coverDriveId, 800)
          : `https://picsum.photos/seed/${album.slug}/800/500`;

        return (
          <li key={album.slug}>
            <Link
              href={href}
              className="group block overflow-hidden rounded border border-border bg-surface shadow-sm transition-shadow hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {/* Miniatura */}
              <div className="relative aspect-[16/10] overflow-hidden bg-surface-alt">
                <Image
                  src={coverSrc}
                  alt={album.title[locale]}
                  fill
                  sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                {/* Overlay con nº de fotos */}
                <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-xs text-white backdrop-blur-sm">
                  <Camera className="h-3 w-3" aria-hidden />
                  <span className="font-mono tabular">{album.photoCount}</span>
                </div>
              </div>

              {/* Metadatos */}
              <div className="flex flex-col gap-1 p-4">
                <span className="font-kicker text-[11px] uppercase tracking-wider text-muted">
                  {fmtDate(album.date, locale)}
                  {album.team && (
                    <span className="ml-2 text-primary">
                      · {t(`teams.${album.team}`)}
                    </span>
                  )}
                </span>
                <h3 className="font-display text-lg uppercase leading-tight text-ink group-hover:text-primary-900">
                  {album.title[locale]}
                </h3>
                <span className="mt-1 font-kicker text-xs uppercase tracking-wider text-primary-700">
                  {t('gallery.view_album')} →
                </span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
