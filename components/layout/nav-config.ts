import type { Locale } from '@/lib/locales';
import { createT } from '@/lib/i18n';

export interface NavItem {
  href: string;
  labelKey: string;
  children?: Array<{ href: string; labelKey: string }>;
}

export function getNavItems(locale: Locale) {
  const t = createT(locale);
  const base = `/${locale}`;
  return [
    {
      href: `${base}/club`,
      label: t('nav.club'),
      children: [
        { href: `${base}/club/historia`, label: t('club.history') },
        { href: `${base}/club/instalacions`, label: t('club.facilities') },
        { href: `${base}/club/directiva`, label: t('club.board') },
        { href: `${base}/club/corpo-tecnico`, label: t('club.staff') },
        { href: `${base}/club/contacto`, label: t('club.contact') },
      ],
    },
    {
      href: `${base}/equipos`,
      label: t('nav.teams'),
      children: [
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
      href: `${base}/valdovino`,
      label: t('nav.valdovino'),
      children: [
        { href: `${base}/valdovino/concello`, label: t('valdovino.concello') },
        { href: `${base}/valdovino/praias-e-natureza`, label: t('valdovino.beaches') },
        { href: `${base}/valdovino/cultura-e-festas`, label: t('valdovino.culture') },
      ],
    },
    { href: `${base}/calendario`, label: t('nav.calendar') },
    { href: `${base}/galeria`, label: t('nav.gallery') },
  ];
}

export type NavTree = ReturnType<typeof getNavItems>;
