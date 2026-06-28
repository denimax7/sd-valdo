import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { BottomBar } from '@/components/layout/BottomBar';
import { StatusBanner } from '@/components/layout/StatusBanner';
import { LOCALES, type Locale, isLocale } from '@/lib/locales';
import { getCalendar, getInscriptions } from '@/lib/data';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = params.locale;
  if (!isLocale(locale)) return {};
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { gl: '/gl', es: '/es', 'x-default': '/gl' },
    },
    openGraph: {
      type: 'website',
      locale: locale === 'gl' ? 'gl_ES' : 'es_ES',
      siteName: 'S.D. Valdoviño',
    },
  };
}

export default function LocaleLayout({ children, params }: Props) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const { lastUpdated } = getCalendar();
  const inscriptions = getInscriptions();

  return (
    <div lang={locale} className="flex min-h-screen-safe flex-col">
      {/* Banner de inscricións — encima do header sticky */}
      <StatusBanner data={inscriptions} locale={locale} />
      <Header locale={locale} />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <Footer locale={locale} lastUpdated={lastUpdated} />
      <BottomBar locale={locale} />
    </div>
  );
}
