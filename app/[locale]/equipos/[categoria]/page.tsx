import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { SectionHeader } from '@/components/common/SectionHeader';
import { getTeam, getTeams } from '@/lib/data';
import { TEAM_IDS } from '@/lib/schemas';
import { LOCALES, type Locale, isLocale } from '@/lib/locales';
import { createT } from '@/lib/i18n';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export function generateStaticParams() {
  const out: Array<{ locale: string; categoria: string }> = [];
  for (const locale of LOCALES) {
    for (const id of TEAM_IDS) out.push({ locale, categoria: id });
  }
  return out;
}

export function generateMetadata({ params }: { params: { locale: string; categoria: string } }): Metadata {
  if (!isLocale(params.locale)) return {};
  const t = createT(params.locale);
  const team = getTeam(params.categoria);
  if (!team) return {};
  return { title: t(`teams.${team.id}`) };
}

const positionOrder = ['POR', 'DEF', 'CEN', 'DEL'];
const positionLabel: Record<string, Record<Locale, string>> = {
  POR: { gl: 'Porteiros', es: 'Porteros' },
  DEF: { gl: 'Defensas', es: 'Defensas' },
  CEN: { gl: 'Centrocampistas', es: 'Centrocampistas' },
  DEL: { gl: 'Dianteiros', es: 'Delanteros' },
};

export default function EquipoPage({ params }: { params: { locale: string; categoria: string } }) {
  if (!isLocale(params.locale)) notFound();
  const locale = params.locale as Locale;
  const t = createT(locale);

  const valid = TEAM_IDS.includes(params.categoria as (typeof TEAM_IDS)[number]);
  if (!valid) notFound();

  const team = getTeam(params.categoria);
  if (!team) notFound();

  const teams = getTeams();

  const byPosition = positionOrder.reduce(
    (acc, pos) => {
      const players = team.players.filter((p) => p.position === pos);
      if (players.length > 0) acc[pos] = players;
      return acc;
    },
    {} as Record<string, typeof team.players>,
  );

  return (
    <div className="container flex flex-col gap-10 py-8 md:py-16">
      {/* Team selector */}
      <nav className="-mx-1 flex flex-wrap gap-1" aria-label={t('nav.teams')}>
        {teams.map((tm) => (
          <Link
            key={tm.id}
            href={`/${locale}/equipos/${tm.id}`}
            className={`rounded px-3 py-1.5 font-kicker text-xs font-bold uppercase tracking-wider transition-colors ${
              tm.id === team.id
                ? 'bg-primary text-white'
                : 'bg-surface-alt text-muted hover:bg-primary-100 hover:text-primary-900'
            }`}
          >
            {t(`teams.${tm.id}`)}
          </Link>
        ))}
      </nav>

      <SectionHeader
        as="h1"
        kicker={team.category}
        title={t(`teams.${team.id}`)}
      />

      {/* Coach */}
      {team.coach && (
        <div className="flex items-center gap-3 rounded border border-primary-100 bg-surface-alt p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <Image
              src="/crests/sd-valdovino.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 object-contain"
            />
          </div>
          <div>
            <p className="font-kicker text-[10px] font-bold uppercase tracking-wider text-muted">
              {locale === 'gl' ? 'Adestrador/a' : 'Entrenador/a'}
            </p>
            <p className="font-kicker text-sm font-bold uppercase text-ink">{team.coach}</p>
          </div>
        </div>
      )}

      {/* Players */}
      {team.players.length > 0 ? (
        <div className="flex flex-col gap-8">
          {positionOrder.map((pos) => {
            const players = byPosition[pos];
            if (!players) return null;
            return (
              <section key={pos}>
                <h2 className="mb-4 font-kicker text-sm font-bold uppercase tracking-wider text-primary-700">
                  {positionLabel[pos]?.[locale]}
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {players
                    .sort((a, b) => a.number - b.number)
                    .map((player) => (
                      <li
                        key={player.number}
                        className="flex items-center gap-3 rounded border border-border bg-surface p-3"
                      >
                        <span className="font-mono tabular min-w-[2rem] text-center text-lg font-bold text-muted">
                          {player.number}
                        </span>
                        <span className="truncate font-kicker text-sm font-bold uppercase text-ink">
                          {player.name}
                        </span>
                      </li>
                    ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <p className="rounded border border-dashed border-border p-8 text-center text-sm text-muted">
          {locale === 'gl'
            ? 'A plantilla deste equipo estará dispoñible en breve.'
            : 'La plantilla de este equipo estará disponible en breve.'}
        </p>
      )}
    </div>
  );
}
