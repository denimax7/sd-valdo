#!/usr/bin/env tsx
/**
 * pnpm add-match
 * Diálogo interactivo para engadir un partido a data/calendar.json.
 * Valida cada paso e re-valida o ficheiro completo con Zod antes de gardar.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { input, select, confirm } from '@inquirer/prompts';
import { calendarSchema, TEAM_IDS } from '../lib/schemas';

const CALENDAR_PATH = join(process.cwd(), 'data', 'calendar.json');

const COMPETITIONS = [
  'Primeira FUTGAL Grupo I',
  'Xuvenil FUTGAL',
  'Cadete FUTGAL',
  'Infantil FUTGAL',
  'Alevín Fútbol 8',
  'Benxamín Fútbol 8',
  'Prebenxamín Fútbol 8',
  'Liga de Veteranos',
  'Copa',
  'Amigable',
  'Pretemporada',
  'Trofeo Concello de Valdoviño',
];

const DEFAULT_VENUE = {
  name: 'Campo Municipal de Valdoviño',
  address: 'Estrada da Frouxeira s/n, 15552 Valdoviño',
  lat: 43.6019,
  lng: -8.1342,
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  const team = await select({
    message: 'Equipo da S.D. Valdoviño:',
    choices: TEAM_IDS.map((id) => ({ name: id, value: id })),
  });

  const isHome = await confirm({ message: 'Xoga na casa?', default: true });

  const rivalName = await input({
    message: isHome ? 'Nome do rival visitante:' : 'Nome do rival local:',
    validate: (v) => (v.trim().length > 1 ? true : 'Mínimo 2 caracteres'),
  });

  const rivalShort = await input({
    message: 'Acrónimo do rival (2-5 letras):',
    validate: (v) => (/^[A-ZÁÉÍÓÚÑ0-9]{2,5}$/i.test(v) ? true : 'Entre 2 e 5 letras/dígitos'),
  });

  const competition = await select({
    message: 'Competición:',
    choices: COMPETITIONS.map((c) => ({ name: c, value: c })),
  });

  const matchday = Number(
    await input({
      message: 'Xornada (número):',
      default: '1',
      validate: (v) => (Number.isInteger(Number(v)) && Number(v) >= 0 ? true : 'Enteiro >= 0'),
    }),
  );

  const date = await input({
    message: 'Data (YYYY-MM-DD):',
    validate: (v) => (/^\d{4}-\d{2}-\d{2}$/.test(v) ? true : 'Formato YYYY-MM-DD'),
  });

  const time = await input({
    message: 'Hora (HH:MM, 24h):',
    default: '17:00',
    validate: (v) => (/^\d{2}:\d{2}$/.test(v) ? true : 'Formato HH:MM'),
  });

  // Calcular offset (España: +02:00 en verán, +01:00 en inverno). Aproximación.
  const tz = await select({
    message: 'Fuso horario:',
    choices: [
      { name: 'Hora de verán (+02:00)', value: '+02:00' },
      { name: 'Hora de inverno (+01:00)', value: '+01:00' },
    ],
    default: '+02:00',
  });

  const kickoff = `${date}T${time}:00${tz}`;

  const useDefaultVenue = isHome
    ? true
    : await confirm({ message: '¿Campo do rival descoñecido? (uso provisional do Municipal)', default: false });

  let venue = DEFAULT_VENUE;
  if (!isHome && !useDefaultVenue) {
    const venueName = await input({ message: 'Nome do campo visitante:' });
    const venueAddress = await input({ message: 'Enderezo do campo:' });
    const venueLat = Number(await input({ message: 'Latitude (decimal):', default: '43.5' }));
    const venueLng = Number(await input({ message: 'Lonxitude (decimal):', default: '-8.0' }));
    venue = { name: venueName, address: venueAddress, lat: venueLat, lng: venueLng };
  }

  const notes = await input({ message: 'Notas (opcional):', default: '' });

  const home = isHome
    ? { name: 'S.D. Valdoviño', shortName: 'VAL', crest: '/crests/sd-valdovino.png' }
    : { name: rivalName, shortName: rivalShort.toUpperCase(), crest: '/crests/placeholder.svg' };
  const away = isHome
    ? { name: rivalName, shortName: rivalShort.toUpperCase(), crest: '/crests/placeholder.svg' }
    : { name: 'S.D. Valdoviño', shortName: 'VAL', crest: '/crests/sd-valdovino.png' };

  const opponentSlug = slugify(rivalName);
  const id = `${date}-${team}-${isHome ? 'vs' : 'at'}-${opponentSlug}`;

  const newMatch = {
    id,
    team,
    competition,
    matchday,
    home,
    away,
    kickoff,
    venue,
    status: 'scheduled' as const,
    score: null,
    notes,
  };

  // Le, engade e valida o ficheiro completo
  const raw = JSON.parse(readFileSync(CALENDAR_PATH, 'utf-8'));
  raw.matches.push(newMatch);
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
  console.log(`\n✅ Partido engadido: ${id}`);
  console.log(`   ${home.name} vs ${away.name} — ${kickoff}`);
  console.log(`\nLembra facer commit + push para que se redespregue.`);
}

main().catch((err) => {
  if (err && err.name === 'ExitPromptError') {
    console.log('\nCancelado.');
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
