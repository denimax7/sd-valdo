import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';
import type { NewsItem } from '@/lib/schemas';

interface Props {
  item: NewsItem;
  locale: Locale;
  variant?: 'featured' | 'default';
}

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === 'gl' ? 'gl-ES' : 'es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function NewsCard({ item, locale, variant = 'default' }: Props) {
  const t = createT(locale);
  const href = `/${locale}/novas/${item.slug}`;
  const title = item.title[locale];
  const excerpt = item.excerpt[locale];
  const date = formatDate(item.date, locale);

  if (variant === 'featured') {
    return (
      <article className="group relative overflow-hidden rounded border border-border">
        <Link href={href} className="block">
          <div className="relative aspect-[16/10] w-full overflow-hidden">
            <Image
              src={item.cover}
              alt={title}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 hero-gradient" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 text-white">
              <span className="kicker-line text-primary-100 mb-2">{date}</span>
              <h3 className="font-display text-fluid-h3 leading-tight uppercase">{title}</h3>
              <p className="mt-2 max-w-2xl text-sm text-white/80">{excerpt}</p>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  return (
    <article className={cn('group flex flex-col overflow-hidden rounded border border-border bg-surface')}>
      <Link href={href} className="flex flex-col">
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={item.cover}
            alt={title}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
          <span className="font-kicker text-xs uppercase tracking-wider text-primary-700">{date}</span>
          <h3 className="font-display text-xl leading-tight uppercase">{title}</h3>
          <p className="text-sm text-muted">{excerpt}</p>
          <span className="mt-2 inline-flex items-center gap-1 font-kicker text-xs uppercase tracking-wider text-accent group-hover:text-primary-700">
            {t('common.read_more')} <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </span>
        </div>
      </Link>
    </article>
  );
}
