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
  return { title: t('club.history') };
}

const data = {
  gl: {
    intro:
      'A S.D. Valdoviño é un dos clubs de fútbol máis queridos de Ferrolterra. Dende a súa fundación, representou con orgullo ao concello de Valdoviño no fútbol galego, forxando xeracións de xogadores e creando comunidade ao redor do deporte.',
    milestones: [
      {
        year: '1967',
        title: 'Fundación',
        text: 'Nace a Sociedade Deportiva Valdoviño da man dun grupo de afeccionados comprometidos co deporte local. O Campo Municipal convértese no fogar do novo club, que adopta a camiseta laranxa como símbolo de identidade.',
      },
      {
        year: 'Décadas 70–80',
        title: 'Crecemento e canteira',
        text: 'O club aposta pola formación e crea os primeiros equipos de base. A canteira empieza a forxar xogadores que máis tarde defenderán os colores do primeiro equipo, consolidando o ADN do club.',
      },
      {
        year: 'Anos 90–2000',
        title: 'Consolidación deportiva',
        text: 'A S.D. Valdoviño consolídase nas categorías rexionais de FUTGAL e convértese en referente no fútbol da comarca de Ferrolterra. O club crece en número de socios e afección.',
      },
      {
        year: '2010–2020',
        title: 'Expansión de categorías',
        text: 'O clube expande a súa estrutura con novos equipos de base: fútbol sala, prebenxamín, benxamín, e potencia o fútbol feminino. O número de fichas inscritas alcanza máximos históricos.',
      },
      {
        year: '2025–2026',
        title: 'Tempada actual',
        text: 'A S.D. Valdoviño afronta a tempada 2025-2026 na Primeira FUTGAL Grupo I coa ilusión renovada. Oito equipos, centos de xogadores e toda a afección detrás dunha mesma paixón.',
      },
    ],
  },
  es: {
    intro:
      'La S.D. Valdoviño es uno de los clubs de fútbol más queridos de Ferrolterra. Desde su fundación, ha representado con orgullo al municipio de Valdoviño en el fútbol gallego, forjando generaciones de jugadores y creando comunidad alrededor del deporte.',
    milestones: [
      {
        year: '1967',
        title: 'Fundación',
        text: 'Nace la Sociedad Deportiva Valdoviño de la mano de un grupo de aficionados comprometidos con el deporte local. El Campo Municipal se convierte en el hogar del nuevo club, que adopta la camiseta naranja como símbolo de identidad.',
      },
      {
        year: 'Décadas 70–80',
        title: 'Crecimiento y cantera',
        text: 'El club apuesta por la formación y crea los primeros equipos de base. La cantera empieza a forjar jugadores que más tarde defenderán los colores del primer equipo, consolidando el ADN del club.',
      },
      {
        year: 'Años 90–2000',
        title: 'Consolidación deportiva',
        text: 'La S.D. Valdoviño se consolida en las categorías regionales de FUTGAL y se convierte en referente en el fútbol de la comarca de Ferrolterra. El club crece en número de socios y afición.',
      },
      {
        year: '2010–2020',
        title: 'Expansión de categorías',
        text: 'El club expande su estructura con nuevos equipos de base: fútbol sala, prebenjamín, benjamín, y potencia el fútbol femenino. El número de fichas inscritas alcanza máximos históricos.',
      },
      {
        year: '2025–2026',
        title: 'Temporada actual',
        text: 'La S.D. Valdoviño afronta la temporada 2025-2026 en la Primera FUTGAL Grupo I con la ilusión renovada. Ocho equipos, cientos de jugadores y toda la afición detrás de una misma pasión.',
      },
    ],
  },
} as const;

export default function HistoriaPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);
  const content = data[locale];

  return (
    <div className="container flex flex-col gap-12 py-8 md:py-16">
      <SectionHeader
        as="h1"
        kicker={t('nav.club')}
        title={t('club.history')}
        description={content.intro}
      />

      <ol className="relative flex flex-col gap-10 border-l-2 border-primary-100 pl-8">
        {content.milestones.map((m) => (
          <li key={m.year} className="relative">
            <span
              className="absolute -left-[2.15rem] top-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary ring-4 ring-surface"
              aria-hidden
            />
            <time className="block font-kicker text-xs font-bold uppercase tracking-wider text-primary-700">
              {m.year}
            </time>
            <h3 className="mt-1 font-kicker text-lg font-bold uppercase text-ink">{m.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">{m.text}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
