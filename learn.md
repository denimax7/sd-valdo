# Lecciones aprendidas — S.D. Valdoviño Web

Todo lo que no es obvio y volveríamos a necesitar en el siguiente proyecto.

---

## 1. Migración de Vanilla HTML/CSS/JS a Next.js 14

### Lo que funcionó bien
- Usar el proyecto de un compañero como base en lugar de empezar desde cero. Copiar con `robocopy` excluyendo `node_modules`, `.next` y `out` es la forma más rápida.
- Mantener el contenido dinámico en archivos JSON (`data/`) desde el principio: facilita cambios sin tocar código.
- Incrustar contenido bilingüe estático directamente como constantes TypeScript en los archivos de página (sin crear nuevos JSON + schemas Zod). Tres páginas estáticas no justifican un sistema de CMS.

### Trampas
- `robocopy` devuelve código de salida 3 cuando copia archivos correctamente pero encuentra diferencias. **No es un error**, aunque PowerShell lo trate como tal.
- Al copiar un proyecto Next.js entre máquinas, hay que ejecutar `pnpm install` antes de cualquier otra cosa — no asumir que `node_modules` se puede copiar.

---

## 2. Routing bilingüe con `[locale]`

### Estructura
```
app/[locale]/page.tsx         ← homepage en gl y es
app/[locale]/club/page.tsx    ← sub-sección
```

### Puntos clave
- Cada ruta dinámica con `output: 'export'` necesita `generateStaticParams()`. Sin esto el build falla.
- Para páginas que son sólo un redirect (p.ej. `/club` → `/club/historia`), lo más simple es un componente `'use client'` con `useEffect` + `router.replace()`. No requiere `generateStaticParams`.
- Definir los locales en `lib/locales.ts` como `as const` y exportar el tipo `Locale` evita repetir strings en todo el proyecto.
- El helper `createT(locale)` centraliza las traducciones: `t('nav.calendar')` en vez de `locale === 'gl' ? '...' : '...'` por todas partes.

---

## 3. TypeScript — errores frecuentes y sus soluciones

### Error: tipo Zod `optional().default('')` vs tipo esperado
```ts
// ❌ Zod infiere el tipo de INPUT como string | undefined
notes: z.string().optional().default('')

// ✅ Zod infiere string directamente (ya tiene default, nunca es undefined en output)
notes: z.string().default('')
```

### Error: genérico `z.ZodType<T>` con Zod
```ts
// ❌ Zod distingue entre tipo de input y tipo de output, T puede no cuadrar
function loadJson<T>(schema: z.ZodType<T>): T

// ✅ Usar ZodTypeAny y z.infer<S> extrae el tipo de output correcto
function loadJson<S extends z.ZodTypeAny>(schema: S): z.infer<S>
```

### Error: acceso a clave de objeto que puede ser undefined
```ts
// ❌ "Object is possibly 'undefined'"
positionLabel[pos][locale]

// ✅ Optional chaining
positionLabel[pos]?.[locale]
```

### Error: tipo de registro bilingüe
```ts
// ❌ El tipo inferido puede no coincidir con Locale
const label: Record<string, Record<string, string>> = { ... }

// ✅ Usar el tipo Locale importado explícitamente
const label: Record<string, Record<Locale, string>> = { ... }
```

---

## 4. `output: 'export'` de Next.js — cuándo usarlo y cuándo no

### Cuándo usarlo
- Hospedaje en servidores estáticos: GitHub Pages, Netlify, un servidor Apache/Nginx propio.
- Cuando no se necesitan rutas de API de Next.js en producción.

### Cuándo NO usarlo (lección aprendida aquí)
- **Vercel**: El sistema de integración de Next.js en Vercel espera el directorio `.next`, no `out`. Con `output: 'export'` + output directory `out`, Vercel busca `out/routes-manifest.json` que no existe y el deploy falla aunque el build sea exitoso.
- **Solución**: eliminar `output: 'export'` de `next.config.mjs` y dejar que Vercel use su integración nativa de Next.js. Las páginas siguen siendo SSG (estáticas), solo cambia cómo las sirve Vercel.

### Problema del gallery con `output: 'export'`
Con static export, `generateStaticParams()` no puede devolver un array vacío — Next.js falla en el build. Solución: devolver un slug placeholder `__empty__` que genera una página 404:
```ts
if (out.length === 0) {
  return LOCALES.map((locale) => ({ locale, slug: '__empty__' }));
}
```

---

## 5. Vercel — configuración y deploy desde CLI

### Instalar y autenticar
```powershell
npm install -g vercel
vercel login   # abre el navegador para auth con device code
```

### Vincular proyecto existente
```powershell
vercel link --yes --project nombre-del-proyecto
```
Crea `.vercel/repo.json` con el `id` del proyecto y el `orgId`.

### Configurar via API (sin pasar por la UI de Vercel)
```powershell
# El token está en: $env:APPDATA\xdg.data\com.vercel.cli\auth.json
$token = "vca_..."
$projectId = "prj_..."
$teamId = "team_..."

Invoke-RestMethod -Method PATCH `
  -Uri "https://api.vercel.com/v9/projects/$projectId?teamId=$teamId" `
  -Headers @{ Authorization = "Bearer $token"; "Content-Type" = "application/json" } `
  -Body (@{ framework = "nextjs"; buildCommand = "pnpm build"; installCommand = "pnpm install" } | ConvertTo-Json)
```

### Limpiar variables de entorno antiguas antes de redesplegar
Cuando se reutiliza un proyecto de Vercel, puede haber variables de entorno obsoletas del proyecto anterior que rompan el build. Verificar y eliminarlas:
```powershell
# Listar
Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects/$projectId/env?teamId=$teamId" `
  -Headers @{ Authorization = "Bearer $token" }

# Eliminar cada una por su .id
Invoke-RestMethod -Method DELETE `
  -Uri "https://api.vercel.com/v9/projects/$projectId/env/$envId?teamId=$teamId" `
  -Headers @{ Authorization = "Bearer $token" }
```

### Deploy a producción
```powershell
vercel deploy --prod --yes
```

---

## 6. pnpm y Node.js en Windows — problemas de PATH

Node.js se instala en `C:\Program Files\nodejs` y pnpm en `C:\Users\<user>\AppData\Roaming\npm`. En PowerShell estas rutas no siempre están en `$env:PATH`.

```powershell
# Prefijar el PATH antes de cualquier comando que necesite node/pnpm
$env:PATH = "C:\Program Files\nodejs;C:\Users\oskib\AppData\Roaming\npm;" + $env:PATH
pnpm build
```

---

## 7. Google Drive como backend de galería sin el paquete `googleapis`

El paquete oficial `googleapis` pesa >15 MB y tarda en instalar. Alternativa: JWT manual con la Web Crypto API de Node.js:
1. Construir y firmar el JWT con `crypto.subtle` (disponible desde Node 18).
2. Intercambiar el JWT por un `access_token` en `https://oauth2.googleapis.com/token`.
3. Usar ese token en peticiones a `https://www.googleapis.com/drive/v3/files`.

Truco para thumbnails gratuitos con Google Drive: `https://lh3.googleusercontent.com/d/{fileId}=w{width}` — Google redimensiona en su CDN sin coste.

Cuando el gallery no está configurado, `fetchAlbums()` debe devolver `[]` en lugar de lanzar un error. Comprobar `FOLDER_ID` como primera línea de la función.

---

## 8. Zod — validación de JSON en tiempo de build

```ts
// Patrón para cargar y validar un JSON de datos
function loadJson<S extends z.ZodTypeAny>(filename: string, schema: S): z.infer<S> {
  const raw = JSON.parse(readFileSync(join(DATA_DIR, filename), 'utf-8'));
  const result = schema.safeParse(raw);
  if (!result.success) {
    const issues = result.error.issues
      .map((i) => `  · ${i.path.join('.')}: ${i.message}`)
      .join('\n');
    throw new Error(`[data] ${filename} no es válido:\n${issues}`);
  }
  return result.data;
}
```

Beneficio: si alguien edita un JSON con un error de formato, el build falla con un mensaje claro en lugar de datos corruptos llegando a producción.

---

## 9. Mapas sin Google Maps

OpenStreetMap + iframe es la opción más simple para mostrar un mapa estático:
```tsx
<iframe
  src={`https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`}
  className="h-64 w-full rounded border-0"
  title="Mapa"
/>
```
Sin API key, sin coste, sin GDPR adicional. Suficiente para páginas de contacto e instalaciones.

---

## 10. Commits y flujo Git en este proyecto

```bash
# Copiar proyecto y hacer commit de la migración completa de una vez
git add -A
git commit -m "Migrate to Next.js 14 — full rewrite"
git push origin main
```

Vercel redespliega automáticamente en cada `git push` a `main` una vez el proyecto está conectado al repositorio de GitHub.

---

## 11. Estructura de archivos que escala bien

```
data/          ← JSON editables por no-programadores (partidos, plantillas, directiva)
i18n/          ← Solo texto de interfaz (botones, labels, mensajes)
app/[locale]/  ← Contenido de página (puede tener bilingual constants inline si son pocas páginas)
lib/           ← Lógica servidor (lectura de datos, schemas, i18n helper, integraciones)
components/    ← UI reutilizable (nunca lógica de negocio aquí)
scripts/       ← CLIs de mantenimiento (add-match, set-result)
public/        ← Assets estáticos (fotos, escudos)
```

---

## 12. Notas sobre este proyecto específico

- **No hay páginas de noticias en el nav**: el módulo existe en el código pero no está enlazado desde ningún menú ni desde el bottom bar. Mantenerlo así.
- **Facebook eliminado**: no aparece en Footer, MobileDrawer ni en ningún enlace social. No volver a añadirlo.
- **Crédito Lambda Group**: en el Footer, bajo el copyright.
- **Foto hero**: `public/hero.jpg` — foto real del equipo, con `object-position: top` para que se vean las caras.
- **Repositorio**: `https://github.com/denimax7/sd-valdo`
- **URL producción**: `https://sd-valdo.vercel.app`
