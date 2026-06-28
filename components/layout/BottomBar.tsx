import Link from 'next/link';
import { CalendarDays, Users, MapPin, Shield } from 'lucide-react';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';

interface Props {
  locale: Locale;
}

export function BottomBar({ locale }: Props) {
  const t = createT(locale);
  const items = [
    { href: `/${locale}/calendario`, label: t('bottombar.calendar'), Icon: CalendarDays },
    { href: `/${locale}/equipos`, label: t('bottombar.teams'), Icon: Users },
    { href: `/${locale}/valdovino`, label: t('nav.valdovino'), Icon: MapPin },
    { href: `/${locale}/club`, label: t('bottombar.club'), Icon: Shield },
  ];

  return (
    <nav
      aria-label="Accesos rápidos"
      className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface/95 backdrop-blur md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="grid grid-cols-4">
        {items.map(({ href, label, Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className="flex h-16 flex-col items-center justify-center gap-1 text-ink hover:bg-primary-100 hover:text-primary-900 focus-visible:outline-none focus-visible:bg-primary-100"
            >
              <Icon className="h-5 w-5" aria-hidden strokeWidth={1.75} />
              <span className="font-kicker text-[10px] uppercase tracking-wider">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
