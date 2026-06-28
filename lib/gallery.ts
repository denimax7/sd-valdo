/**
 * lib/gallery.ts
 * Execútase exclusivamente en build time (Node / servidor).
 * Le a estrutura de carpetas de Drive e devolve os álbumes con fotos.
 *
 * Nomenclatura esperada das carpetas en Drive:
 *   "YYYY-MM-DD Equipo Descripción"
 *   ex: "2025-09-07 Primer Equipo vs Narón"
 *        └──────────┘ └───────────────────┘
 *        data (ISO)   título libre
 *
 * Os primeiros 10 caracteres que coincidan con /^\d{4}-\d{2}-\d{2}/
 * extráense como data. O resto é o título.
 */

import { listFolder, listImages, driveImgUrl } from './drive';
import type { Album, DrivePhoto } from './schemas';

const FOLDER_ID = process.env.GOOGLE_DRIVE_GALLERY_FOLDER_ID ?? '';

const TEAM_KEYWORDS: Record<string, string[]> = {
  'primer-equipo': ['primer', 'primeiro', '1º', '1o', 'sénior', 'senior'],
  xuvenil:         ['xuvenil', 'juvenil'],
  cadete:          ['cadete'],
  infantil:        ['infantil'],
  alevin:          ['alevín', 'alevin'],
  benxamin:        ['benxamín', 'benxamin', 'benjamín', 'benjamin'],
  prebenxamin:     ['prebenxamín', 'prebenxamin', 'prebenjamín'],
  veteranos:       ['veteranos'],
} as const;

/** Intenta inferir o equipo a partir do nome da carpeta. */
function inferTeam(name: string): Album['team'] {
  const lower = name.toLowerCase();
  for (const [team, keywords] of Object.entries(TEAM_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return team as Album['team'];
    }
  }
  return null;
}

/** Converte o nome da carpeta en slug URL-safe. */
function toSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Descarga a estrutura completa de álbumes desde Drive.
 * Chamado unha vez en build time por cada páxina que o necesite.
 * Next.js cachea o resultado automáticamente (mesma instancia de build).
 */
export async function fetchAlbums(): Promise<Album[]> {
  if (!FOLDER_ID) {
    console.warn('[gallery] GOOGLE_DRIVE_GALLERY_FOLDER_ID non definido — devolvendo galería baleira.');
    return [];
  }

  // 1. Lista as subcarpetas de álbumes
  const folders = await listFolder(FOLDER_ID, {
    mimeType: 'application/vnd.google-apps.folder',
  });

  // 2. Para cada carpeta, lista as fotos e constrúe o álbum
  const albums: Album[] = await Promise.all(
    folders.map(async (folder) => {
      const name = folder.name;
      const dateMatch = name.match(/^(\d{4}-\d{2}-\d{2})/);
      const date = dateMatch ? dateMatch[1]! : '1970-01-01';
      const titleRaw = dateMatch ? name.slice(11).trim() : name;

      const photos = await listImages(folder.id);
      const drivePhotos: DrivePhoto[] = photos.map((f) => ({ id: f.id, name: f.name }));
      const coverDriveId = drivePhotos[0]?.id;

      return {
        slug: toSlug(name),
        driveFolderId: folder.id,
        title: { gl: titleRaw, es: titleRaw }, // mesmo título nos dous idiomas por defecto
        date,
        team: inferTeam(name),
        coverDriveId,
        photoCount: drivePhotos.length,
        photos: drivePhotos,
      } satisfies Album;
    }),
  );

  // Máis recente primeiro
  return albums.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/**
 * Devolve un álbum concreto polo seu slug.
 */
export async function fetchAlbum(slug: string): Promise<Album | null> {
  const albums = await fetchAlbums();
  return albums.find((a) => a.slug === slug) ?? null;
}

/**
 * URL de thumbnail para uso en next/image (src externo).
 */
export { driveImgUrl };
