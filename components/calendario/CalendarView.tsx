'use client';
import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { MatchCard } from '@/components/match/MatchCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { downloadIcs } from '@/lib/ics';
import { cn } from '@/lib/utils';
import { createT } from '@/lib/i18n';
import type { Locale } from '@/lib/locales';
import type { Match } from '@/lib/schemas';
import { TEAM_IDS } from '@/lib/schemas';

interface Props {
  matches: Match[];
  locale: Locale;
}

type Side = 'all' | 'home' | 'away';

function monthKey(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function monthLabel(iso: string, locale: Locale) {
  return new Date(iso).toLocaleDateString(locale === 'gl' ? 'gl-ES' : 'es-ES', {
    month: 'long',
    year: 'numeric',
  });
}

export function CalendarView({ matches, locale }: Props) {
  const t = createT(locale);

  const [team, setTeam] = useState<string>('all');
  const [month, setMonth] = useState<string>(() => {
    const now = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const available = [...new Set(matches.map((m) => monthKey(m.kickoff)))].sort();
    if (available.includes(now)) return now;
    return available.find((m) => m >= now) ?? 'all';
  });
  const [side, setSide] = useState<Side>('all');

  const months = useMemo(() => {
    const set = new Set<string>();
    matches.forEach((m) => set.add(monthKey(m.kickoff)));
    return Array.from(set).sort();
  }, [matches]);

  const filtered = useMemo(() => {
    return matches
      .filter((m) => (team === 'all' ? true : m.team === team))
      .filter((m) => (month === 'all' ? true : monthKey(m.kickoff) === month))
      .filter((m) => {
        if (side === 'all') return true;
        const isHome = m.home.shortName === 'VAL';
        return side === 'home' ? isHome : !isHome;
      })
      .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  }, [matches, team, month, side]);

  // Agrupado por mes para a vista lista
  const grouped = useMemo(() => {
    const map = new Map<string, Match[]>();
    filtered.forEach((m) => {
      const k = monthKey(m.kickoff);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(m);
    });
    return Array.from(map.entries());
  }, [filtered]);

  return (
    <div className="flex flex-col gap-6">
      {/* Filtros sticky */}
      <div className="sticky top-14 z-20 -mx-4 border-b border-border bg-surface/95 px-4 py-3 backdrop-blur md:top-20 md:mx-0 md:rounded md:border md:px-4">
        <div className="flex snap-x-strip gap-2 overflow-x-auto md:flex-wrap md:overflow-visible">
          <div className="min-w-[180px] shrink-0 snap-item md:min-w-[200px]">
            <label className="sr-only" htmlFor="filter-team">
              {t('calendar.filters.team')}
            </label>
            <Select value={team} onValueChange={setTeam}>
              <SelectTrigger id="filter-team">
                <SelectValue placeholder={t('calendar.filters.team')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('calendar.filters.team_all')}</SelectItem>
                {TEAM_IDS.map((id) => (
                  <SelectItem key={id} value={id}>
                    {t(`teams.${id}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-[180px] shrink-0 snap-item md:min-w-[200px]">
            <label className="sr-only" htmlFor="filter-month">
              {t('calendar.filters.month')}
            </label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger id="filter-month">
                <SelectValue placeholder={t('calendar.filters.month')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('calendar.filters.month_all')}</SelectItem>
                {months.map((m) => (
                  <SelectItem key={m} value={m}>
                    {monthLabel(m + '-01T00:00:00Z', locale)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div
            role="group"
            aria-label={t('calendar.filters.side')}
            className="flex shrink-0 snap-item items-stretch overflow-hidden rounded border border-border"
          >
            {(['all', 'home', 'away'] as Side[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSide(s)}
                aria-pressed={side === s}
                className={cn(
                  'min-w-[80px] px-3 font-kicker text-xs font-bold uppercase tracking-wider tap',
                  side === s ? 'bg-primary text-white' : 'bg-surface text-accent hover:bg-primary-100',
                )}
              >
                {t(`calendar.filters.side_${s}`)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Lista / Mes (Mes só visible en desktop via CSS, no móbil lista) */}
      <Tabs defaultValue="list">
        <TabsList className="hidden md:inline-flex">
          <TabsTrigger value="list">{t('calendar.view.list')}</TabsTrigger>
          <TabsTrigger value="month">{t('calendar.view.month')}</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="md:mt-4">
          {filtered.length === 0 ? (
            <p className="rounded border border-dashed border-border p-8 text-center text-muted">
              {t('calendar.empty')}
            </p>
          ) : (
            <div className="flex flex-col gap-8">
              {grouped.map(([mk, list]) => (
                <section key={mk} className="flex flex-col gap-3">
                  <h3 className="font-display text-2xl uppercase text-accent">
                    {monthLabel(mk + '-01T00:00:00Z', locale)}
                  </h3>
                  <ul className="flex flex-col gap-3">
                    {list.map((m) => (
                      <li key={m.id} className="relative">
                        <MatchCard match={m} locale={locale} variant="compact" />
                        <div className="absolute right-3 top-3 hidden md:block">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() => downloadIcs(m)}
                            aria-label={t('match.add_to_calendar')}
                          >
                            <Download className="h-4 w-4" aria-hidden />
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="month" className="hidden md:block md:mt-4">
          <MonthGrid matches={filtered} locale={locale} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

/** Vista mes tipo cuadrícula 7 columnas. Só renderiza ben en desktop. */
function MonthGrid({ matches, locale }: { matches: Match[]; locale: Locale }) {
  const t = createT(locale);
  const first = matches[0] ? new Date(matches[0].kickoff) : new Date();
  const year = first.getFullYear();
  const monthIdx = first.getMonth();
  const daysInMonth = new Date(year, monthIdx + 1, 0).getDate();
  const startWeekday = (new Date(year, monthIdx, 1).getDay() + 6) % 7; // L=0 ... D=6

  const cells: Array<{ day?: number; matches: Match[] }> = [];
  for (let i = 0; i < startWeekday; i++) cells.push({ matches: [] });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({
      day: d,
      matches: matches.filter((m) => {
        const dt = new Date(m.kickoff);
        return dt.getFullYear() === year && dt.getMonth() === monthIdx && dt.getDate() === d;
      }),
    });
  }

  const weekdays = ['L', 'M', 'M', 'X', 'V', 'S', 'D'];

  return (
    <div>
      <h3 className="mb-4 font-display text-2xl uppercase text-accent">
        {first.toLocaleDateString(locale === 'gl' ? 'gl-ES' : 'es-ES', {
          month: 'long',
          year: 'numeric',
        })}
      </h3>
      <div className="grid grid-cols-7 gap-1 rounded border border-border bg-surface p-2">
        {weekdays.map((w, i) => (
          <div
            key={i}
            className="py-2 text-center font-kicker text-xs font-bold uppercase tracking-wider text-muted"
          >
            {w}
          </div>
        ))}
        {cells.map((c, i) => (
          <div
            key={i}
            className={cn(
              'min-h-[80px] rounded border border-border/50 p-1.5 text-xs',
              c.day ? 'bg-surface-alt' : 'bg-transparent',
            )}
          >
            {c.day && (
              <>
                <div className="font-mono tabular text-sm font-bold text-accent">{c.day}</div>
                {c.matches.map((m) => (
                  <div
                    key={m.id}
                    className="mt-1 truncate rounded bg-primary px-1 py-0.5 text-[10px] font-bold uppercase text-white"
                    title={`${m.home.shortName} vs ${m.away.shortName}`}
                  >
                    {m.home.shortName} · {m.away.shortName}
                  </div>
                ))}
              </>
            )}
          </div>
        ))}
      </div>
      {matches.length === 0 && (
        <p className="mt-4 text-sm text-muted">{t('calendar.empty')}</p>
      )}
    </div>
  );
}
