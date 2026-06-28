'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Instagram, Twitter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';
import { LanguageSwitcher } from './LanguageSwitcher';

interface Props {
  locale: Locale;
  lastUpdated?: string;
}

interface Column {
  key: string;
  title: string;
  links: Array<{ href: string; label: string }>;
}

export function Footer({ locale, lastUpdated }: Props) {
  const t = createT(locale);
  const base = `/${locale}`;
  const [open, setOpen] = useState<string | null>(null);

  const columns: Column[] = [
    {
      key: 'club',
      title: t('footer.columns.club'),
      links: [
        { href: `${base}/club/historia`, label: t('club.history') },
        { href: `${base}/club/instalacions`, label: t('club.facilities') },
        { href: `${base}/club/directiva`, label: t('club.board') },
        { href: `${base}/club/contacto`, label: t('club.contact') },
      ],
    },
    {
      key: 'teams',
      title: t('footer.columns.teams'),
      links: [
        { href: `${base}/equipos/primer-equipo`, label: t('teams.primer-equipo') },
        { href: `${base}/equipos/xuvenil`, label: t('teams.xuvenil') },
        { href: `${base}/equipos/cadete`, label: t('teams.cadete') },
        { href: `${base}/equipos/infantil`, label: t('teams.infantil') },
        { href: `${base}/equipos/alevin`, label: t('teams.alevin') },
        { href: `${base}/equipos/benxamin`, label: t('teams.benxamin') },
        { href: `${base}/equipos/prebenxamin`, label: t('teams.prebenxamin') },
        { href: `${base}/equipos/veteranos`, label: t('teams.veteranos') },
      ],
    },
    {
      key: 'valdovino',
      title: t('footer.columns.valdovino'),
      links: [
        { href: `${base}/valdovino/concello`, label: t('valdovino.concello') },
        { href: `${base}/valdovino/praias-e-natureza`, label: t('valdovino.beaches') },
        { href: `${base}/valdovino/cultura-e-festas`, label: t('valdovino.culture') },
      ],
    },
    {
      key: 'legal',
      title: t('footer.columns.legal'),
      links: [
        { href: `${base}/legal/aviso-legal`, label: t('footer.legal.notice') },
        { href: `${base}/legal/privacidade`, label: t('footer.legal.privacy') },
        { href: `${base}/legal/cookies`, label: t('footer.legal.cookies') },
      ],
    },
  ];

  return (
    <footer className="mt-16 bg-accent text-white">
      <div className="container py-10 md:py-14">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-3">
              {/* Fix logo: contedor cadrado con object-contain para non achatalo */}
              <div className="relative h-14 w-14 shrink-0">
                <img
                  src="/crests/sd-valdovino.png"
                  alt="Escudo S.D. Valdoviño"
                  width={56}
                  height={56}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="font-display text-xl uppercase leading-tight text-white">
                  S.D. Valdoviño
                </span>
                <span className="font-kicker text-xs uppercase tracking-wider text-white/60">
                  {t('site.since')}
                </span>
              </div>
            </div>
            <p className="mt-3 text-sm text-white/80">{t('footer.tagline')}</p>

            <div className="mt-5 flex items-center gap-2">
              <a
                href="https://instagram.com/sd.valdovino"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="inline-flex h-11 w-11 items-center justify-center rounded border border-white/20 hover:bg-white/10 tap"
              >
                <Instagram className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="https://twitter.com/sd_valdovino"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter / X"
                className="inline-flex h-11 w-11 items-center justify-center rounded border border-white/20 hover:bg-white/10 tap"
              >
                <Twitter className="h-5 w-5" aria-hidden />
              </a>
            </div>
          </div>

          {/* Desktop: 4 columnas */}
          <div className="hidden grid-cols-2 gap-8 md:grid lg:grid-cols-4 lg:gap-12">
            {columns.map((col) => (
              <div key={col.key}>
                <h4 className="font-kicker text-sm font-bold uppercase tracking-wider text-primary-300">
                  {col.title}
                </h4>
                <ul className="mt-4 flex flex-col gap-2">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm text-white/80 hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Móbil: acordeón */}
          <div className="grid gap-2 md:hidden">
            {columns.map((col) => {
              const isOpen = open === col.key;
              return (
                <div key={col.key} className="border-b border-white/10 pb-2">
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : col.key)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between py-3 text-left font-kicker text-sm font-bold uppercase tracking-wider text-primary-300 tap"
                  >
                    {col.title}
                    <ChevronDown
                      className={cn('h-4 w-4 transition-transform', isOpen && 'rotate-180')}
                      aria-hidden
                    />
                  </button>
                  {isOpen && (
                    <ul className="flex flex-col gap-2 pb-3">
                      {col.links.map((l) => (
                        <li key={l.href}>
                          <Link href={l.href} className="text-sm text-white/80 hover:text-white">
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <hr className="my-8 border-white/10" />

        <div className="flex flex-col items-start gap-4 text-xs text-white/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1">
            <p>© {new Date().getFullYear()} S.D. Valdoviño · {t('footer.made_in')}</p>
            <p>Desenvolvido por <span className="text-white/80">Lambda Group</span></p>
          </div>
          <div className="flex items-center gap-4">
            {lastUpdated && (
              <span className="font-mono tabular text-[11px]">
                {t('calendar.last_updated', { date: lastUpdated })}
              </span>
            )}
            <LanguageSwitcher current={locale} variant="footer" />
          </div>
        </div>
      </div>
    </footer>
  );
}
