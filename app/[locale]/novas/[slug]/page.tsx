import { StubPage } from '@/components/common/StubPage';
import { LOCALES, type Locale, isLocale } from '@/lib/locales';
import { createT } from '@/lib/i18n';
import { getNews } from '@/lib/data';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  const out: Array<{ locale: string; slug: string }> = [];
  for (const locale of LOCALES) {
    for (const n of getNews()) out.push({ locale, slug: n.slug });
  }
  return out;
}

export default function Page({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);
  const item = getNews().find((n) => n.slug === params.slug);
  if (!item) notFound();
  return <StubPage locale={locale} kicker={t('nav.news')} title={item.title[locale]} />;
}
