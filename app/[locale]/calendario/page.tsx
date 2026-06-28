import { CalendarView } from '@/components/calendario/CalendarView';
import { SectionHeader } from '@/components/common/SectionHeader';
import { getCalendar } from '@/lib/data';
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
  return { title: t('calendar.title') };
}

export default function CalendarioPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);
  const { matches } = getCalendar();

  return (
    <div className="container flex flex-col gap-8 py-8 md:py-12">
      <SectionHeader
        as="h1"
        kicker={t('calendar.title')}
        title={t('calendar.title')}
        description={t('calendar.subtitle')}
      />
      <CalendarView matches={matches} locale={locale} />
    </div>
  );
}
