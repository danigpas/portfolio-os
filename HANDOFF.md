# HANDOFF — portfolio-os

Actualizado: 2026-10-08. Worktree: `C:/Users/danig/orca/workspaces/portfolio-os/wreckfish` (rama `chore/harness-docs`).

## Objetivo

Portfolio web de Daniel González Pascual (`danigpascual.dev`) rediseñado en estilo **Omarchy**
(escritorio Linux funcional en el navegador: boot, waybar, ventanas, rofi, terminal, temas), con
backend **FastAPI** en Python, orquestado con un **harness multi-agente Orca** (builders
deepseek-v4-flash · medium, reviewer mimo-v2.6-flash · medium, máx. 3 agentes simultáneos),
documentado en **Linear** (proyecto PorfoliOS) y con **gitflow** (feature branches → PRs; solo el
usuario aprueba/mergea). Fases de despliegue: frontend en Vercel, backend en un CT LXC de Proxmox
vía Docker + Cloudflare Tunnel.

## Estado actual

- **Producción operativa**:
  - Frontend: `https://danigpascual.dev` (Vercel, proyecto `api-app-portfolio` del usuario) — boot
    directo al escritorio en desktop; `/cv` sirve la página CV; `cv.danigpascual.dev` → rewrite del
    middleware a `/cv`.
  - Backend: `https://api.danigpascual.dev` (FastAPI en CT LXC `192.168.1.205`, contenedor
    `portfolio-api` healthy, expuesto por Cloudflare Tunnel systemd).
  - CV PDF: `public/cv-daniel-gonzalez-pascual.pdf` = versión LaTeX nueva (1 página, verificado
    también en `/api/cv` tras rebuild del contenedor).
- **Tickets Linear DAN-88 a DAN-96: todos Done.** PRs #2–#19: mergeadas salvo la **#17**
  (sandbox del iframe — verificar si el usuario la mergeó; si no, sigue abierta).
- **Harness**: `harness/` documentado (README, plan, orchestrator, builder/reviewer guides).
- **Aparcado**: repo `danigpas/portfolio-cv` (web-CV estilo amble.fyi, PR #1 abierta) — el usuario
  decidió no usarla de momento.

## Decisiones tomadas (y por qué)

- **Boot siempre visible** (eliminado `sessionStorage.omarchyVisited`): el usuario quiere la
  animación de arranque en cada entrada; skipeable con ESC.
- **danigpascual.dev → boot directo al escritorio; CV solo en `/cv` + `cv.danigpascual.dev`**:
  antes la landing-CV era la puerta de entrada y el botón «CV en línea» parecía abrir "otra vez el
  portfolio". Ahora `middleware.ts` enruta por host y la página CV no tiene boot (CTA «Ver
  escritorio interactivo»).
- **`data/cv.ts` / `lib/cv-data.ts` como única fuente de contenido**: prohibido hardcodear datos en
  componentes; los builders no inventan contenido.
- **Tokens CSS (`--omarchy-*`, `--paper/ink/moss`) obligatorios**: 0 hex fuera de globals.css
  (verificado por grep en reviews).
- **CV en LaTeX**: recreación fiel de la plantilla NIT Warangal de Overleaf en `cv-latex/main.tex`
  (no se pudo descargar el source original anónimamente); compilado y verificado en Docker
  (`aergus/latex`), 1 página.
- **El backend cocina el PDF en la imagen Docker** (`COPY public/cv-...pdf`): al actualizar el CV
  hay que rebuild del contenedor en el CT, no basta con el deploy de Vercel.
- **Python no existe en el host Windows**: toda validación de backend va por Docker
  (`python:3.12` / `aergus/latex`).
- **`npm install --legacy-peer-deps`**: pnpm bloqueado por Device Guard del sistema.
- **Fix del deploy Vercel**: `next` 15.2.4 → **15.5.27** (CVE-2025-66478 bloqueaba
  "Deploying outputs...").
- **IP del CT por DHCP (`.205`)**: puede cambiar; pendiente reserva DHCP si se quiere fija.

## Ficheros clave

| Ruta | Qué es |
|---|---|
| `app/page.tsx` | Raíz: `SystemEntry` (boot directo) + `LandingPage` children (SSR/SEO/móvil) |
| `app/cv/page.tsx` | Página CV en línea (metadata propia, `title.absolute`) |
| `middleware.ts` | `cv.danigpascual.dev` → rewrite a `/cv` |
| `components/system-entry.tsx` | Máquina de estados landing/boot/desktop (auto-boot, sin sessionStorage) |
| `components/enter-system-button.tsx` | CTA de la página CV: enlace a `/` (`target=_top` si iframe); nota en móvil |
| `components/ubuntu-desktop.tsx` | Iconos de utilidad: columna izquierda centrada, 56px |
| `components/cv-web-window.tsx` | Ventana «CV en línea»: iframe a `CV_WEB_URL` con sandbox |
| `components/landing-page.tsx` | Landing/CV SSR (hero, experiencia, proyectos, educación, contacto) |
| `lib/cv-data.ts` | Única fuente de contenido del portfolio |
| `lib/omarchy-config.ts` | `CV_WEB_URL = https://cv.danigpascual.dev`, APP_NAMES |
| `lib/api.ts` | Cliente backend (timeout 3s, fallback offline-first, `downloadCv` → API → estático) |
| `cv-latex/main.tex` | Fuente LaTeX del CV (estilo NIT Warangal) |
| `backend/` | FastAPI (routers: health, experience, education, skills, projects, about, contact, cv) |
| `harness/` | Documentación del orquestador/builder/reviewer |

## Cambios sin commitear

Ninguno en este worktree (`wreckfish`, rama `chore/harness-docs`, limpia). El trabajo de las
últimas sesiones se hizo en el worktree `C:/Users/danig/orca/workspaces/portfolio-os/devcheck` y
está todo pushado/mergeado en `origin/main` (`8b0faae` = merge PR #19).

## Comandos de arranque/test

```bash
# Frontend (en el worktree de trabajo, p.ej. .../portfolio-os/devcheck)
npm install --legacy-peer-deps
npm run dev            # http://localhost:3000
npx tsc --noEmit       # tipos
npm run build          # build de producción (esperar 8/8 páginas estáticas)

# Backend (sin Python en host: usar Docker)
docker run --rm -v "//c/.../portfolio-os/devcheck/backend:/work" -w /work python:3.12 \
  sh -c "pip install -e '.[dev]' && pytest -q"   # 30 tests

# Desplegar backend en el CT (SSH con clave instalada, sin contraseña)
ssh root@192.168.1.205
cd /opt/portfolio-os && git pull && cd backend && docker compose up -d --build

# Compilar el CV LaTeX
docker run --rm -v "//c/.../cv-latex:/doc" aergus/latex \
  sh -c "cd /doc && pdflatex main.tex && pdflatex main.tex"
```

## Trampas y contexto no obvio

- **`downloadCv` (lib/api.ts) intenta primero `api.danigpascual.dev/api/cv`**: si el contenedor del
  CT no está rebuildado tras cambiar el PDF, el escritorio descarga el CV viejo (causa raíz del
  último bug reportado). El enlace de la landing usa el estático — por eso "un botón sí, otro no".
- **Sandbox del iframe del CV**: necesita `allow-downloads` y
  `allow-top-navigation-by-user-activation`; sin ellos los botones dentro de la ventana fallan en
  silencio (fix en PR #17).
- **Vercel Deployment Protection** en el proyecto `api-app-portfolio`: desactivada por el usuario;
  si se reactiva, el iframe mostrará "Log in to Vercel".
- **El proyecto Vercel `api-app-portfolio` ES el que despliega `danigpascual.dev`** (no es un
  proyecto aparte del CV).
- **Orca**: a veces requiere `export PATH="$PATH:/c/Users/danig/AppData/Local/Programs/orca/resources/bin"`.
- **Linear**: workspace `811255d0-81f0-4d23-bb15-0405d376752a`, team DAN, proyecto PorfoliOS
  `60f41296-6425-45a6-bc08-1edece7b7911`; a veces hay que `sleep` tras escribir un estado antes de
  releerlo.
- **pi no soporta `--model` por worker**: se alterna `defaultModel` en
  `~/.pi/agent/settings.json` (backups `settings.json.bak-harness*`), con ~30s de margen.
- **El host parte líneas largas** en la consola Proxmox del usuario: darle scripts `.sh` cortos, no
  bloques de comandos largos.
- **Commits**: convención `feat(t<n>):` / `fix(<ambito>):`. Las últimas PRs de fixes fueron
  directas a `main` (acordado); para features, volver a develop primero.
- **`pnpm-lock.yaml` eliminado** del repo (obsoleto, PR #11).

## Próximos 3 pasos

1. **Confirmar estado de la PR #17** (sandbox iframe + `download`/`target=_blank` en «Descargar
   CV» + título absoluto `/cv`): si sigue abierta, que el usuario la mergee y verificar en
   producción que los dos botones funcionan dentro de la ventana «CV en línea».
2. **Automatizar el rebuild del backend en el CT** (runner self-hosted de GitHub Actions ya
   disponible en el LXC): que un push a `main` con cambios en `public/*.pdf` o `backend/` ejecute
   `docker compose up -d --build` — evita el bug del "CV viejo" en el futuro.
3. **Retomar o cerrar la web-CV amble.fyi** (`danigpas/portfolio-cv`, PR #1 abierta): decidir si se
   despliega (Vercel/CT con `cv.danigpascual.dev`), se integra como `/cv` del portfolio, o se
   aparca definitivamente; y opcionalmente reservar IP estática del CT (`.201`) en el router.
