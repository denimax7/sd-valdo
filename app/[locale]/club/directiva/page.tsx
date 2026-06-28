import { SectionHeader } from '@/components/common/SectionHeader';
import { getBoard } from '@/lib/data';
import { LOCALES, type Locale, isLocale } from '@/lib/locales';
import { createT } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const t = createT(params.locale);
  return { title: t('club.board') };
}

const intro = {
  gl: 'A xunta directiva da S.D. Valdoviño é o órgano de goberno do club, responsable de tomar as decisións estratéxicas e garantir o bo funcionamento da entidade en beneficio de socios, xogadores e afección.',
  es: 'La junta directiva de la S.D. Valdoviño es el órgano de gobierno del club, responsable de tomar las decisiones estratégicas y garantizar el buen funcionamiento de la entidad en beneficio de socios, jugadores y afición.',
};

export default function DirectivaPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);
  const board = getBoard();

  return (
    <div className="container flex flex-col gap-12 py-8 md:py-16">
      <SectionHeader
        as="h1"
        kicker={t('nav.club')}
        title={t('club.board')}
        description={intro[locale]}
      />

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {board.map((member) => (
          <li
            key={member.name}
            className="flex flex-col gap-1 rounded border border-border bg-surface p-5 shadow-sm"
          >
            <span className="font-kicker text-xs font-bold uppercase tracking-wider text-primary-700">
              {member.role}
            </span>
            <span className="font-display text-lg uppercase text-ink">{member.name}</span>
            {member.since && (
              <span className="mt-1 font-mono text-xs text-muted">
                {locale === 'gl' ? 'Dende' : 'Desde'} {member.since}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
