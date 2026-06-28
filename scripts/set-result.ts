#!/usr/bin/env tsx
/**
 * pnpm set-result
 * Marca como 'finished' un partido programado e engade marcador.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { input, select } from '@inquirer/prompts';
import { calendarSchema } from '../lib/schemas';

const CALENDAR_PATH = join(process.cwd(), 'data', 'calendar.json');

async function main() {
  const raw = JSON.parse(readFileSync(CALENDAR_PATH, 'utf-8'));
  const pending: Array<{ id: string; label: string }> = raw.matches
    .filter((m: { status: string }) => m.status === 'scheduled' || m.status === 'live')
    .sort((a: { kickoff: string }, b: { kickoff: string }) =>
      a.kickoff < b.kickoff ? -1 : 1,
    )
    .map((m: { id: string; home: { shortName: string }; away: { shortName: string }; kickoff: string }) => ({
      id: m.id,
      label: `${m.kickoff.slice(0, 10)}  ${m.home.shortName} vs ${m.away.shortName}  [${m.id}]`,
    }));

  if (pending.length === 0) {
    console.log('Non hai partidos pendentes.');
    return;
  }

  const matchId = await select({
    message: 'Partido ao que poñer resultado:',
    choices: pending.map((p) => ({ name: p.label, value: p.id })),
  });

  const homeGoals = Number(
    await input({
      message: 'Goles do local:',
      validate: (v) => (Number.isInteger(Number(v)) && Number(v) >= 0 ? true : 'Enteiro >= 0'),
    }),
  );
  const awayGoals = Number(
    await input({
      message: 'Goles do visitante:',
      validate: (v) => (Number.isInteger(Number(v)) && Number(v) >= 0 ? true : 'Enteiro >= 0'),
    }),
  );

  const match = raw.matches.find((m: { id: string }) => m.id === matchId);
  if (!match) {
    console.error('ID non atopado.');
    process.exit(1);
  }
  match.status = 'finished';
  match.score = { home: homeGoals, away: awayGoals };
  raw.lastUpdated = new Date().toISOString().slice(0, 10);

  const parsed = calendarSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('\n❌ Validación Zod fallida:');
    for (const issue of parsed.error.issues) {
      console.error(`  · ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }

  writeFileSync(CALENDAR_PATH, JSON.stringify(parsed.data, null, 2) + '\n', 'utf-8');
  console.log(`\n✅ ${matchId}: ${homeGoals}-${awayGoals}`);
}

main().catch((err) => {
  if (err && err.name === 'ExitPromptError') {
    console.log('\nCancelado.');
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
