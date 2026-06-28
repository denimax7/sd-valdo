import { SectionHeader } from '@/components/common/SectionHeader';
import { getStaff, getTeams } from '@/lib/data';
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
  return { title: t('club.staff') };
}

const intro = {
  gl: 'O persoal técnico da S.D. Valdoviño traballa día a día para o desenvolvemento deportivo de todos os equipos do club, dende o prebenxamín ata o primeiro equipo.',
  es: 'El personal técnico de la S.D. Valdoviño trabaja día a día para el desarrollo deportivo de todos los equipos del club, desde el prebenjamín hasta el primer equipo.',
};

const roleTranslations: Record<string, Record<Locale, string>> = {
  Adestrador: { gl: 'Adestrador', es: 'Entrenador' },
  'Segundo adestrador': { gl: 'Segundo adestrador', es: 'Segundo entrenador' },
  'Preparador físico': { gl: 'Preparador físico', es: 'Preparador físico' },
  Fisioterapeuta: { gl: 'Fisioterapeuta', es: 'Fisioterapeuta' },
  Delegado: { gl: 'Delegado', es: 'Delegado' },
};

const coachLabel = { gl: 'Adestrador/a', es: 'Entrenador/a' };

function translateRole(role: string, locale: Locale): string {
  return roleTranslations[role]?.[locale] ?? role;
}

export default function CorpoTecnicoPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);
  const staff = getStaff();
  const teams = getTeams();

  const primerEquipoStaff = staff.filter((s) => s.team === 'primer-equipo');
  const otherTeamCoaches = teams
    .filter((team) => team.id !== 'primer-equipo' && team.coach)
    .map((team) => ({ team: team.id, name: team.coach!, role: coachLabel[locale] }));

  return (
    <div className="container flex flex-col gap-12 py-8 md:py-16">
      <SectionHeader
        as="h1"
        kicker={t('nav.club')}
        title={t('club.staff')}
        description={intro[locale]}
      />

      <section className="flex flex-col gap-6">
        <h2 className="font-kicker text-base font-bold uppercase tracking-wider text-primary-700">
          {t('teams.primer-equipo')}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {primerEquipoStaff.map((member) => (
            <li
              key={member.name}
              className="flex flex-col gap-1 rounded border border-border bg-surface p-5 shadow-sm"
            >
              <span className="font-kicker text-xs font-bold uppercase tracking-wider text-primary-700">
                {translateRole(member.role, locale)}
              </span>
              <span className="font-display text-lg uppercase text-ink">{member.name}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="font-kicker text-base font-bold uppercase tracking-wider text-primary-700">
          {locale === 'gl' ? 'Equipos base' : 'Equipos base'}
        </h2>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {otherTeamCoaches.map((coach) => (
            <li
              key={coach.team}
              className="flex flex-col gap-1 rounded border border-border bg-surface-alt p-5"
            >
              <span className="font-kicker text-[10px] font-bold uppercase tracking-wider text-muted">
                {t(`teams.${coach.team}`)}
              </span>
              <span className="font-kicker text-xs font-bold uppercase tracking-wider text-primary-700">
                {coach.role}
              </span>
              <span className="font-display text-base uppercase text-ink">{coach.name}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
