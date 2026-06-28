import type { Match } from './schemas';

function pad(n: number) {
  return String(n).padStart(2, '0');
}

/** ICS datetime UTC: 20260907T150000Z */
function toIcsDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.getUTCFullYear().toString() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    'T' +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    'Z'
  );
}

function escapeIcs(text: string) {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function matchToIcs(m: Match): string {
  const dtStart = toIcsDate(m.kickoff);
  // Duración por defecto: 110 minutos (encontro + descanso)
  const end = new Date(new Date(m.kickoff).getTime() + 110 * 60 * 1000).toISOString();
  const dtEnd = toIcsDate(end);
  const summary = `${m.home.shortName} vs ${m.away.shortName} · ${m.competition}`;
  const description = `Xornada ${m.matchday} · ${m.competition}`;
  const location = `${m.venue.name}, ${m.venue.address}`;
  const uid = `${m.id}@sdvaldovino.gal`;
  const dtStamp = toIcsDate(new Date().toISOString());

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//S.D. Valdoviño//Calendario//GL',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcs(summary)}`,
    `DESCRIPTION:${escapeIcs(description)}`,
    `LOCATION:${escapeIcs(location)}`,
    `GEO:${m.venue.lat};${m.venue.lng}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
}

export function downloadIcs(m: Match) {
  if (typeof window === 'undefined') return;
  const blob = new Blob([matchToIcs(m)], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${m.id}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
