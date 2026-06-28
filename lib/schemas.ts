import { z } from 'zod';

export const TEAM_IDS = [
  'primer-equipo',
  'xuvenil',
  'cadete',
  'infantil',
  'alevin',
  'benxamin',
  'prebenxamin',
  'veteranos',
] as const;

export const teamIdSchema = z.enum(TEAM_IDS);
export type TeamId = z.infer<typeof teamIdSchema>;

export const matchStatusSchema = z.enum([
  'scheduled',
  'live',
  'finished',
  'postponed',
  'cancelled',
]);

const sideSchema = z.object({
  name: z.string().min(1),
  shortName: z.string().min(2).max(5),
  crest: z.string().min(1),
});

const venueSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  lat: z.number(),
  lng: z.number(),
});

const scoreSchema = z.object({
  home: z.number().int().nonnegative(),
  away: z.number().int().nonnegative(),
});

export const matchSchema = z.object({
  id: z.string().min(1),
  team: teamIdSchema,
  competition: z.string().min(1),
  matchday: z.number().int().positive(),
  home: sideSchema,
  away: sideSchema,
  kickoff: z.string().datetime({ offset: true }),
  venue: venueSchema,
  status: matchStatusSchema,
  score: scoreSchema.nullable(),
  notes: z.string().default(''),
});
export type Match = z.infer<typeof matchSchema>;

export const calendarSchema = z.object({
  lastUpdated: z.string(),
  season: z.string(),
  matches: z.array(matchSchema),
});
export type Calendar = z.infer<typeof calendarSchema>;

export const playerSchema = z.object({
  number: z.number().int().nonnegative(),
  name: z.string().min(1),
  position: z.enum(['POR', 'DEF', 'CEN', 'DEL']),
  photo: z.string().optional(),
});

export const teamSchema = z.object({
  id: teamIdSchema,
  name: z.string().min(1),
  shortName: z.string(),
  category: z.string(),
  season: z.string(),
  coach: z.string().optional(),
  photo: z.string().optional(),
  players: z.array(playerSchema).default([]),
});
export type Team = z.infer<typeof teamSchema>;

export const teamsSchema = z.array(teamSchema);

export const boardMemberSchema = z.object({
  name: z.string().min(1),
  role: z.string().min(1),
  photo: z.string().optional(),
  since: z.string().optional(),
});
export const boardSchema = z.array(boardMemberSchema);

export const staffSchema = z.array(
  z.object({
    team: teamIdSchema,
    name: z.string().min(1),
    role: z.string().min(1),
    photo: z.string().optional(),
  }),
);

export const newsItemSchema = z.object({
  slug: z.string().min(1),
  date: z.string(),
  title: z.object({ gl: z.string(), es: z.string() }),
  excerpt: z.object({ gl: z.string(), es: z.string() }),
  body: z.object({ gl: z.string(), es: z.string() }).optional(),
  cover: z.string(),
  category: z.string().optional(),
  featured: z.boolean().default(false),
});
export type NewsItem = z.infer<typeof newsItemSchema>;
export const newsSchema = z.array(newsItemSchema);

export const facilitiesSchema = z.object({
  main: z.object({
    name: z.string(),
    address: z.string(),
    lat: z.number(),
    lng: z.number(),
    capacity: z.number().optional(),
    surface: z.string().optional(),
    photos: z.array(z.string()).default([]),
  }),
});

// ── Inscricións ────────────────────────────────────────────────────────────────
export const inscriptionsSchema = z.object({
  open: z.boolean(),
  formUrl: z.string().min(1),
  textOpen: z.object({ gl: z.string(), es: z.string() }),
  textClosed: z.object({ gl: z.string(), es: z.string() }),
  ctaLabel: z.object({ gl: z.string(), es: z.string() }),
});
export type Inscriptions = z.infer<typeof inscriptionsSchema>;

// ── Galería ────────────────────────────────────────────────────────────────────
export const drivePhotoSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
});
export type DrivePhoto = z.infer<typeof drivePhotoSchema>;

export const albumSchema = z.object({
  slug: z.string().min(1),
  driveFolderId: z.string().min(1),
  title: z.object({ gl: z.string(), es: z.string() }),
  date: z.string(),
  team: z.enum(['primer-equipo','xuvenil','cadete','infantil','alevin','benxamin','prebenxamin','veteranos']).nullable().default(null),
  coverDriveId: z.string().optional(),
  photoCount: z.number().int().nonnegative().default(0),
  photos: z.array(drivePhotoSchema).default([]),
});
export type Album = z.infer<typeof albumSchema>;

export const gallerySchema = z.object({
  lastSynced: z.string(),
  albums: z.array(albumSchema),
});
export type Gallery = z.infer<typeof gallerySchema>;
