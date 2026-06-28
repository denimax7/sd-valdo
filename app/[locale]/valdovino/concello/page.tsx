import { MapPin, Building, Leaf } from 'lucide-react';
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
  return { title: t('valdovino.concello') };
}

const stats = [
  { value: '~7.000', label: { gl: 'Habitantes', es: 'Habitantes' } },
  { value: '92 km²', label: { gl: 'Superficie', es: 'Superficie' } },
  { value: '5',      label: { gl: 'Parroquias', es: 'Parroquias' } },
  { value: '38 km',  label: { gl: 'De Ferrol', es: 'De Ferrol' } },
];

const data = {
  gl: {
    intro: 'Valdoviño é un concello da comarca de Ferrolterra, na provincia de A Coruña. Situado na costa norte de Galicia, destaca polo seu extraordinario patrimonio natural, as súas praias e a súa rica cultura atlántica.',
    sections: [
      {
        icon: 'mappin',
        title: 'Situación xeográfica',
        text: 'Valdoviño está situado na costa norte de Galicia, a 38 km de Ferrol e a 70 km de A Coruña. Limita ao norte co océano Atlántico e conta con excelentes accesos por autovía e estradas nacionais.',
      },
      {
        icon: 'building',
        title: 'Concello e servizos',
        text: 'O Concello de Valdoviño ofrece todos os servizos municipais: educación, cultura, deportes, servizos sociais e medioambiente. A casa consistorial atópase no centro da vila de Valdoviño.',
      },
      {
        icon: 'leaf',
        title: 'Medioambiente',
        text: 'O municipio conta con varios espazos naturais protexidos, entre eles a Lagoa de A Frouxeira (Rede Natura 2000 e RAMSAR) e varios tramos de costa incluídos no Espazo Natural de Interese Local.',
      },
    ],
  },
  es: {
    intro: 'Valdoviño es un municipio de la comarca de Ferrolterra, en la provincia de A Coruña. Situado en la costa norte de Galicia, destaca por su extraordinario patrimonio natural, sus playas y su rica cultura atlántica.',
    sections: [
      {
        icon: 'mappin',
        title: 'Situación geográfica',
        text: 'Valdoviño está situado en la costa norte de Galicia, a 38 km de Ferrol y a 70 km de A Coruña. Linda al norte con el océano Atlántico y cuenta con excelentes accesos por autopista y carreteras nacionales.',
      },
      {
        icon: 'building',
        title: 'Ayuntamiento y servicios',
        text: 'El Ayuntamiento de Valdoviño ofrece todos los servicios municipales: educación, cultura, deportes, servicios sociales y medioambiente. El consistorio se encuentra en el centro de la villa de Valdoviño.',
      },
      {
        icon: 'leaf',
        title: 'Medioambiente',
        text: 'El municipio cuenta con varios espacios naturales protegidos, entre ellos la Laguna de A Frouxeira (Red Natura 2000 y RAMSAR) y varios tramos de costa incluidos en el Espacio Natural de Interés Local.',
      },
    ],
  },
} as const;

const ICON_MAP = { mappin: MapPin, building: Building, leaf: Leaf };

export default function ConcelloPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);
  const content = data[locale];

  return (
    <div className="container flex flex-col gap-12 py-8 md:py-16">
      <SectionHeader
        as="h1"
        kicker={t('valdovino.title')}
        title={t('valdovino.concello')}
        description={content.intro}
      />

      {/* Stats */}
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <li
            key={s.value}
            className="flex flex-col items-center gap-1 rounded border border-border bg-surface-alt p-4 text-center"
          >
            <span className="font-display text-3xl uppercase text-primary">{s.value}</span>
            <span className="font-kicker text-xs uppercase tracking-wider text-muted">
              {s.label[locale]}
            </span>
          </li>
        ))}
      </ul>

      {/* Sections */}
      <div className="grid gap-6 md:grid-cols-3">
        {content.sections.map((section) => {
          const Icon = ICON_MAP[section.icon as keyof typeof ICON_MAP];
          return (
            <div key={section.title} className="flex flex-col gap-3 rounded border border-border bg-surface p-5">
              <Icon className="h-6 w-6 text-primary" aria-hidden />
              <h2 className="font-kicker text-base font-bold uppercase text-ink">{section.title}</h2>
              <p className="text-sm leading-relaxed text-muted">{section.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
