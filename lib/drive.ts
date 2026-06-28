/**
 * lib/drive.ts
 * Cliente mínimo para Google Drive API v3.
 * Usa fetch + JWT manual para evitar importar o paquete `googleapis` (>15 MB).
 * Só se executa en build time (Node), nunca no navegador.
 */

const DRIVE_API = 'https://www.googleapis.com/drive/v3';
const SCOPES = 'https://www.googleapis.com/auth/drive.readonly';

// ── JWT / OAuth ────────────────────────────────────────────────────────────────

/**
 * Constrúe e asina un JWT de Service Account para obter un access_token de Drive.
 * Non depende de ningunha libraría externa — só crypto de Node.
 */
async function getAccessToken(): Promise<string> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !rawKey) {
    throw new Error(
      '[drive] Faltan as variables de entorno GOOGLE_SERVICE_ACCOUNT_EMAIL ou GOOGLE_PRIVATE_KEY. ' +
        'Configúraas en Vercel → Settings → Environment Variables.',
    );
  }

  // Vercel almacena \n literais; normaliza
  const pemKey = rawKey.replace(/\\n/g, '\n');

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'RS256', typ: 'JWT' };
  const payload = {
    iss: email,
    scope: SCOPES,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  };

  const b64 = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString('base64url');

  const signingInput = `${b64(header)}.${b64(payload)}`;

  // Importar a chave PEM co Web Crypto API de Node 18+
  const keyData = pemKey
    .replace(/-----BEGIN PRIVATE KEY-----/, '')
    .replace(/-----END PRIVATE KEY-----/, '')
    .replace(/\s/g, '');
  const binaryKey = Buffer.from(keyData, 'base64');

  const cryptoKey = await crypto.subtle.importKey(
    'pkcs8',
    binaryKey,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    cryptoKey,
    Buffer.from(signingInput),
  );

  const jwt = `${signingInput}.${Buffer.from(signature).toString('base64url')}`;

  // Trocar o JWT por un access_token
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[drive] Erro ao obter access_token: ${err}`);
  }

  const data = (await res.json()) as { access_token: string };
  return data.access_token;
}

// ── Tipos Drive ────────────────────────────────────────────────────────────────

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

// ── Funcións públicas ──────────────────────────────────────────────────────────

/**
 * Lista os fillos directos dunha carpeta de Drive.
 * `mimeType` filtra por tipo se se pasa (ex: 'application/vnd.google-apps.folder').
 */
export async function listFolder(
  folderId: string,
  options: { mimeType?: string; token?: string } = {},
): Promise<DriveFile[]> {
  const token = options.token ?? (await getAccessToken());

  const q = options.mimeType
    ? `'${folderId}' in parents and mimeType='${options.mimeType}' and trashed=false`
    : `'${folderId}' in parents and trashed=false`;

  const params = new URLSearchParams({
    q,
    fields: 'files(id,name,mimeType)',
    orderBy: 'name',
    pageSize: '1000',
  });

  const res = await fetch(`${DRIVE_API}/files?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[drive] Erro listando carpeta ${folderId}: ${err}`);
  }

  const data = (await res.json()) as { files: DriveFile[] };
  return data.files ?? [];
}

/**
 * Lista só as imaxes dunha carpeta (filtra por mimeType image/*).
 */
export async function listImages(folderId: string, token?: string): Promise<DriveFile[]> {
  const t = token ?? (await getAccessToken());

  const q = `'${folderId}' in parents and mimeType contains 'image/' and trashed=false`;
  const params = new URLSearchParams({
    q,
    fields: 'files(id,name,mimeType)',
    orderBy: 'name',
    pageSize: '1000',
  });

  const res = await fetch(`${DRIVE_API}/files?${params}`, {
    headers: { Authorization: `Bearer ${t}` },
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`[drive] Erro listando imaxes de ${folderId}: ${err}`);
  }

  const data = (await res.json()) as { files: DriveFile[] };
  return data.files ?? [];
}

/**
 * Constrúe a URL pública de visualización directa dunha foto de Drive.
 * Usa lh3.googleusercontent.com (o CDN de Google para Drive/Photos).
 * O parámetro =wN redimensiona no servidor de Google — gratis e rápido.
 * A foto debe ter permisos "Cualquiera con el enlace puede ver".
 */
export function driveImgUrl(fileId: string, width: 400 | 800 | 1200 | 1920 = 800): string {
  return `https://lh3.googleusercontent.com/d/${fileId}=w${width}`;
}
