import { Award, PartyPopper, Music, ShoppingBag } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
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
  return { title: t('valdovino.culture') };
}

const events = [
  {
    icon: 'award',
    gl: {
      name: 'Campionato de Surf de Pantín',
      desc: 'Evento deportivo internacional de referencia mundial que se celebra na Praia de Pantín cada setembro. Atrae a deportistas e público de todo o mundo e é a cita deportiva máis importante do ano en Valdoviño.',
      when: 'Setembro',
    },
    es: {
      name: 'Campeonato de Surf de Pantín',
      desc: 'Evento deportivo internacional de referencia mundial que se celebra en la Playa de Pantín cada septiembre. Atrae a deportistas y público de todo el mundo y es la cita deportiva más importante del año en Valdoviño.',
      when: 'Septiembre',
    },
  },
  {
    icon: 'party',
    gl: {
      name: 'Festas Patronais de Valdoviño',
      desc: 'As festas patronais celébrase en verán con orquestas, gastronomía local, verbenas, fuegos artificiais e actividades para todas as idades. O punto álxido do calendario festivo do concello.',
      when: 'Agosto',
    },
    es: {
      name: 'Fiestas Patronales de Valdoviño',
      desc: 'Las fiestas patronales se celebran en verano con orquestas, gastronomía local, verbenas, fuegos artificiales y actividades para todas las edades. El punto álgido del calendario festivo del municipio.',
      when: 'Agosto',
    },
  },
  {
    icon: 'music',
    gl: {
      name: 'Romaría da Frouxeira',
      desc: 'Tradicional romaría galega na contorna da Lagoa de A Frouxeira, con música de gaita, baile e traxes tradicionais. Un acontecemento que mantén viva a cultura popular galega.',
      when: 'Xuño',
    },
    es: {
      name: 'Romería de la Frouxeira',
      desc: 'Tradicional romería gallega en el entorno de la Laguna de A Frouxeira, con música de gaita, baile y trajes tradicionales. Un acontecimiento que mantiene viva la cultura popular gallega.',
      when: 'Junio',
    },
  },
  {
    icon: 'shopping',
    gl: {
      name: 'Mercado Local de Produtores',
      desc: 'Mercado periódico con produtos artesanais, alimentación local e manualidades de produtores da comarca. Queixos, mel, conservas e artesanía directamente do produtor.',
      when: 'Mensual',
    },
    es: {
      name: 'Mercado Local de Productores',
      desc: 'Mercado periódico con productos artesanales, alimentación local y artesanía de productores de la comarca. Quesos, miel, conservas y artesanía directamente del productor.',
      when: 'Mensual',
    },
  },
];

const intro = {
  gl: 'Valdoviño ten unha rica vida cultural e festiva que reflicte a identidade galega do concello. Eventos deportivos de talla mundial, tradicións ancestrais e unha comunidade unida fan de Valdoviño un lugar especial.',
  es: 'Valdoviño tiene una rica vida cultural y festiva que refleja la identidad gallega del municipio. Eventos deportivos de talla mundial, tradiciones ancestrales y una comunidad unida hacen de Valdoviño un lugar especial.',
};

const ICON_MAP = { award: Award, party: PartyPopper, music: Music, shopping: ShoppingBag };

const whenLabel = { gl: 'Cando', es: 'Cuándo' };

export default function CulturaPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);

  return (
    <div className="container flex flex-col gap-12 py-8 md:py-16">
      <SectionHeader
        as="h1"
        kicker={t('valdovino.title')}
        title={t('valdovino.culture')}
        description={intro[locale]}
      />

      <ul className="grid gap-6 md:grid-cols-2">
        {events.map((event) => {
          const Icon = ICON_MAP[event.icon as keyof typeof ICON_MAP];
          const c = event[locale];
          return (
            <li key={c.name} className="flex flex-col gap-3 rounded border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary-100">
                    <Icon className="h-5 w-5 text-primary-700" aria-hidden />
                  </div>
                  <h2 className="font-kicker text-base font-bold uppercase text-ink">{c.name}</h2>
                </div>
                <span className="shrink-0 rounded bg-surface-alt px-2.5 py-0.5 font-mono text-xs text-muted">
                  {c.when}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-muted">{c.desc}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
