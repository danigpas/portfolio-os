# HANDOFF — T2 fixes (DAN-91)

Rama de trabajo: `feature/t2-fixes` · worktree: `portfolio-os/t2-fixes`
HEAD local: `f2d2395` (== `origin/feature/t2-frontend-fundacion`)

## Objetivo
Cerrar los 3 bloqueantes del review `CHANGES_REQUESTED` de DAN-91 (fundación frontend) sobre la rama `feature/t2-frontend-fundacion`, aplicando **solo** esos bloqueantes y verificando con `tsc` + `build` + SSR. Restricciones del encargo: no tocar `backend/`, no crear PR, no mergear a `develop`, y `push` **solo** a `feature/t2-frontend-fundacion`. Los 3 bloqueantes eran:
1. `education-section` leía de `t()`/`language-provider` en vez de `lib/cv-data.ts`.
2. Proyectos duplicados en 3 copias divergentes con enlaces muertos (`href="#"`).
3. `language-provider.tsx` con claves sin uso (código muerto residual).

## Estado actual
- **Completado y pusheado.** Los 3 bloqueantes están resueltos y publicados por fast-forward en `origin/feature/t2-frontend-fundacion` (`455ed7c..f2d2395`).
- Commits: `bb16047` `fix(t2): education y proyectos leen de cv-data con enlaces reales` y `f2d2395` `refactor(t2): elimina claves de traduccion sin uso en language-provider`.
- Verificación ejecutada y en verde: `npx tsc --noEmit` (0 errores), `npm run build` (verde, sin warnings, 7 rutas), `npm start` + `curl localhost:3000` (HTTP 200 con contenido SSR, 0 `href="#"` en proyectos).
- Comentario-resumen añadido a DAN-91. **Estado del ticket sin cambiar** (sigue "In Progress"), como pedía el encargo.
- `worker_done` enviado al coordinador (`succeeded`).
- Working tree limpio: `HANDOFF.md` es el único fichero nuevo y **no** está commiteado (creado a propósito por solicitud directa, sin commit/push).

## Decisiones tomadas (y por qué)
- **Mantener los títulos de sección en `t()`** (`about.title`, `experience.title`, `education.title`, `projects.title`, `contact.*`) y mover **solo los datos** a `cv-data`. Es el patrón ya usado por `about-section`/`experience-section`/`contact-section`; evita romper la cabecera i18n y reduce el riesgo.
- **Añadir campos de presentación al tipado de `cv-data`** (`EducationItem.tags`, `ProjectItem.image/featured/type/status`) en vez de dejar badges/tipos hardcodeados en los componentes. Así `cv-data` es literalmente la única fuente y ambos consumidores (escritorio + Postman) leen el mismo array.
- **URLs canónicas**: Portfolio OS → `url: https://danigpascual.dev` + `repo: https://github.com/danielgonzalezpascual`; El Nieto de Pascual → `url: https://elnietodepascual.com`; Retro NES → sin URL real. Regla aplicada: botón solo si hay URL real, si no se elimina (nunca dejar `#`). Se reutilizan URLs ya presentes en la rama (no se inventan).
- **`GET /projects` de Postman** pasa a mapear `cv.projects`; esto añade Portfolio OS (antes solo estaba en la landing) y elimina el JSON divergente con `url: "#"`.
- **Limpieza de `language-provider` verificada por script**, no a ojo: se cruzaron las claves definidas vs las referenciadas por `t(...)` sobre `app/`, `components/` y `lib/` → quedan 10 claves usadas, 0 huérfanas y 0 usadas-sin-definir.
- **Dos commits lógicos** (no uno por bloqueante) porque `lib/cv-data.ts` toca simultáneamente bloqueantes 1 y 2; separar por hunks era frágil. Se respetan los prefijos `fix(t2):` / `refactor(t2):`.

## Ficheros clave
- `lib/cv-data.ts` — fuente única ES/EN. Tipos `EducationItem`, `ProjectItem` ampliados; arrays `education` y `projects` reescritos. `getCvData(language)` es la puerta de entrada.
- `components/education-section.tsx` — reescrito a data-driven con mapa de presentación `EDUCATION_PRESENTATION` (icono/color/badge por `item.id`); badge de estado desde `item.status`.
- `components/projects-section.tsx` — itera `getCvData(language).projects`; botones condicionados a `project.url` / `project.repo`.
- `components/postman-app.tsx` — `GET /projects` mapea `cv.projects`.
- `components/language-provider.tsx` — reducido a las 10 claves usadas; solo titulación de secciones y contacto.
- Referencia de patrón (no modificados): `about-section.tsx`, `experience-section.tsx`, `contact-section.tsx` (ya leían de `cv-data`), `landing-page.tsx` (SSR consume `getCvData("es")`).

## Cambios sin commitear
- `HANDOFF.md` (este fichero) — intencionadamente sin commit ni push, por la solicitud directa.
- Nada más. El código de los 3 bloqueantes **ya está commiteado y pusheado**.

## Comandos de arranque/test
```sh
npm install --legacy-peer-deps      # pnpm está bloqueado en este entorno; usar npm
npx tsc --noEmit                     # debe dar 0 errores (strict: true)
npm run build                         # debe ser verde, sin warnings (~7 rutas)
npm start                             # servido en http://localhost:3000
curl -s localhost:3000 | grep -i "Inforyde"     # SSR confirma contenido
curl -s localhost:3000 | grep -i "En curso"     # confirma badge DAW desde cv-data
# Apagar el server (git-bash/Windows):
PID=$(netstat -ano | grep LISTENING | grep ':3000' | awk '{print $5}' | head -1)
taskkill //F //PID "$PID"
```

## Trampas y contexto no obvio
- **Entorno Windows + git-bash**: `2>/dev/null` dentro de `node child_process.execSync` falla; usa `fs` para walk/grep. El redirect de `npm start` a fichero funciona, pero hay que matar el proceso por PID con `taskkill //F`.
- `feature/t2-frontend-fundacion` es una **rama compartida con otro worktree** (aparece con `+` en `git branch`). No se hace checkout local de ella; el push se hace con refspec: `git push origin HEAD:feature/t2-frontend-fundacion` (es FF porque `feature/t2-fixes` nació de su tip).
- El **desktop es client-rendered**: `curl` no muestra `projects-section`/`education-section`. La validación de esos componentes es por `tsc` + `build`; `curl` solo verifica la landing SSR.
- `npm run lint` / `next lint` **no es ejecutable**: no hay `eslint` ni config (preexistente). No usarlo como gate.
- **`href="#"` fuera del alcance**: `testimonials.tsx` y `developer-mode.tsx` aún tienen `linkedinUrl: "#"` / `"url": "#"`. No son bloqueantes del encargo (hablan de proyectos) → dejarlos para T3/T4.
- **Lockfiles conviven**: `package-lock.json` (npm) y `pnpm-lock.yaml` se mantienen; pnpm bloqueado. `npm audit` reporta 3 vulnerabilidades (next@15.2.4/sharp) preexistentes en `develop`, no relacionadas con estos fixes.
- **i18n**: el selector de idioma persiste en `localStorage.language`; `getCvData` recibe `language` de `useLanguage()`. Los datos ES/EN viven en `cv-data`, no en `t()`.
- **No tocar** `backend/` (T1, otro builder). No abrir PR ni mergear a `develop`.

## Próximos 3 pasos
1. **Re-review de DAN-91**: pedir al reviewer que confirme el cierre de los 3 bloqueantes sobre `origin/feature/t2-frontend-fundacion@f2d2395` y, si procede, mover el ticket a review/done.
2. **Seguimiento no-bloqueante (T3/T4)**: crear ticket/hijo para lazy-load del desktop (`next/dynamic` de `DesktopSession`, la landing paga ~172 kB de First Load JS), limpiar los `#` residuales de testimonials/developer-mode, tokens de tema en `landing-page.tsx` + `prefers-reduced-motion`, y un solo lockfile.
3. **Poda de dependencias/scripts**: bump de `next` (CVE preexistente) en un `chore` aparte y decidir `npm run lint` (añadir eslint o quitar el script).
