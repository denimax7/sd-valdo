import Link from 'next/link';
import { ArrowLeft, Construction } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/common/SectionHeader';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';

interface Props {
  locale: Locale;
  title: string;
  kicker?: string;
}

export function StubPage({ locale, title, kicker }: Props) {
  const t = createT(locale);
  return (
    <div className="container flex flex-col gap-8 py-12 md:py-20">
      <SectionHeader as="h1" kicker={kicker} title={title} />
      <div className="flex flex-col items-start gap-4 rounded border border-dashed border-border bg-surface-alt p-6 md:p-10">
        <Construction className="h-8 w-8 text-primary" aria-hidden />
        <h2 className="font-display text-2xl uppercase text-accent">
          {t('stubs.construction')}
        </h2>
        <p className="max-w-xl text-muted">{t('stubs.construction_text')}</p>
        <Button asChild variant="outline-dark" size="md">
          <Link href={`/${locale}`}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> {locale === 'gl' ? 'Volver á portada' : 'Volver a la portada'}
          </Link>
        </Button>
      </div>
    </div>
  );
}
