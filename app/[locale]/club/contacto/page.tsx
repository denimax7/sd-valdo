import { MapPin, Mail, Instagram, Twitter, Camera } from 'lucide-react';
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
  return { title: t('club.contact') };
}

const content = {
  gl: {
    description: 'Ponte en contacto connosco para calquera consulta sobre o club, inscricións ou eventos.',
    address: 'Estrada da Frouxeira s/n, 15552 Valdoviño, A Coruña',
    email: 'info@sdvaldovino.gal',
    fotosTitle: 'Tes fotos nosas?',
    fotosText: 'Se tes fotos dos nosos partidos ou eventos, envíaas e compartirémolos na nosa comunidade.',
    fotosCta: 'Enviar fotos',
  },
  es: {
    description: 'Ponte en contacto con nosotros para cualquier consulta sobre el club, inscripciones o eventos.',
    address: 'Estrada da Frouxeira s/n, 15552 Valdoviño, A Coruña',
    email: 'info@sdvaldovino.gal',
    fotosTitle: '¿Tienes fotos nuestras?',
    fotosText: 'Si tienes fotos de nuestros partidos o eventos, envíanoslas y las compartiremos con la comunidad.',
    fotosCta: 'Enviar fotos',
  },
};

const LAT = 43.594334;
const LNG = -8.1462981;
const mapSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${LNG - 0.012},${LAT - 0.006},${LNG + 0.012},${LAT + 0.006}&layer=mapnik&marker=${LAT},${LNG}`;

export default function ContactoPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);
  const c = content[locale];

  return (
    <div className="container flex flex-col gap-12 py-8 md:py-16">
      <SectionHeader
        as="h1"
        kicker={t('nav.club')}
        title={t('club.contact')}
        description={c.description}
      />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact info */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <a
              href={`https://www.openstreetmap.org/?mlat=${LAT}&mlon=${LNG}#map=17/${LAT}/${LNG}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-start gap-3 rounded border border-border p-4 hover:border-primary hover:bg-primary-100 transition-colors"
            >
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-kicker text-xs font-bold uppercase tracking-wider text-primary-700">
                  {locale === 'gl' ? 'Dirección' : 'Dirección'}
                </p>
                <p className="mt-0.5 text-sm text-ink">{c.address}</p>
              </div>
            </a>

            <a
              href={`mailto:${c.email}`}
              className="group flex items-start gap-3 rounded border border-border p-4 hover:border-primary hover:bg-primary-100 transition-colors"
            >
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden />
              <div>
                <p className="font-kicker text-xs font-bold uppercase tracking-wider text-primary-700">
                  {locale === 'gl' ? 'Correo electrónico' : 'Correo electrónico'}
                </p>
                <p className="mt-0.5 text-sm text-ink">{c.email}</p>
              </div>
            </a>
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <p className="font-kicker text-xs font-bold uppercase tracking-wider text-muted">
              {locale === 'gl' ? 'Redes sociais' : 'Redes sociales'}
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/sd.valdovino"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-ink hover:border-primary hover:bg-primary-100 transition-colors"
              >
                <Instagram className="h-4 w-4" aria-hidden />
                Instagram
              </a>
              <a
                href="https://twitter.com/sd_valdovino"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded border border-border px-4 py-2 text-sm font-medium text-ink hover:border-primary hover:bg-primary-100 transition-colors"
              >
                <Twitter className="h-4 w-4" aria-hidden />
                Twitter / X
              </a>
            </div>
          </div>

          {/* Fotos section */}
          <div className="flex flex-col gap-3 rounded border border-dashed border-primary-300 bg-surface-alt p-5">
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" aria-hidden />
              <h2 className="font-kicker text-base font-bold uppercase text-ink">{c.fotosTitle}</h2>
            </div>
            <p className="text-sm text-muted">{c.fotosText}</p>
            <a
              href={`mailto:${c.email}?subject=${encodeURIComponent(locale === 'gl' ? 'Fotos para S.D. Valdoviño' : 'Fotos para S.D. Valdoviño')}`}
              className="self-start rounded bg-primary px-4 py-2 font-kicker text-sm font-bold uppercase tracking-wider text-white hover:bg-primary-700 transition-colors"
            >
              {c.fotosCta}
            </a>
          </div>
        </div>

        {/* Map */}
        <div className="overflow-hidden rounded border border-border">
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block', minHeight: '360px' }}
            loading="lazy"
            title="Campo Municipal de Valdoviño"
          />
        </div>
      </div>
    </div>
  );
}
