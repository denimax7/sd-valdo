'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { driveImgUrl } from '@/lib/drive';
import type { DrivePhoto } from '@/lib/schemas';

interface Props {
  photos: DrivePhoto[];
  albumTitle: string;
  openLabel: string;
  prevLabel: string;
  nextLabel: string;
  closeLabel: string;
}

export function PhotoMasonry({ photos, albumTitle, openLabel, prevLabel, nextLabel, closeLabel }: Props) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  const close = useCallback(() => setLightboxIdx(null), []);

  const prev = useCallback(() =>
    setLightboxIdx((i) => (i === null ? null : (i - 1 + photos.length) % photos.length)),
    [photos.length],
  );

  const next = useCallback(() =>
    setLightboxIdx((i) => (i === null ? null : (i + 1) % photos.length)),
    [photos.length],
  );

  // Teclado: Escape, ←, →
  useEffect(() => {
    if (lightboxIdx === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxIdx, close, prev, next]);

  // Bloquear scroll do body co lightbox aberto
  useEffect(() => {
    document.body.style.overflow = lightboxIdx !== null ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [lightboxIdx]);

  // Swipe táctil no lightbox
  let touchStartX = 0;
  function onTouchStart(e: React.TouchEvent) { touchStartX = e.touches[0]?.clientX ?? 0; }
  function onTouchEnd(e: React.TouchEvent) {
    const delta = (e.changedTouches[0]?.clientX ?? 0) - touchStartX;
    if (Math.abs(delta) > 50) delta < 0 ? next() : prev();
  }

  return (
    <>
      {/* ── Masonry CSS puro ─────────────────────────────────────────────── */}
      <div
        className="columns-2 gap-3 md:columns-3 lg:columns-4"
        style={{ columnFill: 'balance' }}
      >
        {photos.map((photo, idx) => {
          const src = driveImgUrl(photo.id, 800);
          return (
            <button
              key={photo.id}
              type="button"
              onClick={() => setLightboxIdx(idx)}
              aria-label={`${openLabel} — ${photo.name || idx + 1}`}
              className="group mb-3 block w-full overflow-hidden rounded break-inside-avoid border border-border/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <div className="relative">
                <Image
                  src={src}
                  alt={photo.name || `Foto ${idx + 1} — ${albumTitle}`}
                  width={800}
                  height={600}
                  sizes="(max-width:640px) 50vw, (max-width:1024px) 33vw, 25vw"
                  loading={idx < 8 ? 'eager' : 'lazy'}
                  className="w-full object-cover transition-opacity duration-200 group-hover:opacity-90"
                  unoptimized // lh3.googleusercontent.com xa redimensiona
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/20" aria-hidden />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Lightbox ─────────────────────────────────────────────────────── */}
      {lightboxIdx !== null && (() => {
        const photo = photos[lightboxIdx]!;
        const fullSrc = driveImgUrl(photo.id, 1920);
        return (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={albumTitle}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95"
            onClick={close}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Imaxe */}
            <div
              className="relative max-h-[90svh] max-w-[95vw]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={fullSrc}
                alt={photo.name || `Foto ${lightboxIdx + 1}`}
                width={1920}
                height={1080}
                className="max-h-[90svh] w-auto rounded object-contain"
                unoptimized
                priority
              />
            </div>

            {/* Contador */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono tabular text-xs text-white/60">
              {lightboxIdx + 1} / {photos.length}
            </div>

            {/* Pechar */}
            <button
              type="button"
              onClick={close}
              aria-label={closeLabel}
              className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>

            {/* Navegación prev/next */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label={prevLabel}
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                photos.length <= 1 && 'hidden',
              )}
            >
              <ChevronLeft className="h-6 w-6" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label={nextLabel}
              className={cn(
                'absolute right-3 top-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded bg-white/10 text-white hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white',
                photos.length <= 1 && 'hidden',
              )}
            >
              <ChevronRight className="h-6 w-6" aria-hidden />
            </button>
          </div>
        );
      })()}
    </>
  );
}
