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
      'A S.D. Valdoviño é un club de fútbol con historia no concello de Valdoviño. Dende as súas orixes como equipo afeccionado sen federar, pasando pola súa inscrición oficial en 1996, ata a actual Escola de Fútbol, o club medra e constrúe comunidade ao redor do deporte.',
    milestones: [
      {
        year: 'Orixes',
        title: 'Os comezos',
        text: 'Un grupo de veciños de Valdoviño xúntanse para xogar ao fútbol representando ao seu concello de forma afeccionada e sen federar. O equipo enfrontábase a outros clubs da comarca de Ferrolterra, forxando os primeiros lazos entre o fútbol e a comunidade local.',
      },
      {
        year: 'Décadas 80–1996',
        title: 'Competicións comarcais',
        text: 'O clube continúa participando en competicións non federadas da comarca de Ferrolterra. Durante estes anos só se conta cun equipo na categoría senior, que vai consolidando a identidade deportiva do concello.',
      },
      {
        year: '1996',
        title: 'Inscrición oficial',
        text: 'O clube inscríbese no Rexistro de Clubes e Fundacións e Entidades Deportivas de Galicia e comeza a participar en competicións federadas, inicialmente nas categorías senior e xuvenil. O equipo entrena primeiro no campo de San Bartolo e logo trasládase ao campo de "Atios", preto do colexio.',
      },
      {
        year: '2000–2020',
        title: 'Competición FUTGAL',
        text: 'O equipo senior continúa competindo nas categorías locais 1ª FUTGAL, 2ª FUTGAL e 3ª FUTGAL en diferentes anos, mantendo a presenza do concello de Valdoviño no fútbol galego.',
      },
      {
        year: '2024',
        title: 'Retorno do equipo xuvenil',
        text: 'Grazas a un grupo de mozos, a maioría deles veciños do concello, retómase o equipo xuvenil. Os resultados non se fan esperar: excelente tempada 2024-2025, alcanzando a final da Copa de Consolación da Delegación da RFGF en Ferrol.',
      },
      {
        year: '2025',
        title: 'Nace a Escola de Fútbol',
        text: 'Tempada moi importante para o clube: nace a Escola de Fútbol co fútbol base. Neste primeiro ano compítese nas categorías de Fútbol 8 Prebenxamín, Benxamín e Alevín.',
      },
      {
        year: '2025–2026',
        title: 'Tempada actual',
        text: 'Afrontamos esta nova tempada con moitísima ilusión e tratando de crecer paso a paso, consolidando os equipos existentes e tratando de avanzar nas categorías infantil e cadete.',
      },
    ],
  },
  es: {
    intro:
      'La S.D. Valdoviño es un club de fútbol con historia en el municipio de Valdoviño. Desde sus orígenes como equipo aficionado sin federar, pasando por su inscripción oficial en 1996, hasta la actual Escola de Fútbol, el club crece y construye comunidad alrededor del deporte.',
    milestones: [
      {
        year: 'Orígenes',
        title: 'Los comienzos',
        text: 'Un grupo de vecinos de Valdoviño se juntan para jugar al fútbol representando a su municipio de forma aficionada y sin federar. El equipo se enfrentaba a otros clubs de la comarca de Ferrolterra, forjando los primeros lazos entre el fútbol y la comunidad local.',
      },
      {
        year: 'Décadas 80–1996',
        title: 'Competiciones comarcales',
        text: 'El club continúa participando en competiciones no federadas de la comarca de Ferrolterra. Durante estos años solo se cuenta con un equipo en la categoría senior, que va consolidando la identidad deportiva del municipio.',
      },
      {
        year: '1996',
        title: 'Inscripción oficial',
        text: 'El club se inscribe en el Rexistro de Clubes e Fundacións e Entidades Deportivas de Galicia y comienza a participar en competiciones federadas, inicialmente en las categorías senior y juvenil. El equipo entrena primero en el campo de San Bartolo y luego se traslada al campo de "Atios", cerca del colegio.',
      },
      {
        year: '2000–2020',
        title: 'Competición FUTGAL',
        text: 'El equipo senior continúa compitiendo en las categorías locales 1ª FUTGAL, 2ª FUTGAL y 3ª FUTGAL en diferentes años, manteniendo la presencia del municipio de Valdoviño en el fútbol gallego.',
      },
      {
        year: '2024',
        title: 'Retorno del equipo juvenil',
        text: 'Gracias a un grupo de jóvenes, la mayoría de ellos vecinos del municipio, se retoma el equipo juvenil. Los resultados no se hacen esperar: excelente temporada 2024-2025, alcanzando la final de la Copa de Consolación de la Delegación de la RFGF en Ferrol.',
      },
      {
        year: '2025',
        title: 'Nace la Escola de Fútbol',
        text: 'Temporada muy importante para el club: nace la Escola de Fútbol con el fútbol base. En este primer año se compite en las categorías de Fútbol 8 Prebenjamín, Benjamín y Alevín.',
      },
      {
        year: '2025–2026',
        title: 'Temporada actual',
        text: 'Afrontamos esta nueva temporada con muchísima ilusión y tratando de crecer paso a paso, consolidando los equipos existentes y tratando de avanzar en las categorías infantil y cadete.',
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
