import { StubPage } from '@/components/common/StubPage';
import { LOCALES, type Locale, isLocale } from '@/lib/locales';
import { createT } from '@/lib/i18n';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default function Page({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);
  return <StubPage locale={locale} kicker={t('nav.news')} title={t('nav.news')} />;
}
