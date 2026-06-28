import { MapPin, CheckCircle } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { getFacilities } from '@/lib/data';
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
  return { title: t('club.facilities') };
}

const intro = {
  gl: 'O club conta con instalacións deportivas ao servizo de todos os equipos e da afección. Estamos traballando para mellorar e ampliar as nosas infraestruturas.',
  es: 'El club cuenta con instalaciones deportivas al servicio de todos los equipos y de la afición. Estamos trabajando para mejorar y ampliar nuestras infraestructuras.',
};

const extraFacility = {
  gl: {
    name: 'Campo de adestramento',
    desc: 'Campo auxiliar de terra utilizado polos equipos de base para os adestramento diarios. Contiguo ao campo principal.',
    details: [
      'Superficie de terra',
      'Uso exclusivo para adestramento',
      'Dispoñible todos os días',
      'Balizas e material de adestramento',
    ],
  },
  es: {
    name: 'Campo de entrenamiento',
    desc: 'Campo auxiliar de tierra utilizado por los equipos de base para los entrenamientos diarios. Contiguo al campo principal.',
    details: [
      'Superficie de tierra',
      'Uso exclusivo para entrenamiento',
      'Disponible todos los días',
      'Balizas y material de entrenamiento',
    ],
  },
};

const mainDetails = {
  gl: ['Herba artificial', 'Vestiarios renovados', 'Iluminación artificial para partidos nocturnos', 'Aparcamento gratuíto', 'Tribuna cuberta'],
  es: ['Hierba artificial', 'Vestuarios renovados', 'Iluminación artificial para partidos nocturnos', 'Aparcamiento gratuito', 'Tribuna cubierta'],
};

export default function InstalacionsPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);
  const facilities = getFacilities();
  const extra = extraFacility[locale];
  const mainDets = mainDetails[locale];

  const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${facilities.main.lng - 0.012},${facilities.main.lat - 0.006},${facilities.main.lng + 0.012},${facilities.main.lat + 0.006}&layer=mapnik&marker=${facilities.main.lat},${facilities.main.lng}`;

  return (
    <div className="container flex flex-col gap-12 py-8 md:py-16">
      <SectionHeader
        as="h1"
        kicker={t('nav.club')}
        title={t('club.facilities')}
        description={intro[locale]}
      />

      {/* Campo principal */}
      <section className="flex flex-col gap-6">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <div>
            <h2 className="font-kicker text-xl font-bold uppercase text-ink">
              {facilities.main.name}
            </h2>
            <p className="mt-0.5 text-sm text-muted">{facilities.main.address}</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <ul className="flex flex-col gap-2">
            {mainDets.map((d) => (
              <li key={d} className="flex items-center gap-2 text-sm text-ink">
                <CheckCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                {d}
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-2 text-sm text-muted">
            {facilities.main.capacity && (
              <p>{locale === 'gl' ? 'Aforo' : 'Aforo'}: <strong className="text-ink">{facilities.main.capacity} espectadores</strong></p>
            )}
            {facilities.main.surface && (
              <p>{locale === 'gl' ? 'Superficie' : 'Superficie'}: <strong className="text-ink">{facilities.main.surface}</strong></p>
            )}
          </div>
        </div>

        {/* Mapa */}
        <div className="overflow-hidden rounded border border-border">
          <iframe
            src={mapSrc}
            width="100%"
            height="300"
            style={{ border: 0, display: 'block' }}
            loading="lazy"
            title={facilities.main.name}
          />
          <div className="flex items-center justify-between gap-4 bg-surface-alt px-4 py-3 text-xs text-muted">
            <span>{facilities.main.address}</span>
            <a
              href={`https://www.openstreetmap.org/?mlat=${facilities.main.lat}&mlon=${facilities.main.lng}#map=17/${facilities.main.lat}/${facilities.main.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap font-kicker uppercase tracking-wider text-primary-700 hover:text-primary-900"
            >
              {locale === 'gl' ? 'Ver no mapa →' : 'Ver en el mapa →'}
            </a>
          </div>
        </div>
      </section>

      {/* Campo de adestramento */}
      <section className="flex flex-col gap-4 rounded border border-border bg-surface-alt p-6">
        <div className="flex items-start gap-3">
          <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden />
          <h2 className="font-kicker text-xl font-bold uppercase text-ink">{extra.name}</h2>
        </div>
        <p className="text-sm text-muted">{extra.desc}</p>
        <ul className="flex flex-col gap-2">
          {extra.details.map((d) => (
            <li key={d} className="flex items-center gap-2 text-sm text-ink">
              <CheckCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden />
              {d}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
