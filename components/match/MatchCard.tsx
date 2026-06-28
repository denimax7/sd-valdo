import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { TeamCrest } from '@/components/team/TeamCrest';
import { cn } from '@/lib/utils';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';
import type { Match } from '@/lib/schemas';

interface Props {
  match: Match;
  locale: Locale;
  variant?: 'hero' | 'compact' | 'result';
  className?: string;
}

function formatDate(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === 'gl' ? 'gl-ES' : 'es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

function formatTime(iso: string, locale: Locale) {
  return new Date(iso).toLocaleTimeString(locale === 'gl' ? 'gl-ES' : 'es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

function resultVariant(m: Match): 'success' | 'danger' | 'warning' | 'default' {
  if (m.status !== 'finished' || !m.score) return 'default';
  const isHome = m.home.shortName === 'VAL';
  const our = isHome ? m.score.home : m.score.away;
  const their = isHome ? m.score.away : m.score.home;
  if (our > their) return 'success';
  if (our < their) return 'danger';
  return 'warning';
}

export function MatchCard({ match, locale, variant = 'compact', className }: Props) {
  const t = createT(locale);
  const isResult = match.status === 'finished' && match.score;

  if (variant === 'hero') {
    return (
      <article
        className={cn(
          'overflow-hidden rounded border border-border bg-surface shadow-sm',
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border bg-primary-100 px-4 py-2 text-xs">
          <span className="font-kicker uppercase tracking-wider text-primary-900">
            {match.competition}
          </span>
          <Badge variant="outline">{t('match.matchday', { n: match.matchday })}</Badge>
        </div>
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-3 p-5 sm:gap-6 sm:p-8">
          <div className="flex flex-col items-center gap-3 text-center">
            <TeamCrest src={match.home.crest} alt={match.home.name} shortName={match.home.shortName} size="xl" />
            <span className="font-display text-base leading-tight sm:text-xl">{match.home.name}</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            {isResult ? (
              <span className="font-display tabular text-4xl sm:text-6xl">
                {match.score!.home}–{match.score!.away}
              </span>
            ) : (
              <>
                <span className="font-mono tabular text-3xl font-bold sm:text-5xl">
                  {formatTime(match.kickoff, locale)}
                </span>
                <span className="font-kicker text-xs uppercase tracking-wider text-muted">
                  {formatDate(match.kickoff, locale)}
                </span>
              </>
            )}
          </div>
          <div className="flex flex-col items-center gap-3 text-center">
            <TeamCrest src={match.away.crest} alt={match.away.name} shortName={match.away.shortName} size="xl" />
            <span className="font-display text-base leading-tight sm:text-xl">{match.away.name}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 border-t border-border px-4 py-3 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> {match.venue.name}
          </span>
        </div>
      </article>
    );
  }

  if (variant === 'result') {
    const rv = resultVariant(match);
    return (
      <article
        className={cn(
          'snap-item flex w-[240px] shrink-0 flex-col gap-2 rounded border border-border bg-surface p-4 shadow-sm',
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <span className="font-kicker text-[10px] uppercase tracking-wider text-muted">
            {formatDate(match.kickoff, locale)}
          </span>
          <Badge variant={rv}>
            {rv === 'success' && 'V'}
            {rv === 'danger' && 'D'}
            {rv === 'warning' && 'E'}
            {rv === 'default' && '—'}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <TeamCrest src={match.home.crest} alt={match.home.name} shortName={match.home.shortName} size="sm" />
          <span className="flex-1 truncate text-sm font-medium">{match.home.shortName}</span>
          <span className="font-mono tabular text-xl font-bold">{match.score?.home ?? '—'}</span>
        </div>
        <div className="flex items-center gap-2">
          <TeamCrest src={match.away.crest} alt={match.away.name} shortName={match.away.shortName} size="sm" />
          <span className="flex-1 truncate text-sm font-medium">{match.away.shortName}</span>
          <span className="font-mono tabular text-xl font-bold">{match.score?.away ?? '—'}</span>
        </div>
      </article>
    );
  }

  // compact
  return (
    <article
      className={cn(
        'flex flex-col gap-3 rounded border border-border bg-surface p-4 shadow-sm',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-kicker uppercase tracking-wider text-primary-700">
          {match.competition}
        </span>
        <Badge variant="outline">{t('match.matchday', { n: match.matchday })}</Badge>
      </div>
      <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2">
        <div className="flex items-center gap-2">
          <TeamCrest src={match.home.crest} alt={match.home.name} shortName={match.home.shortName} size="md" />
          <span className="truncate font-medium">{match.home.name}</span>
        </div>
        <div className="flex flex-col items-center px-2">
          {isResult ? (
            <span className="font-display tabular text-2xl">
              {match.score!.home}–{match.score!.away}
            </span>
          ) : (
            <>
              <span className="font-mono tabular text-lg font-bold">
                {formatTime(match.kickoff, locale)}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted">
                {formatDate(match.kickoff, locale)}
              </span>
            </>
          )}
        </div>
        <div className="flex items-center justify-end gap-2">
          <span className="truncate text-right font-medium">{match.away.name}</span>
          <TeamCrest src={match.away.crest} alt={match.away.name} shortName={match.away.shortName} size="md" />
        </div>
      </div>
      <div className="flex items-center gap-1 text-xs text-muted">
        <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="truncate">{match.venue.name}</span>
      </div>
    </article>
  );
}
