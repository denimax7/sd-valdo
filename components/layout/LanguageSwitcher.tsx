'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LOCALES, type Locale, isLocale } from '@/lib/locales';
import { createT } from '@/lib/i18n';

interface Props {
  current: Locale;
  variant?: 'header' | 'drawer' | 'footer';
  className?: string;
}

/** Constrúe a mesma ruta no idioma destino. */
function pathFor(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 0 || !isLocale(parts[0]!)) return `/${target}`;
  parts[0] = target;
  return '/' + parts.join('/');
}

export function LanguageSwitcher({ current, variant = 'header', className }: Props) {
  const pathname = usePathname() ?? `/${current}`;
  const t = createT(current);

  // Persistir elección
  useEffect(() => {
    try {
      window.localStorage.setItem('sdv.locale', current);
    } catch {
      /* noop */
    }
  }, [current]);

  if (variant === 'drawer') {
    // Segmento grande 50/50 para o pulgar
    return (
      <div className={cn('grid grid-cols-2 overflow-hidden rounded border border-border', className)} role="group" aria-label={t('language.switch_to_es')}>
        {LOCALES.map((l) => {
          const active = l === current;
          return (
            <Link
              key={l}
              href={pathFor(pathname, l)}
              aria-label={l === 'es' ? t('language.switch_to_es') : t('language.switch_to_gl')}
              aria-current={active ? 'true' : undefined}
              className={cn(
                'flex h-14 items-center justify-center font-kicker text-base font-bold uppercase tracking-wider transition-colors tap',
                active
                  ? 'bg-primary text-white'
                  : 'bg-surface text-accent hover:bg-primary-100',
              )}
            >
              {l.toUpperCase()}
            </Link>
          );
        })}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div className={cn('inline-flex items-center gap-1 text-xs', className)}>
        {LOCALES.map((l, i) => {
          const active = l === current;
          return (
            <span key={l} className="contents">
              {i > 0 && <span className="text-white/30" aria-hidden>·</span>}
              <Link
                href={pathFor(pathname, l)}
                aria-current={active ? 'true' : undefined}
                aria-label={l === 'es' ? t('language.switch_to_es') : t('language.switch_to_gl')}
                className={cn(
                  'font-kicker uppercase tracking-wider transition-colors',
                  active ? 'text-primary-300' : 'text-white/70 hover:text-white',
                )}
              >
                {l.toUpperCase()}
              </Link>
            </span>
          );
        })}
      </div>
    );
  }

  // header: toggle con barra vertical
  return (
    <div
      className={cn('inline-flex h-10 items-stretch overflow-hidden rounded border border-border', className)}
      role="group"
      aria-label={t('language.switch_to_es')}
    >
      {LOCALES.map((l, i) => {
        const active = l === current;
        return (
          <span key={l} className="contents">
            {i > 0 && <span aria-hidden className="w-px self-stretch bg-border" />}
            <Link
              href={pathFor(pathname, l)}
              aria-current={active ? 'true' : undefined}
              aria-label={l === 'es' ? t('language.switch_to_es') : t('language.switch_to_gl')}
              className={cn(
                'flex min-w-[44px] items-center justify-center px-3 font-kicker text-xs font-bold uppercase tracking-wider transition-colors',
                active
                  ? 'bg-primary text-white'
                  : 'bg-surface text-accent hover:bg-primary-100',
              )}
            >
              {l.toUpperCase()}
            </Link>
          </span>
        );
      })}
    </div>
  );
}
