import { Waves, Bird } from 'lucide-react';
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
  return { title: t('valdovino.beaches') };
}

const beaches = [
  {
    name: 'Praia de Pantín',
    icon: 'waves',
    gl: {
      desc: 'Mundialmente coñecida polo Campionato do Mundo de Surf (WSL). Area fina branca, ondas de calidade e contorna espectacular entre dunas e piñeiral. Bandeira Azul cada tempada.',
      tags: ['Surf', 'Bandeira Azul', 'Dunas', 'WSL'],
    },
    es: {
      desc: 'Mundialmente conocida por el Campeonato del Mundo de Surf (WSL). Arena blanca y fina, olas de calidad y entorno espectacular entre dunas y pinar. Bandera Azul cada temporada.',
      tags: ['Surf', 'Bandera Azul', 'Dunas', 'WSL'],
    },
  },
  {
    name: 'Lagoa de A Frouxeira',
    icon: 'bird',
    gl: {
      desc: 'Lagoa litoral integrada na Rede Natura 2000 e espazo RAMSAR. Hábitat para máis de 200 especies de aves migratorias e residentes. Percorridos de sendeirismo e observación de aves.',
      tags: ['Rede Natura 2000', 'RAMSAR', 'Aves', 'Sendeirismo'],
    },
    es: {
      desc: 'Laguna litoral integrada en la Red Natura 2000 y espacio RAMSAR. Hábitat para más de 200 especies de aves migratorias y residentes. Rutas de senderismo y observación de aves.',
      tags: ['Red Natura 2000', 'RAMSAR', 'Aves', 'Senderismo'],
    },
  },
  {
    name: 'Praia de Vilarrube',
    icon: 'waves',
    gl: {
      desc: 'Praia salvaxe e tranquila, ideal para familias. Augas cristalinas, moito espazo e menos afluencia que Pantín. Acceso por pista de terra entre piñeiros.',
      tags: ['Familiar', 'Tranquila', 'Salvaxe'],
    },
    es: {
      desc: 'Playa salvaje y tranquila, ideal para familias. Aguas cristalinas, mucho espacio y menor afluencia que Pantín. Acceso por pista de tierra entre pinos.',
      tags: ['Familiar', 'Tranquila', 'Salvaje'],
    },
  },
  {
    name: 'Praia de Eirón',
    icon: 'waves',
    gl: {
      desc: 'Pequena praia de area dourada entre formacións rochosas, cunha contorna natural privilexiada. Ideal para bañarse en días de calma.',
      tags: ['Recollida', 'Rochosa', 'Tranquila'],
    },
    es: {
      desc: 'Pequeña playa de arena dorada entre formaciones rocosas, con un entorno natural privilegiado. Ideal para bañarse en días de calma.',
      tags: ['Recogida', 'Rocosa', 'Tranquila'],
    },
  },
];

const intro = {
  gl: 'Valdoviño conta con algunhas das mellores praias e espazos naturais do norte de Galicia. Surf de clase mundial, lagoas protexidas e praias salvaxes esperan a cada visitante.',
  es: 'Valdoviño cuenta con algunas de las mejores playas y espacios naturales del norte de Galicia. Surf de clase mundial, lagunas protegidas y playas salvajes esperan a cada visitante.',
};

const ICON_MAP = { waves: Waves, bird: Bird };

export default function PraiasPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);

  return (
    <div className="container flex flex-col gap-12 py-8 md:py-16">
      <SectionHeader
        as="h1"
        kicker={t('valdovino.title')}
        title={t('valdovino.beaches')}
        description={intro[locale]}
      />

      <ul className="grid gap-6 md:grid-cols-2">
        {beaches.map((beach) => {
          const Icon = ICON_MAP[beach.icon as keyof typeof ICON_MAP];
          const c = beach[locale];
          return (
            <li key={beach.name} className="flex flex-col gap-3 rounded border border-border bg-surface p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-primary-100">
                  <Icon className="h-5 w-5 text-primary-700" aria-hidden />
                </div>
                <h2 className="font-kicker text-lg font-bold uppercase text-ink">{beach.name}</h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">{c.desc}</p>
              <div className="flex flex-wrap gap-2">
                {c.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-primary-100 px-2.5 py-0.5 font-kicker text-xs font-bold uppercase tracking-wider text-primary-900"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
