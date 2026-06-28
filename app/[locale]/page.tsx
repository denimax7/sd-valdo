import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/common/SectionHeader';
import { MatchCard } from '@/components/match/MatchCard';
import { Countdown } from '@/components/match/Countdown';
import { AddToCalendarButton } from '@/components/match/AddToCalendarButton';
import { getTeams, nextMatchOverall, pastResults } from '@/lib/data';
import { fetchAlbums } from '@/lib/gallery';
import { GalleryTeaser } from '@/components/gallery/GalleryTeaser';
import { createT } from '@/lib/i18n';
import { LOCALES, type Locale, isLocale } from '@/lib/locales';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);

  const albums = await fetchAlbums();
  const next = nextMatchOverall();
  const results = pastResults(5);
  const teams = getTeams();

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-hero-mobile flex-col justify-end overflow-hidden md:min-h-hero-desktop">
        <Image
          src="/hero.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 hero-gradient" aria-hidden />
        <div className="container relative z-10 flex flex-col gap-5 pb-10 pt-24 text-white md:pb-20 md:pt-32">
          <span className="kicker-line text-primary-100">{t('home.hero.kicker')}</span>
          <h1
            className="font-display uppercase leading-[0.92] tracking-tight"
            style={{ fontSize: 'clamp(2.25rem, 6vw, 4.5rem)' }}
          >
            {t('home.hero.title')}
          </h1>
          <p className="max-w-2xl text-base text-white/85 sm:text-lg">
            {t('home.hero.description')}
          </p>
          <div className="mt-2 flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="primary" size="lg">
              <Link href={`/${locale}/calendario`}>
                {t('home.hero.cta_primary')}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href={`/${locale}/club`}>{t('home.hero.cta_secondary')}</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* PRÓXIMO PARTIDO */}
      <section className="bg-surface py-12 md:py-20">
        <div className="container flex flex-col gap-8">
          <SectionHeader
            kicker={t('home.next_match.kicker')}
            title={t('home.next_match.kicker')}
            align="left"
            className="md:hidden"
          />
          {next ? (
            <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:items-center">
              <MatchCard match={next} locale={locale} variant="hero" />
              <div className="flex flex-col gap-4 rounded border border-border bg-surface-alt p-5">
                <span className="kicker-line text-primary-700">{t('home.next_match.countdown')}</span>
                <Countdown to={next.kickoff} locale={locale} />
                <AddToCalendarButton match={next} label={t('match.add_to_calendar')} />
              </div>
            </div>
          ) : (
            <p className="rounded border border-dashed border-border p-8 text-center text-muted">
              {t('home.next_match.no_match')}
            </p>
          )}
        </div>
      </section>

      {/* ÚLTIMOS RESULTADOS */}
      <section className="bg-surface-alt py-12 md:py-20">
        <div className="container flex flex-col gap-6">
          <div className="flex items-end justify-between gap-4">
            <SectionHeader
              kicker={t('home.results.kicker')}
              title={t('home.results.title')}
            />
            <Link
              href={`/${locale}/calendario`}
              className="hidden font-kicker text-sm font-bold uppercase tracking-wider text-primary-700 hover:text-primary-900 md:inline-flex md:items-center md:gap-1"
            >
              {t('home.results.view_all')} <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
          {results.length > 0 ? (
            <div className="snap-x-strip -mx-4 flex gap-3 overflow-x-auto px-4 md:mx-0 md:px-0">
              {results.map((m) => (
                <MatchCard key={m.id} match={m} locale={locale} variant="result" />
              ))}
            </div>
          ) : (
            <p className="text-muted">—</p>
          )}
        </div>
      </section>

      {/* EQUIPOS */}
      <section className="bg-surface-alt py-12 md:py-20">
        <div className="container flex flex-col gap-8">
          <SectionHeader
            kicker={t('home.teams_section.kicker')}
            title={t('home.teams_section.title')}
            description={t('home.teams_section.description')}
          />
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {teams.map((team) => (
              <li key={team.id}>
                <Link
                  href={`/${locale}/equipos/${team.id}`}
                  className="group flex h-full flex-col gap-1 rounded border border-border bg-surface p-4 transition-colors hover:border-primary hover:bg-primary-100"
                >
                  <span className="font-kicker text-xs uppercase tracking-wider text-muted">
                    {team.category}
                  </span>
                  <span className="font-display text-lg uppercase text-ink group-hover:text-primary-900">
                    {t(`teams.${team.id}`)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* GALERÍA */}
      <GalleryTeaser albums={albums} locale={locale} />

      {/* VALDOVIÑO */}
      <section className="relative isolate overflow-hidden bg-accent py-12 text-white md:py-20">
        <Image
          src="https://picsum.photos/seed/valdovino-frouxeira/1920/900"
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-30"
        />
        <div className="container relative z-10 flex flex-col gap-6">
          <span className="kicker-line text-primary-300">
            {t('home.valdovino_section.kicker')}
          </span>
          <h2
            className="max-w-3xl font-display uppercase leading-[0.95]"
            style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.5rem)' }}
          >
            {t('home.valdovino_section.title')}
          </h2>
          <p className="max-w-2xl text-white/85">
            {t('home.valdovino_section.description')}
          </p>
          <div>
            <Button asChild variant="primary" size="lg">
              <Link href={`/${locale}/valdovino`}>
                {t('home.valdovino_section.cta')} <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
