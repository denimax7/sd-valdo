# S.D. Valdoviño — Web oficial

Sitio web oficial da **Sociedade Deportiva Valdoviño**, club de fútbol da vila de Valdoviño (A Coruña, Galicia) que milita na Primeira FUTGAL Grupo I, delegación de Ferrol.

Estático, sen backend, sen tenda, sen área privada. **Bilingüe galego / castelán**.

Desenvolvido por **Lambda Group**.

---

## Stack técnico

| Tecnoloxía | Uso |
|---|---|
| **Next.js 14** (App Router, `output: 'export'`) | Framework principal, xeración estática |
| **TypeScript** modo estrito | Seguridade de tipos en todo o proxecto |
| **Tailwind CSS** + tokens cor laranxa | Estilos e deseño |
| **shadcn/ui** (Radix UI) | Compoñentes Sheet, Tabs, Select, Dialog |
| **Framer Motion** | Microanimacións |
| **Zod** | Validación dos JSON en tempo de build |
| **Leaflet + OpenStreetMap** | Mapa do campo (sen Google Maps) |
| Google Fonts (Anton, Barlow Condensed, Inter, JetBrains Mono) | Tipografía |

---

## Estrutura do proxecto

```
sd_valdo_2/
├── app/                        # Páxinas (Next.js App Router)
│   ├── [locale]/               # Rutas bilingües (gl / es)
│   │   ├── page.tsx            # Homepage
│   │   ├── layout.tsx          # Layout con header, footer, statusbanner
│   │   ├── calendario/         # Calendario de partidos con filtros
│   │   ├── club/
│   │   │   ├── historia/       # Historia do club
│   │   │   ├── instalacions/   # Instalacións + mapa OpenStreetMap
│   │   │   ├── directiva/      # Xunta directiva
│   │   │   ├── corpo-tecnico/  # Persoal técnico
│   │   │   └── contacto/       # Contacto + sección envío de fotos
│   │   ├── equipos/[categoria] # Plantilla e información de cada equipo
│   │   ├── valdovino/
│   │   │   ├── concello/       # Info do municipio (stats, seccións)
│   │   │   ├── praias-e-natureza/ # Praias e espazos naturais
│   │   │   └── cultura-e-festas/  # Eventos culturais e festas
│   │   ├── galeria/            # Galería fotográfica (require Google Drive)
│   │   └── legal/              # Aviso legal, privacidade, cookies
│   └── layout.tsx              # Layout raíz (fontes, metadata global)
│
├── components/                 # Compoñentes reutilizables
│   ├── layout/                 # Header, Footer, BottomBar, MobileDrawer, StatusBanner
│   ├── match/                  # MatchCard, Countdown, AddToCalendarButton
│   ├── calendario/             # CalendarView con filtros por equipo/mes
│   ├── gallery/                # AlbumGrid, GalleryTeaser, PhotoMasonry
│   ├── team/                   # TeamCrest
│   ├── common/                 # SectionHeader, StubPage
│   └── ui/                     # Compoñentes shadcn (Button, Badge, Card...)
│
├── data/                       # Contido dinámico en JSON (aquí se edita o contido)
│   ├── calendar.json           ← PARTIDOS
│   ├── teams.json              ← PLANTILLAS
│   ├── board.json              ← DIRECTIVA
│   ├── staff.json              ← CORPO TÉCNICO
│   ├── facilities.json         ← INSTALACIÓNS (campo principal)
│   ├── news.json               ← NOVAS (non amosadas en nav, en arquivo)
│   └── inscriptions.json       ← BANNER DE INSCRICIÓN
│
├── i18n/                       # Traducións da interface
│   ├── gl.json                 ← Galego
│   └── es.json                 ← Castelán
│
├── lib/                        # Utilidades servidor
│   ├── data.ts                 # Funcións de lectura de JSON con validación Zod
│   ├── schemas.ts              # Schemas Zod de todos os JSON
│   ├── i18n.ts                 # Sistema de traducións
│   ├── gallery.ts              # Integración con Google Drive (galería)
│   ├── drive.ts                # Cliente API de Google Drive
│   ├── ics.ts                  # Xeración de ficheiros .ics (engadir ao calendario)
│   └── locales.ts              # Definición de locales (gl, es)
│
├── public/
│   ├── hero.jpg                # Foto do equipo (hero da homepage)
│   └── crests/
│       ├── sd-valdovino.png    # Escudo oficial do club
│       └── placeholder.svg     # Escudo neutro para rivais
│
├── scripts/
│   ├── add-match.ts            # CLI interactivo para engadir partidos
│   └── set-result.ts           # CLI para introducir resultados
│
├── next.config.mjs             # Configuración Next.js (output: export)
├── tailwind.config.ts          # Tokens de cor e configuración Tailwind
└── vercel.json                 # Configuración de despregue en Vercel
```

---

## Executar en local

**Requisitos:** Node.js ≥ 18.17 e pnpm.

```bash
# Instalar Node.js desde https://nodejs.org/
npm install -g pnpm

pnpm install
pnpm dev          # → http://localhost:3000 (redirixe a /gl)
pnpm build        # Xenera a versión estática en /out
pnpm typecheck    # Verifica os tipos TypeScript
```

---

## Como engadir un partido

### Opción A — Script interactivo (recomendada)

```bash
pnpm add-match
```

Fai preguntas sobre equipo, rival, data, hora, campo e competición. Valida con Zod e garda en `data/calendar.json`.

Despois fai commit e push:

```bash
git add data/calendar.json
git commit -m "calendario: engadir Valdoviño vs Narón"
git push
```

### Opción B — Editar o JSON a man

Abre `data/calendar.json` e engade ao array `matches`:

```json
{
  "id": "2026-09-06-primer-equipo-vs-naron",
  "team": "primer-equipo",
  "competition": "Primeira FUTGAL Grupo I",
  "matchday": 1,
  "home": { "name": "S.D. Valdoviño", "shortName": "VAL", "crest": "/crests/sd-valdovino.png" },
  "away": { "name": "C.D. Narón B.P.", "shortName": "NAR", "crest": "/crests/placeholder.svg" },
  "kickoff": "2026-09-06T17:00:00+02:00",
  "venue": {
    "name": "Campo Municipal de Valdoviño",
    "address": "Estrada da Frouxeira s/n, 15552 Valdoviño",
    "lat": 43.6019, "lng": -8.1342
  },
  "status": "scheduled",
  "score": null,
  "notes": ""
}
```

**Valores válidos:**
- `team`: `primer-equipo`, `xuvenil`, `cadete`, `infantil`, `alevin`, `benxamin`, `prebenxamin`, `veteranos`
- `status`: `scheduled`, `live`, `finished`, `postponed`, `cancelled`
- `kickoff`: ISO 8601 con offset (`+02:00` verán, `+01:00` inverno)

Actualiza tamén `lastUpdated` no nivel raíz do JSON.

---

## Como introducir o resultado dun partido

```bash
pnpm set-result
```

Lista os partidos pendentes, escolles un e introduces os goles. Cambia `status` a `finished` automaticamente.

Ou a man en `data/calendar.json`:
```json
"status": "finished",
"score": { "home": 2, "away": 1 }
```

---

## Como actualizar a plantilla

Edita `data/teams.json`. Cada equipo ten un campo `players`:

```json
{ "number": 17, "name": "Brais Iglesias", "position": "DEL" }
```

**Posicións válidas:** `POR` (porteiro), `DEF` (defensa), `CEN` (centrocampista), `DEL` (dianteiro)

---

## Como actualizar a directiva

Edita `data/board.json`:

```json
{ "name": "Xosé Manuel Rilo", "role": "Presidente", "since": "2022" }
```

---

## Como actualizar o corpo técnico

Edita `data/staff.json` (persoal do primeiro equipo con roles detallados):

```json
{ "team": "primer-equipo", "name": "Manuel Pico", "role": "Adestrador" }
```

Os adestradores dos equipos base xestiónanse no campo `coach` de `data/teams.json`.

---

## Como actualizar o banner de inscrición

Edita `data/inscriptions.json`. Cambia `"open": true` para mostrar en verde, `"open": false` para mostrar en vermello:

```json
{
  "open": true,
  "formUrl": "/gl/club/contacto",
  "textOpen": { "gl": "Inscrición aberta · Únete á S.D. Valdoviño", "es": "Inscripción abierta · Únete a la S.D. Valdoviño" },
  "textClosed": { "gl": "Inscrición pechada", "es": "Inscripción cerrada" },
  "ctaLabel": { "gl": "Apuntarme", "es": "Apuntarme" }
}
```

---

## Como configurar a galería de fotos (Google Drive)

A galería usa Google Drive como backend de imaxes. Para activala:

1. Crea un **Service Account** en [Google Cloud Console](https://console.cloud.google.com).
2. Activa a **Google Drive API**.
3. Descarga a chave JSON do Service Account.
4. Comparte a carpeta de álbumes en Drive co email do Service Account.
5. En **Vercel → Settings → Environment Variables**, engade:
   - `GOOGLE_DRIVE_GALLERY_FOLDER_ID` — ID da carpeta raíz
   - `GOOGLE_SERVICE_ACCOUNT_EMAIL` — email do Service Account
   - `GOOGLE_PRIVATE_KEY` — chave privada PEM (con `\n` literais)
6. Fai un redespregamento.

Cada subcarpeta dentro da carpeta principal convértese nun álbum.  
Formato de nome recomendado: `YYYY-MM-DD Descrición` (ex: `2026-09-07 Primer Equipo vs Narón`).

---

## Como cambiar textos da interface

Os textos dos botóns, menús e seccións están en `i18n/gl.json` (galego) e `i18n/es.json` (castelán). As claves son idénticas en ambos ficheiros. Edita o valor que corresponda.

---

## Como facer deploy en Vercel

1. Fai `git push` ao repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → New Project → importa o repositorio.
3. Framework preset: **Next.js**.
4. Build command: `pnpm build` · Output directory: `out`.
5. O ficheiro `vercel.json` redirixe `/` a `/gl` automaticamente.

Vercel redesprégase en cada `git push` a `main`.

---

## Imaxes e escudos

- **Hero homepage**: `public/hero.jpg` — substitúe por outra foto para cambiar o fondo
- **Escudo oficial**: `public/crests/sd-valdovino.png`
- **Escudo neutro** para rivais sen escudo propio: `public/crests/placeholder.svg`

---

## Validación de datos

Todos os JSON de `data/` son validados con **Zod** en tempo de build. Se un ficheiro ten erros de formato (campo que falta, tipo incorrecto, etc.), **o build falla con mensaxe clara** indicando o campo problemático. Isto evita que datos incorrectos cheguen a produción.

---

## Licenza

Código: MIT.  
Marca, escudo e contido: © S.D. Valdoviño. Todos os dereitos reservados.

— *Desenvolvido por Lambda Group con orgullo.*
