# HANDOFF — portfolio-os

Worktree: `C:/Users/danig/orca/portfolio-os` (rama `main`)
Repo remoto: `https://github.com/danigpas/portfolio-os.git` (`origin`)
Fecha del handoff: 2026-10-22

---

## Objetivo

Portafolio personal "Portfolio OS" de Daniel González Pascual: una web con
estética **Omarchy** (moderno + cyberpunk + retro) que funciona como sistema
operativo ficticio (boot, waybar, ventanas reales, terminal, launcher Ctrl+K,
app tipo Postman) y que está respaldada por una **API FastAPI** como fuente de
datos del CV.

Dominios en juego:

- `danigpascual.dev` → frontend Next.js en Vercel (boot directo al escritorio).
- `cv.danigpascual.dev` → rewrite a `/cv` vía `middleware.ts` (CV en línea).
- `api.danigpascual.dev` → backend FastAPI (LXC en Proxmox + Docker Compose +
  Cloudflare Tunnel, guía en `backend/README.md`).

Hitos: T0–T5 del plan del harness de orquestación multi-agente (rediseño
completo del portfolio con backend Python).

---

## Estado actual

**Este worktree está obsoleto.**

- HEAD local: `d6e6fe0` — *"Merge branch 'release/0.1' into main"* (2025-10-04).
- `origin/main`: `8b0faae` — *"Merge pull request #19 from danigpas/feat/cv-pdf-publico"* (2026-10-08).
- `main` va **49 commits por detrás** de `origin/main` y puede ir directo con
  fast-forward. No hay nada sin pushear.
- El árbol de trabajo está **limpio** (sin staged, sin unstaged, sin stash).
- Consecuencia: en disco **faltan** `backend/`, `harness/`, `cv-latex/`,
  `middleware.ts`, `lib/api.ts`, `lib/cv-data.ts`, `window-manager.tsx`,
  `landing-page.tsx`, `scripts/smoke.mjs`, `package-lock.json` y el PDF público
  del CV. El `README.md` que se ve aquí es el viejo (habla de pnpm y v0).
- Tampoco hay `node_modules/` ni `.next/` instalados en este worktree.

**Estado real del proyecto (en `origin/main`):**

- T0–T5 completados, revisados y mergeados: PRs #2–#19 todas mergeadas, **0 PRs
  abiertas**, sin tickets pendientes del plan maestro.
- `origin/develop` y `origin/main` están **idénticos** (0 adelante / 0 atrás).
- Stack actual: Next `^15.5.27`, React 19, TS estricto, Tailwind v4, GSAP,
  Lucide. Backend: Python 3.11+, FastAPI, Pydantic v2, slowapi, pytest (~30
  tests verdes en el review de T1), ruff.
- Gestor de paquetes: **npm** (`pnpm-lock.yaml` fue eliminado en la PR #11;
  existe `package-lock.json`).
- 13 worktrees de Orca bajo `C:/Users/danig/orca/workspaces/portfolio-os/*`
  (devcheck, review-t1, review-t1-r2, t1-backend, t2-fixes, t2-frontend,
  t3-fixes, t3-omarchy, t4-fixes, t4-wm, t5-integracion, wreckfish): **todos con
  árbol limpio**; sus ramas ya están mergeadas en `main`, salvo duplicados
  (ver Trampas).

---

## Decisiones tomadas (y por qué)

1. **Flujo gitflow con PRs a `develop` y merge manual del usuario.** El
   orquestador nunca mergea; solo abre PR y adjunta el enlace al ticket Linear.
   Motivo: control humano sobre lo que entra en producción.
2. **Máximo 3 agentes simultáneos contando al orquestador** (2 slots de
   worker). Motivo: coste/estabilidad; se valida `launch.effective` del receipt
   antes de asumir que el modelo se aplicó.
3. **Datos centralizados y duplicados a propósito en dos fuentes:**
   `backend/app/data/cv.py` (API, ES/EN) y `lib/cv-data.ts` (frontend, ES/EN).
   Motivo: **offline-first** — si la API no responde en 3 s, el frontend degrada
   a datos locales y la web nunca queda en blanco (waybar `api:down`, badge
   `LOCAL` en la app Postman).
4. **Boot opcional / dual-mode** (landing SSR indexable + escritorio). Motivo:
   SEO y accesibilidad móvil sin sacrificar la experiencia "OS". `sessionStorage`
   (`omarchyVisited`) evita repetir el boot.
5. **CV en LaTeX (plantilla NIT Warangal) compilado en Overleaf**, subido como
   PDF público a `public/cv-daniel-gonzalez-pascual.pdf` y servido también por
   `GET /api/cv` con `Content-Disposition`. Motivo: PDF con formato profesional
   para reclutadores + ATS, un mismo fichero para web y descarga.
6. **Enrutar por dominio con `middleware.ts`** en lugar de app separada para el
   CV. Motivo: `cv.danigpascual.dev` comparte despliegue Vercel y `/cv` se puede
   embeber en la ventana "CV en línea" del escritorio (modo embebido sin boot).
7. **Upgrade Next 15.2.4 → 15.5.27** (CVE-2025-66478). Motivo: Vercel bloqueaba
   el deploy. También se borró `pnpm-lock.yaml` obsoleto porque el pipeline usa
   npm.
8. **Backend desplegado en casa (Proxmox LXC + Docker Compose + Cloudflare
   Tunnel)** siguiendo el patrón del proyecto PersonalOS. Motivo: reutilizar
   infraestructura propia, TLS sin nginx local, coste cero.
9. **`POST /api/contact` no envía email**: log estructurado + `202` con
   referencia y rate-limit por IP en memoria (5/min). Motivo: evitar secretos de
   SMTP en el repo; anti-spam suficiente para el tráfico real.
10. **Calidad con umbral bajo pero útil:** `eslint.ignoreDuringBuilds: true` e
    `images.unoptimized` en `next.config.mjs`; verificación real por
    `npm run build`, `tsc --noEmit`, `pytest` y `npm run smoke`.

---

## Ficheros clave

> Rutas relativas a la **raíz del repo en `origin/main`** (la mayoría no existen
> aún en el disco de este worktree hasta hacer fast-forward).

Frontend (Next.js App Router):

| Fichero | Rol |
|---|---|
| `app/page.tsx` | 10 líneas: decide landing vs escritorio |
| `app/layout.tsx`, `app/globals.css` | plantilla, fuentes, tokens CSS de temas |
| `app/cv/page.tsx` | CV en línea (`/cv`, también sirve `cv.danigpascual.dev`) |
| `app/robots.ts`, `app/sitemap.ts`, `app/icon.svg` | SEO |
| `middleware.ts` | rewrite por host (`cv.*` → `/cv`) |
| `components/landing-page.tsx` | landing SSR legible por crawlers |
| `components/system-entry.tsx`, `components/boot-animation.tsx` | entrada al sistema + boot TTY GSAP ~3 s |
| `components/desktop-session.tsx` | composición del escritorio |
| `components/ubuntu-desktop.tsx` (209 l.) | escritorio, iconos, dock |
| `components/window-manager.tsx` (826 l.) | ventanas arrastrables/redimensionables, z-index, Alt-Tab |
| `components/omarchy-waybar.tsx`, `omarchy-wallpaper.tsx` | barra superior (workspaces 1-5, reloj, red, `api:up/down`) |
| `components/rofi-launcher.tsx` | paleta Ctrl+K |
| `components/terminal.tsx` | navegación por comandos |
| `components/postman-app.tsx` | consome la API real, badge `API`/`LOCAL` |
| `components/portfolio-data-provider.tsx`, `components/theme-system.tsx` | datos + temas (Tokyo Night default, Gruvbox, Catppuccin, Matrix) |
| `lib/api.ts` (423 l.) | cliente tipado: timeout 3 s + fallback |
| `lib/cv-data.ts` (464 l.) | única fuente de datos del frontend (ES/EN) |
| `lib/omarchy-config.ts` | configuración del "sistema" |
| `scripts/smoke.mjs` | smoke E2E contra la API (`npm run smoke`) |
| `public/cv-daniel-gonzalez-pascual.pdf` | PDF público del CV |

Backend (`backend/`, autónomo, no toca el frontend):

| Fichero | Rol |
|---|---|
| `backend/app/main.py` | `create_app()` + instancia ASGI |
| `backend/app/data/cv.py` (501 l.) | **única fuente de verdad del CV (ES/EN)** |
| `backend/app/routers/*.py` | about, experience, education, projects, skills, contact, cv, health |
| `backend/app/core/config.py` | defaults de `ENVIRONMENT`, `LOG_LEVEL`, `CORS_ORIGINS`, `CONTACT_RATE_LIMIT`, `CV_PDF_PATH` |
| `backend/app/core/rate_limit.py`, `logging.py` | slowapi + log JSON |
| `backend/tests/` | pytest de todos los endpoints (fixture `tests/fixtures/sample.pdf`) |
| `backend/Dockerfile`, `docker-compose.yml` | despliegue en LXC (+ perfil `tunnel` para cloudflared) |

CV LaTeX: `cv-latex/main.tex`, `cv-latex/README.md` (compilar en Overleaf con pdfLaTeX), `cv-latex/cv-daniel-gonzalez-pascual.pdf`.

Documentación del proceso: `harness/README.md` (roles, flujo, gitflow),
`harness/plan.md` (T0–T5 con criterios de aceptación),
`harness/orchestrator.md` (protocolo, tablas de tickets DAN-88/90-94,
incidentes), `harness/builder-guide.md`, `harness/reviewer-guide.md`.

Otros: `README.md` (arquitetura + variables de entorno), `.env.example`,
`backend/.env.example`, `next.config.mjs`, `package.json`.

---

## Cambios sin commitear

**Ninguno.** `git status` en `main` (este worktree): *working tree clean*.

- Nada staged (`git diff --cached` vacío), nada unstaged (`git diff` vacío),
  ningún untracked (salvo este `HANDOFF.md` a partir de ahora).
- `git stash list` vacío.
- `git log @{u}..HEAD` vacío: **no hay commits locales sin pushear**. El único
  desfase es en sentido contrario: 49 commits por descargar.
- Los 13 worktrees de Orca también están limpios (verificado uno a uno).

---

## Comandos de arranque/test

Sincronizar primero este worktree (está 49 commits atrás):

```bash
cd C:/Users/danig/orca/portfolio-os
git fetch origin
git merge --ff-only origin/main     # o: git rebase origin/main si prefieres
```

Frontend (Node 18+ y npm; **no** pnpm):

```bash
npm install --legacy-peer-deps
cp .env.example .env.local           # NEXT_PUBLIC_API_URL (default http://localhost:8000)
npm run dev                          # http://localhost:3000
npm run build
npm run lint
npx tsc --noEmit
npm run smoke                        # smoke de integración (backend tiene que estar arriba)
npm run start                        # servidor de producción
```

Backend (Python 3.11+):

```bash
cd backend
python -m venv .venv
source .venv/Scripts/activate        # git-bash en Windows (PowerShell: .venv\Scripts\Activate.ps1)
pip install -e ".[dev]"
cp .env.example .env                 # opcional: CORS_ORIGINS, CONTACT_RATE_LIMIT, CV_PDF_PATH
uvicorn app.main:app --reload --host 0.000.0 --port 8000
curl http://localhost:8000/api/health
pytest -q
ruff check . && ruff format --check .
```

Sin Python en el host (esta máquina no tiene Python instalado) — montar la raíz
del repo para que `/api/cv` encuentre el PDF:

```bash
docker run --rm -p 8000:8000 -v "$(pwd):/repo" -w /repo/backend python:3.12 \
  sh -c "pip install -q -e . && uvicorn app.main:app --host 0.0.0.0 --port 8000"

# solo tests
docker run --rm -v "$(pwd)/backend:/app" -w /app python:3.12 \
  sh -c "pip install -q -e . && pytest -q"
```

Flujo E2E manual esperado: `npm run dev` + backend arriba → "Bootear el sistema"
(o ESC para saltar) → waybar `api:up` → Postman `GET /about` con badge `API` →
`POST /contact` devuelve `202` con referencia → con el backend parado la web
sigue funcionando con badge `LOCAL` y aviso `api:down`.

Verificación remota (usa `gh`, autenticado en este equipo):

```bash
gh pr list --repo danigpas/portfolio-os --state open
git log --oneline origin/main -5
```

---

## Trampas y contexto no obvio

1. **El worktree principal está 49 commits atrás.** Si trabajas aquí sin
   `git fetch && git merge --ff-only origin/main`, no verás `backend/`,
   `harness/`, `middleware.ts` ni `lib/api.ts` y romperás cosas al "arreglarlas".
   El `README.md` visible es el viejo (recomienda pnpm: ya no es cierto).
2. **npm, no pnpm.** `pnpm-lock.yaml` se borró en la PR #11 porque Vercel usa
   `package-lock.json`. La instalación requiere `--legacy-peer-deps`.
3. **`next.config.mjs` ignora ESLint en el build** (`ignoreDuringBuilds`): un
   `npm run build` verde no significa lint limpio. Y `images.unoptimized: true`
   (elegido para Vercel/compatibilidad).
4. **Limpieza de código muerto incompleta en T2.** En `origin/main` siguen
   vivos y **alcanzables de forma transitiva** vía `components/postman-app.tsx`
   → `analytics-dashboard` (257 l.), `api-metrics`, `availability-calendar`
   (372 l.), `case-studies`, `certifications`, `testimonials`, `technical-blog`
   (364 l.), más `enhanced-animations`, `loading-states`, `pwa-installer`,
   `presentation-mode`, `developer-mode` y las secciones `about/experience/
   education/projects/contact`. Solo quedaron huérfanos de verdad:
   `hero-section`, `navbar`, `footer`, `hover-effects`, `malaga-decorations`,
   `scroll-animations`. Peso en bundle real; no asumir que "ya se limpió".
5. **Dos duplicados que parecen pendientes y no lo están:**
   - `feat/cv-latex` → `38c31f2` ya está en `main` como `bd3cd54`
     (`git cherry` = `-`); solo difiere en 1 línea del `README.md`.
   - `chore/harness-docs` → `0b97ad2` **NO** está aplicado en `main`
     (`git cherry` = `+`) y **es peligroso mergearlo**: parte de un árbol viejo
     (reintroduce `pnpm-lock.yaml`, `hooks/use-toast.ts`, `styles/globals.css`,
     borra `cv-latex/`, `lib/api.ts`, `middleware.ts`, etc.). No fusionar esa
     rama ni ese worktree (`wreckfish`).
6. **Fechas "del futuro"**: los commits de 2026 son reales en este repo (reloj
   del sistema / narrativa del CV: "Inforyde, mar 2026 – actualidad"). No usar
   `git log --since` con 2025 como referencia de actividad reciente.
7. **Python no está instalado en esta máquina** (`python` solo abre el alias de
   Microsoft Store). Para tests/smoke del backend usa Docker.
8. **El rate-limit de `/api/contact` es en memoria por IP**: no vale con varias
   réplicas (haría falta Redis) y detrás del túnel/Cloudflare la IP de origen
   puede no ser la real del visitante.
9. **`POST /api/contact` no envía correos.** Solo log + `202`; el fallback del
   frontend muestra el email directo. Si alguien espera "el formulario manda
   mail", no es un bug, es la decisión tomada.
10. **Enrutado por host depende de `middleware.ts`** con un `matcher` que excluye
    `_next/`, `api/`, `favicon.ico` y el PDF del CV. Añadir un subdominio nuevo
    (p. ej. `api.`) requiere también DNS/Cloudflare y CORS en el backend; el
    rewrite `cv.*` → `/cv` no se ve en el árbol si solo miras `app/`.
11. **El boot se controla con `sessionStorage`** (`omarchyVisited`): en tests o
    capturas, limpia el sessionStorage para ver el boot; sin eso, va directo al
    escritorio.
12. **Orquestación Linear**: proyecto **PorfoliOS** (team DAN,
    `60f41296-6425-45a6-bc08-1edece7b7911`), run del harness
    `run_7739df1b79d3`, terminal coordinadora `term_47cc42f0-47fa-4736-ba39-952bac1e6c94`.
    Los tickets DAN-88 y DAN-90–DAN-94 están Done. Incidentes ya vistos (útiles
    si se relanza el harness): 2 reviewers cerraron turno sin `worker_done`
    (recuperados con re-dispatch); un flag `--model` no soportado por `pi`
    (se resolvió alternando `defaultModel` en `settings.json` con backup/restore).
13. **Secretos**: no hay ninguno en el repo. Todo el config sensible va por
    entorno (`NEXT_PUBLIC_API_URL` en Vercel; `CORS_ORIGINS`,
    `CONTACT_RATE_LIMIT`, `CV_PDF_PATH` y el token de Cloudflare Tunnel en
    `backend/.env`, que está gitignoreado). No commitear `.env*` ni tokens.

---

## Próximos 3 pasos

1. **Poner al día este worktree y verificar que todo compila aquí.**
   `git fetch origin && git merge --ff-only origin/main`, luego
   `npm install --legacy-peer-deps`, `npx tsc --noEmit` y `npm run build`.
   Confirmar que `origin/main` (PR #19) despliega limpio en Vercel y que
   `danigpascual.dev`, `cv.danigpascual.dev` y `https://danigpascual.dev/cv-daniel-gonzalez-pascual.pdf`
   responden como se espera. *(Nota: esto no debe hacerse en el mismo turno que
   este handoff si la consigna es no tocar el repo.)*

2. **Cerrar el bucle de integración real backend↔frontend.**
   Levantar la API (Docker, si no hay Python) y pasar `npm run smoke` +
   el flujo E2E manual (`api:up` / badge `API` / `202` en contacto / degradación
   a `LOCAL`). Comprobar en Vercel que `NEXT_PUBLIC_API_URL` apunta al backend
   desplegado y que `api.danigpascual.dev/api/health` responde; si el LXC o el
   túnel todavía no están montados, decidir entre desplegarlo o dejar el sitio
   en modo offline-first de forma explícita.

3. **Higiene del repo y del harness.** Podar las 12 ramas de feature/fix ya
   mergeadas y sus worktrees (empezando por `wreckfish`/`chore/harness-docs`,
   que no debe fusionarse), actualizar `harness/plan.md` y `harness/orchestrator.md`
   con el estado final (hoy dicen "última actualización: creación del harness"),
   y abrir un ticket nuevo para la **desconexión real de los componentes legacy**
   del paso 4 de Trampas (`postman-app` → `analytics-dashboard`,
   `availability-calendar`, `technical-blog`, etc.) o para justificarlos como
   apps del escritorio.
