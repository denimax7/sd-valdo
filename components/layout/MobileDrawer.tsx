'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Menu, Instagram, Twitter, ChevronRight } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { LanguageSwitcher } from './LanguageSwitcher';
import { getNavItems } from './nav-config';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';

interface Props {
  locale: Locale;
}

export function MobileDrawer({ locale }: Props) {
  const [open, setOpen] = useState(false);
  const t = createT(locale);
  const items = getNavItems(locale);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        aria-label={t('nav.open_menu')}
        className="inline-flex h-11 w-11 items-center justify-center rounded text-ink hover:bg-primary-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:hidden tap"
      >
        <Menu className="h-6 w-6" aria-hidden />
      </SheetTrigger>

      <SheetContent side="right" className="flex flex-col p-0">
        <SheetTitle className="sr-only">{t('nav.open_menu')}</SheetTitle>
        <SheetDescription className="sr-only">{t('site.name')}</SheetDescription>

        <header className="flex items-center justify-between border-b border-border px-5 py-4">
          <span className="font-display text-2xl uppercase text-primary">SDV</span>
        </header>

        <nav className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-border">
            {items.map((it) => (
              <li key={it.href}>
                <Link
                  href={it.href}
                  onClick={() => setOpen(false)}
                  className="flex h-14 items-center justify-between px-5 font-display text-lg uppercase text-ink hover:bg-primary-100"
                >
                  {it.label}
                  <ChevronRight className="h-4 w-4 text-muted" aria-hidden />
                </Link>
                {it.children && (
                  <ul className="bg-surface-alt">
                    {it.children.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setOpen(false)}
                          className="flex h-12 items-center px-8 text-sm text-muted hover:text-primary"
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>

        <footer className="border-t border-border bg-surface-alt p-5">
          <div className="flex items-center justify-center gap-4 pb-4">
            <a
              href="https://instagram.com/sd.valdovino"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="inline-flex h-11 w-11 items-center justify-center rounded text-accent hover:bg-primary-100 hover:text-primary tap"
            >
              <Instagram className="h-5 w-5" aria-hidden />
            </a>
            <a
              href="https://twitter.com/sd_valdovino"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter / X"
              className="inline-flex h-11 w-11 items-center justify-center rounded text-accent hover:bg-primary-100 hover:text-primary tap"
            >
              <Twitter className="h-5 w-5" aria-hidden />
            </a>
          </div>
          <LanguageSwitcher current={locale} variant="drawer" />
        </footer>
      </SheetContent>
    </Sheet>
  );
}
