import 'server-only';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { z } from 'zod';
import {
  calendarSchema,
  teamsSchema,
  boardSchema,
  staffSchema,
  newsSchema,
  facilitiesSchema,
  inscriptionsSchema,
  type Calendar,
  type Team,
  type Match,
  type Inscriptions,
} from './schemas';

const DATA_DIR = join(process.cwd(), 'data');

function loadJson<S extends z.ZodTypeAny>(filename: string, schema: S): z.infer<S> {
  const path = join(DATA_DIR, filename);
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(path, 'utf-8'));
  } catch (e) {
    throw new Error(`[data] Erro lendo ${filename}: ${(e as Error).message}`);
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  · ${i.path.join('.') || '(raíz)'}: ${i.message}`)
      .join('\n');
    throw new Error(
      `[data] ${filename} non é válido. Revisa os seguintes campos:\n${issues}`,
    );
  }
  return result.data;
}

export function getCalendar() { return loadJson('calendar.json', calendarSchema) as Calendar; }
export function getTeams(): Team[] { return loadJson('teams.json', teamsSchema); }
export function getTeam(id: string): Team | undefined { return getTeams().find((t) => t.id === id); }
export function getBoard() { return loadJson('board.json', boardSchema); }
export function getStaff() { return loadJson('staff.json', staffSchema); }
export function getNews() { return loadJson('news.json', newsSchema); }
export function getFacilities() { return loadJson('facilities.json', facilitiesSchema); }
export function getInscriptions(): Inscriptions { return loadJson('inscriptions.json', inscriptionsSchema); }

export function upcomingMatches(limit?: number): Match[] {
  const now = Date.now();
  const list = getCalendar()
    .matches.filter((m) => new Date(m.kickoff).getTime() >= now && m.status === 'scheduled')
    .sort((a, b) => new Date(a.kickoff).getTime() - new Date(b.kickoff).getTime());
  return limit ? list.slice(0, limit) : list;
}

export function pastResults(limit?: number): Match[] {
  const list = getCalendar()
    .matches.filter((m) => m.status === 'finished')
    .sort((a, b) => new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime());
  return limit ? list.slice(0, limit) : list;
}

export function nextMatchOverall(): Match | undefined {
  return upcomingMatches(1)[0];
}
