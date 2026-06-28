import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';
import { LanguageSwitcher } from './LanguageSwitcher';
import { MobileDrawer } from './MobileDrawer';
import { getNavItems } from './nav-config';

interface Props {
  locale: Locale;
}

export function Header({ locale }: Props) {
  const t = createT(locale);
  const items = getNavItems(locale);
  const home = `/${locale}`;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full border-b border-border/60',
        'bg-surface/80 backdrop-blur-md supports-[backdrop-filter]:bg-surface/70',
      )}
    >
      <div className="container flex h-14 items-center justify-between gap-4 md:h-20">
        {/* Logo */}
        <Link href={home} className="flex items-center gap-3" aria-label={t('site.name')}>
          <Image
            src="/crests/sd-valdovino.png"
            alt=""
            width={40}
            height={40}
            className="h-9 w-9 object-contain md:h-12 md:w-12"
            priority
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-base uppercase text-ink md:text-xl">
              S.D. Valdoviño
            </span>
            <span className="hidden font-kicker text-[10px] uppercase tracking-wider text-muted md:inline">
              {t('site.tagline')}
            </span>
          </span>
        </Link>

        {/* Nav desktop */}
        <nav aria-label="Principal" className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center gap-1">
            {items.map((it) => (
              <li key={it.href} className="group relative">
                <Link
                  href={it.href}
                  className="inline-flex h-11 items-center gap-1 rounded px-3 font-kicker text-sm font-bold uppercase tracking-wider text-ink hover:bg-primary-100 hover:text-primary-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                >
                  {it.label}
                  {it.children && <ChevronDown className="h-3.5 w-3.5 opacity-60" aria-hidden />}
                </Link>
                {it.children && (
                  <div className="invisible absolute left-0 top-full pt-1 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                    <ul className="min-w-[220px] rounded border border-border bg-surface py-2 shadow-lg">
                      {it.children.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            className="block px-4 py-2 text-sm text-ink hover:bg-primary-100 hover:text-primary-900"
                          >
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher current={locale} variant="header" />
          </div>
          <MobileDrawer locale={locale} />
        </div>
      </div>
    </header>
  );
}
