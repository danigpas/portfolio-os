# HANDOFF — T5: Integración frontend ↔ backend

Rama: `feature/t5-integracion` (worktree `C:/Users/danig/orca/workspaces/portfolio-os/t5-integracion`).
Ticket: **DAN-94**. Builder: `deepseek-v4-flash` (medium). Run `run_7739df1b79d3`, dispatch `ctx_18e2f597eeed`.

## Objetivo

Conseguir que el escritorio Omarchy (Next.js) **consuma la API FastAPI real de T1** de
forma robusta y *offline-first*, con:

- Datos del CV/landing servidos por la API con **fallback elegante** a `lib/cv-data.ts`
  si el backend no responde en 3 s.
- Descarga de CV vía `GET /api/cv` (fallback al PDF estático de `public/`).
- Formulario de contacto real vía `POST /api/contact` con feedback éxito/error.
- `.env.example` (raíz + backend) y README con arquitectura e instrucciones de arranque.
- Indicador de estado del backend en la waybar (opcional, barato).

Dependencias: T2 (landing/`cv-data`), T3 (temas/boot/waybar) y T4 (WM/rofi/terminal) ya
en la base; T1 (backend) vive en otra rama **sin mergear a develop**.

## Estado actual

- ✅ **Integración completada y verificada**. Rama **pusheada** a origin.
- ✅ Merge de `origin/feature/t1-backend-fastapi` (`--allow-unrelated-histories`): 34
  archivos en `backend/`, **sin conflictos** (áreas distintas).
- ✅ `npx tsc --noEmit` limpio.
- ✅ `npm run build` verde (7/7 páginas, First Load JS 211 kB en `/`).
- ✅ Backend real probado con Docker: `/api/health` 200, endpoints de datos ES/EN 200,
  `POST /api/contact` 202, `GET /api/cv` 200 (`application/pdf`, ~302 KB, firma `%PDF-`),
  preflight CORS de `localhost:3000` OK.
- ✅ `npm run smoke` → 13 comprobaciones `PASS` (`✅ Todo OK`).
- ✅ Fallback validado con API en puerto muerto: `source=local`, datos locales intactos.
- 🟡 **Sin PR** (la crea el orquestador tras el review). **Ticket DAN-94 sin cambio de estado.**
- ⚠️ Docker Desktop estaba **apagado** al momento de escribir este handoff (los comandos de
  test requieren levantarlo).

Commits (sobre la base `5c87b6c`):

```
a1c99c3 chore(t5): .env.example, README de arquitectura y smoke test
199fee9 feat(t5): postman, contacto y CV contra la API real
dbf3877 feat(t5): cliente API tipado con timeout y fallback offline-first
95f531a Merge remote-tracking branch 'origin/feature/t1-backend-fastapi' ...
```

## Decisiones tomadas (y por qué)

1. **Base desde `origin/feature/t4-omarchy-wm` (`5c87b6c`), NO desde `danigpas/t5-integracion`
   (`2942724`) donde nació el worktree.** El worktree se creó sobre el T4 *prec-rebase*, que
   **no incluye T3**. `origin/feature/t4-omarchy-wm` es el T4 rebasado sobre T3 y sí contiene
   T2+T3+T4 (temas Omarchy, waybar, wallpapers). Se hizo `git checkout -B feature/t5-integracion 5c87b6c`.
2. **Nuevo `PortfolioDataProvider` + hook `useCvData()` en lugar de hacer los componentes
   `async`.** Los componentes seguían llamando a `getCvData(language)` de forma síncrona; el
   provider carga la API una vez, la fusiona y expone el mismo tipo `CVData`. Fuera del
   provider (SSR de la landing) `useCvData()` devuelve los datos locales, así el render nunca
   se rompe ni genera *hydration mismatch* (primer render = local, luego API).
3. **El provider solo envuelve el `DesktopSession`, no la landing.** La landing es SSR y usa
   `cv-data` directamente; evitar fetch innecesario en `/`.
4. **`downloadCv()` usa `blob` + `URL.createObjectURL`** para forzar la descarga real desde la
   API y, si falla/timea, cae al PDF estático. Devuelve `"api"|"local"` para trazabilidad.
5. **PostmanApp pide cada endpoint GET de forma independiente** (`fetchEndpointData`) además
   del fetch del provider, para que el `network tab` muestre la llamada real y se pueda marcar
   el badge `API`/`LOCAL` por respuesta. Endpoints sin equivalente en la API (blog, testimonials,
   analytics, pwa, certifications, case-studies) se sirven del fallback local.
6. **Mapeo API → `CVData` con *merge* sobre lo local**: cada sección se reemplaza solo si su
   endpoint respondió; el resto conserva el dato local. `about` alimenta también `contact`
   (email/location/github/linkedin desde `links`). `bullets` de la landing se generan de `stats`
   cuando hay API. Nota: el **email del backend difiere del local** — con API up se ve el del
   backend (es la fuente de verdad). Decidido a propósito; revisar si conviene alinear.
7. **Indicador de backend en la waybar** añadido junto al de red (`api:up`/`api:down`/`api…`),
   sondeando `/api/health` cada 30 s desde el provider.

## Ficheros clave

| Fichero | Rol |
| :-- | :-- |
| `lib/api.ts` | Cliente de la API: `API_URL`, timeout 3s, `fetchPortfolioData`, `fetchEndpointData`, `sendContact`, `downloadCv`, `checkBackendHealth` + mappers API→CVData. |
| `components/portfolio-data-provider.tsx` | Provider de datos y estado del backend; hooks `usePortfolioData()` / `useCvData()`. |
| `components/postman-app.tsx` | Skeleton omarchy, badge `API`/`LOCAL`, banner de error + reintento, CV vía API. |
| `components/contact-section.tsx` | Formulario `POST /api/contact` con honeypot y feedback 202/error. |
| `components/{about,experience,education,projects}-section.tsx`, `terminal.tsx` | Ahora leen de `useCvData()` (API con fallback). |
| `components/desktop-session.tsx` | Envuelve el escritorio con `PortfolioDataProvider`; descarga CV vía API. |
| `components/ubuntu-desktop.tsx`, `omarchy-waybar.tsx` | Descarga CV vía API + indicador `api:up/down`. |
| `scripts/smoke.mjs` (+ `npm run smoke`) | Smoke test de integración sin dependencias (Node 18+). |
| `.env.example`, `README.md`, `backend/` | Config documentada, arquitectura/arranque y backend T1 mergeado. |

## Cambios sin commitear

**Ninguno.** Todo el trabajo de T5 está commiteado y la rama está pusheada. `git status`
está limpio salvo este `HANDOFF.md` (que se crea ahora **sin** commitear ni pushear, por
indicación explícita).

## Comandos de arranque / test

Frontend (raíz):
```bash
npm install --legacy-peer-deps   # React 19 → hace falta el flag
cp .env.example .env.local       # opcional: NEXT_PUBLIC_API_URL (default http://localhost:8000)
npm run dev                      # http://localhost:3000
```

Backend con venv (si hay Python 3.11+):
```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate    # git-bash; PowerShell: .venv\Scripts\Activate.ps1; linux/mac: source .venv/bin/activate
pip install -e ".[dev]"
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Backend con Docker (sin Python en el host) — **montar la raíz del repo**, no solo `backend/`:
```bash
docker run --rm -p 8000:8000 -v "$(pwd):/repo" -w /repo/backend python:3.12 \
  sh -c "pip install -q -e . && uvicorn app.main:app --host 0.0.0.0 --port 8000"
# En Windows/git-bash si `-w /app` se corrompe por path mangling, prefijar: MSYS_NO_PATHCONV=1
curl http://localhost:8000/api/health
```

Verificación:
```bash
npx tsc --noEmit
npm run build
npm run smoke                    # requiere backend up → "✅ Todo OK"
```

## Próximos 3 pasos

1. **Dejar el backend arriba y hacer el smoke E2E manual en el navegador** (boot → app
   Postman → badge `API` → `POST /contact` con éxito 202 → apagar backend y ver `LOCAL` +
   `api:down`), para confirmar visualmente lo que ya valida `npm run smoke`.
2. **Resolver la duda del email de contacto** (backend usa `...@email.com`, local usa
   `...@protonmail.com`): decidir si se alinean `backend/app/data/cv.py` y `lib/cv-data.ts`
   o si el backend manda. Alinear también el resto de datos si el review lo pide.
3. **Pasar a review (DAN-94)**: el orquestador lanza el reviewer sobre `feature/t5-integracion`;
   si `APPROVED`, abrir PR a `develop`. El builder **no** crea PR ni mergea.

## Trampas y contexto no obvio

- **El T4 del worktree (`2942724`) NO tenía T3.** Si alguien revisa/mergea `danigpas/t5-integracion`
  (la rama huérfana en la que nació el worktree) se perderían temas/waybar. Trabajar siempre
  sobre `feature/t5-integracion` = `5c87b6c` + merge T1.
- **Docker en Windows/git-bash:** `-w /app` puede convertirse a `C:/Program Files/Git/app`
  (MSYS path mangling). Usar `MSYS_NO_PATHCONV=1` o montar la raíz en `/repo` con `-w /repo/backend`.
- **`GET /api/cv` devuelve 404 si solo montas `backend/`** en Docker: la ruta por defecto del
  PDF es `<raiz_repo>/public/...` y con `-v ./backend:/app` la raíz queda fuera. Por eso el
  comando correcto monta `$(pwd):/repo`. (Este 404 también demuestra el *fallback* al PDF estático.)
- **El backend T1 no está en `develop`** (ni en `main`): solo existe en
  `origin/feature/t1-backend-fastapi` y, ahora, dentro de `feature/t5-integracion` vía merge.
  Al mergear T5 a `develop`, `backend/` entra con él.
- **`POST /api/contact` tiene rate-limit slowapi `5/minute` por IP** (en memoria). Si el smoke
  o las pruebas manuales fallan con 429, es el límite, no un bug.
- **Doble fetch deliberado:** el provider pide todos los endpoints Y la PostmanApp pide el
  endpoint activo. Es a propósito para el badge/`network tab`; si molesta, se puede pasar el
  `data` del provider como fallback y quitar el `useEffect` de `fetchEndpointData`.
- **`AbortSignal.timeout`** requiere navegador moderno / Node 18+ (está soportado; sin polyfill).
- **`.gitignore` tiene `.env*`**: se añadió `!.env.example` para versionar el ejemplo. No
  commitear nunca `.env.local` ni `backend/.env` (sin secretos ahora, pero por convención).
- **El backend sirve un email/links distintos a los locales**: con API up la UI muestra los del
  backend. No es un error, pero puede sorprender en el review.
