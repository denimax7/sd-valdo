# S.D. Valdoviño — Web Oficial

Sitio web oficial de la **Sociedad Deportiva Valdoviño**, club de fútbol del concello de Valdoviño (A Coruña), que compite en la Primera FUTGAL Grupo I.

Desarrollado por **[Lambda Group](https://lambdagroup.es)**.

---

## Índice

- [Estructura del proyecto](#estructura-del-proyecto)
- [Cómo funciona el sitio](#cómo-funciona-el-sitio)
- [Editar contenido](#editar-contenido)
  - [Partidos y calendario](#partidos-y-calendario)
  - [Equipos y plantillas](#equipos-y-plantillas)
  - [Directiva](#directiva)
  - [Cuerpo técnico](#cuerpo-técnico)
  - [Instalaciones](#instalaciones)
  - [Historia del club](#historia-del-club)
  - [Contacto y redes sociales](#contacto-y-redes-sociales)
  - [Valdoviño (concello, playas, cultura)](#valdoviño)
- [Añadir nuevos elementos](#añadir-nuevos-elementos)
- [Cambiar idioma por defecto](#cambiar-idioma-por-defecto)
- [Tecnologías](#tecnologías)

---

## Estructura del proyecto

```
sd-valdo/
├── data/                    ← ⭐ ARCHIVOS DE CONTENIDO (editar aquí)
│   ├── club.json            ← Todo el contenido del club
│   ├── valdovino.json       ← Todo el contenido de Valdoviño
│   ├── teams.json           ← Equipos y plantillas
│   └── matches.json         ← Partidos y calendario
│
├── gl/                      ← Páginas en galego
│   ├── index.html
│   ├── club/
│   │   ├── historia.html
│   │   ├── instalacions.html
│   │   ├── directiva.html
│   │   ├── corpo-tecnico.html
│   │   └── contacto.html
│   ├── valdovino/
│   │   ├── concello.html
│   │   ├── praias-e-natureza.html
│   │   └── cultura-e-festas.html
│   ├── equipos/
│   │   └── equipo.html      ← Página dinámica por equipo (?team=...)
│   └── calendario.html
│
├── es/                      ← Páginas en español (misma estructura)
│
├── css/
│   └── style.css
├── js/
│   └── main.js              ← Menú, drawer, cambio de idioma
└── public/
    └── crests/
        └── sd-valdovino.png
```

---

## Cómo funciona el sitio

El sitio es **HTML + CSS + JavaScript puro**, sin frameworks ni bundlers. No requiere servidor de backend.

Cada página tiene un `<div id="content">` vacío. Al cargar la página, un script en el propio HTML hace un `fetch()` al archivo JSON correspondiente en `/data/` y renderiza el contenido con template literals de JavaScript.

**Ejemplo simplificado:**
```js
const data = await fetch('../../data/club.json').then(r => r.json());
document.getElementById('content').innerHTML = data.directiva.members
  .map(m => `<div>${m.name} — ${m.role_es}</div>`)
  .join('');
```

Esto significa que **para actualizar cualquier información basta con editar el JSON**. No hay que tocar HTML.

---

## Editar contenido

### Partidos y calendario

**Archivo:** `data/matches.json`

```json
{
  "matches": [
    {
      "date": "2025-09-07",
      "time": "17:00",
      "home": "S.D. Valdoviño",
      "away": "C.F. Rival",
      "competition_gl": "Primeira FUTGAL",
      "competition_es": "Primera FUTGAL",
      "venue_gl": "Campo Municipal de Valdoviño",
      "venue_es": "Campo Municipal de Valdoviño",
      "result": null
    }
  ]
}
```

| Campo | Descripción |
|---|---|
| `date` | Fecha en formato `YYYY-MM-DD` |
| `time` | Hora en formato `HH:MM` |
| `home` / `away` | Nombres de los equipos |
| `competition_gl` / `competition_es` | Nombre de la competición en cada idioma |
| `result` | `null` si el partido no se ha jugado, o `"2-1"` si ya tiene resultado |

Para **añadir un partido** simplemente añade un objeto nuevo al array `matches`.

---

### Equipos y plantillas

**Archivo:** `data/teams.json`

```json
{
  "primer-equipo": {
    "name_gl": "Primeiro equipo",
    "name_es": "Primer equipo",
    "category_gl": "Sénior masculino",
    "category_es": "Sénior masculino",
    "season": "2024/2025",
    "coach_gl": "Por confirmar",
    "coach_es": "Por confirmar",
    "players": [
      {
        "number": 1,
        "name": "Nombre Apellido",
        "position_gl": "Porteiro",
        "position_es": "Portero"
      }
    ]
  },
  "xuvenil": { ... },
  "cadete": { ... }
}
```

Cada equipo se identifica por su **slug** (clave del JSON), que debe coincidir con el parámetro `?team=` en la URL. Por ejemplo, `/gl/equipos/equipo.html?team=primer-equipo` carga el objeto `"primer-equipo"` del JSON.

Para **añadir un jugador** añade un objeto al array `players` del equipo correspondiente.

Para **añadir un equipo nuevo**, añade una clave nueva al JSON y enlázala en el menú de los archivos HTML del header/drawer.

---

### Directiva

**Archivo:** `data/club.json` → sección `directiva`

```json
"directiva": {
  "gl": { "intro": "Texto introductorio en galego..." },
  "es": { "intro": "Texto introductorio en español..." },
  "members": [
    {
      "name": "Nombre Apellido",
      "role_gl": "Presidente/a",
      "role_es": "Presidente/a",
      "email": "presidente@sdvaldovino.gal"
    }
  ]
}
```

Para **añadir un miembro**, añade un objeto al array `members`. El campo `email` es opcional — si está vacío (`""`), no se muestra.

---

### Cuerpo técnico

**Archivo:** `data/club.json` → sección `corpo_tecnico`

```json
"corpo_tecnico": {
  "gl": { "intro": "..." },
  "es": { "intro": "..." },
  "staff": [
    {
      "name": "Nombre Apellido",
      "role_gl": "Adestrador/a",
      "role_es": "Entrenador/a",
      "team_gl": "Primeiro equipo",
      "team_es": "Primer equipo"
    }
  ]
}
```

Para **añadir un técnico**, añade un objeto al array `staff`.

---

### Instalaciones

**Archivo:** `data/club.json` → sección `instalacions`

```json
"instalacions": {
  "gl": { "intro": "..." },
  "es": { "intro": "..." },
  "items": [
    {
      "name_gl": "Campo Municipal de Valdoviño",
      "name_es": "Campo Municipal de Valdoviño",
      "icon": "map-pin",
      "desc_gl": "Descripción en galego...",
      "desc_es": "Descripción en español...",
      "details_gl": ["Céspede natural", "Capacidade 500 espectadores"],
      "details_es": ["Césped natural", "Capacidad 500 espectadores"]
    }
  ]
}
```

El campo `icon` acepta cualquier nombre de icono de [Lucide Icons](https://lucide.dev/icons/).

---

### Historia del club

**Archivo:** `data/club.json` → sección `historia`

```json
"historia": {
  "gl": {
    "intro": "Párrafo introductorio en galego...",
    "milestones": [
      { "year": "1967", "title": "Fundación", "text": "Texto del hito..." }
    ]
  },
  "es": {
    "intro": "Párrafo introductorio en español...",
    "milestones": [
      { "year": "1967", "title": "Fundación", "text": "Texto del hito..." }
    ]
  }
}
```

Para **añadir un hito** añade un objeto al array `milestones` de cada idioma.

---

### Contacto y redes sociales

**Archivo:** `data/club.json` → sección `contacto`

```json
"contacto": {
  "address": "Estrada da Frouxeira s/n, 15552 Valdoviño, A Coruña",
  "email": "info@sdvaldovino.gal",
  "phone": "",
  "maps_url": "https://maps.google.com/?q=Campo+Municipal+de+Valdoviño",
  "social": {
    "instagram": "https://instagram.com/sd.valdovino",
    "twitter": "https://twitter.com/sd_valdovino",
    "facebook": "https://facebook.com"
  }
}
```

El campo `phone` puede dejarse vacío (`""`), en ese caso no aparece en la página.

---

### Valdoviño

**Archivo:** `data/valdovino.json`

Contiene tres secciones:

#### O Concello / El Concello

```json
"concello": {
  "stats": [
    { "value": "~7.000", "label_gl": "Habitantes", "label_es": "Habitantes" }
  ],
  "gl": {
    "intro": "...",
    "sections": [
      { "icon": "map-pin", "title": "Situación xeográfica", "text": "..." }
    ]
  },
  "es": { "intro": "...", "sections": [...] }
}
```

#### Praias / Playas

```json
"praias": {
  "gl": { "intro": "..." },
  "es": { "intro": "..." },
  "items": [
    {
      "name": "Praia de Pantín",
      "icon": "waves",
      "desc_gl": "...",
      "desc_es": "...",
      "tags_gl": ["Surf", "Bandeira Azul"],
      "tags_es": ["Surf", "Bandera Azul"]
    }
  ]
}
```

#### Cultura e festas / Cultura y fiestas

```json
"cultura": {
  "gl": { "intro": "..." },
  "es": { "intro": "..." },
  "items": [
    {
      "name_gl": "Campionato de Surf de Pantín",
      "name_es": "Campeonato de Surf de Pantín",
      "icon": "award",
      "desc_gl": "...",
      "desc_es": "...",
      "when_gl": "Setembro",
      "when_es": "Septiembre"
    }
  ]
}
```

---

## Añadir nuevos elementos

El sitio es **completamente dinámico**: añadir un elemento al array JSON equivale a añadirlo en la página. No hay que tocar HTML.

| Quiero añadir... | Edito el array... en |
|---|---|
| Un miembro de directiva | `directiva.members` | `data/club.json` |
| Un técnico | `corpo_tecnico.staff` | `data/club.json` |
| Una instalación | `instalacions.items` | `data/club.json` |
| Un hito histórico | `historia.gl.milestones` y `historia.es.milestones` | `data/club.json` |
| Una playa | `praias.items` | `data/valdovino.json` |
| Un evento cultural | `cultura.items` | `data/valdovino.json` |
| Un partido | `matches` | `data/matches.json` |
| Un jugador | `[equipo].players` | `data/teams.json` |

---

## Cambiar idioma por defecto

El sitio tiene dos versiones completas: `/gl/` (galego) y `/es/` (español). El archivo raíz `index.html` redirige al idioma preferido del navegador del usuario.

Para cambiar el idioma por defecto de la redirección, edita `index.html` en la raíz:

```js
// Redirige a galego si el idioma del navegador es gallego, sino a español
const lang = navigator.language.startsWith('gl') ? 'gl' : 'es';
window.location.replace(`/${lang}/`);
```

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 semántico | Estructura de páginas |
| CSS3 (variables, grid, flexbox) | Estilos y diseño responsivo |
| JavaScript ES2020 (vanilla) | Fetch de JSON, renderizado dinámico |
| [Lucide Icons](https://lucide.dev) | Iconografía (CDN) |
| [Vercel](https://vercel.com) | Hosting y despliegue |
| [GitHub](https://github.com) | Control de versiones |

No se usan frameworks, bundlers ni dependencias de npm. El sitio es completamente estático.

---

## Desarrollado por

**Lambda Group** — Desarrollo web y soluciones digitales.

---

*S.D. Valdoviño · Valdoviño, A Coruña*
