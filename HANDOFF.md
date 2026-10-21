# HANDOFF — T2: Fundación frontend

Worktree: `Orca/workspaces/portfolio-os/t2-frontend`
Rama: `feature/t2-frontend-fundacion` (basada en `origin/develop`, ya pusheada a `origin`)
Ticket: Linear **DAN-91** · Proyecto *PorfoliOS*

---

## Objetivo

Dejar el frontend del portfolio listo para el rediseño Omarchy (T3/T4):

1. Eliminar código muerto (componentes y primitivas `components/ui/*` sin uso real) y las dependencias que sólo usaban esos ficheros.
2. Crear `lib/cv-data.ts` como **única fuente de datos tipada ES/EN** del frontend.
3. Convertir `/` en una **landing SSR legible por SEO** con modo dual: botón "Bootea el sistema" que entra al escritorio Omarchy, con boot **sólo la primera vez de la sesión** (`sessionStorage.omarchyVisited`) y sin el boot forzado de 6 s.
4. SEO completo (metadata, OG, twitter, favicon, `sitemap.ts`, `robots.ts`) y fallback móvil lineal (escritorio reservado a ≥768 px).
5. **No** rediseñar el escritorio (eso es T3/T4) y **no** tocar `backend/` (eso es T1, otro builder).

## Estado actual

**Completado y verificado.** Working tree limpio, todo commiteado y pusheado. Sin PR creada y sin merge (lo hace el orquestador tras el review).

Commits (de más antiguo a más nuevo):

| SHA | Tipo | Contenido |
| --- | --- | --- |
| `3cc334f` | `refactor(t2)` | 56 ficheros muertos borrados (~6.310 líneas) + poda de `package.json` + `package-lock.json` + quita `typescript.ignoreBuildErrors` en `next.config.mjs` |
| `d2133be` | `feat(t2)` | `lib/cv-data.ts` + componentes vivos leyendo de ahí |
| `6a5938c` | `feat(t2)` | landing SSR, dual-mode/boot, metadata, `sitemap.ts`, `robots.ts`, `app/icon.svg`, CV PDF |
| `455ed7c` | `fix(t2)` | `public/sw.js` pasa a network-first para documentos |

Resultado sobre `origin/develop`: **81 ficheros cambiados, +3.784 / −6.809**.

Verificaciones en verde:

- `npx tsc --noEmit` → 0 errores.
- `npm run build` → sin warnings; `/`, `/robots.txt`, `/sitemap.xml`, `/icon.svg` prerenderizados (static).
- `curl -s localhost:3000` → 200 con contenido SSR visible (`Inforyde`, `DisOfic`, `Semi-Senior`, `Bootea el sistema`, enlace al CV).
- Comentarios publicados en DAN-91: inicio (con modelo), checkpoint y final. El estado del ticket **no** se movió.

## Decisiones tomadas (y por qué)

- **No se borraron las secciones que listaba el ticket** (`about-section`, `experience-section`, `education-section`, `projects-section`, `contact-section`, `testimonials`, `case-studies`, `certifications`, `analytics-dashboard`, `availability-calendar`, `pwa-installer`, `loading-states`, `api-metrics`). Tienen **uso real**: las importa `postman-app`, que es la ventana principal del escritorio. Borrarlas rompería el build y contradice "mantén el desktop funcionando". El propio ticket pide "verificar imports desde `app/page.tsx`", así que se aplicó el criterio de alcanzabilidad real, no la lista nominal.
- **Criterio de borrado = cerradura transitiva de imports** desde `app/page.tsx` + `app/layout.tsx` (script temporal de resolución de `@/*`). Se borró lo genuinamente inalcanzable, incluidas primitivas `components/ui/*` y sus dependencias huérfanas. Total: 6.310 líneas, por encima del "≈3.000" estimado.
- **Poda de dependencias por grep real**, no por la lista del ticket: se quitaron además `cmdk`, `next-themes`, `sonner`, `geist`, `autoprefixer`, `tailwindcss-animate` y los `@radix-ui/*` sin uso. Se conservan `@radix-ui/react-dropdown-menu` y `@radix-ui/react-slot` (los usan `ui/dropdown-menu` y `ui/button|badge`).
- **Landing = Server Component; entrada al sistema = Client Component con contexto.** `app/page.tsx` renderiza `<SystemEntry><LandingPage /></SystemEntry>`. `SystemEntry` (client) decide landing/boot/escritorio y expone `useSystemEntry()`; así el HTML estático conserva todo el contenido para SEO y el botón vive dentro de la landing.
- **Landing en ES fijo.** SSR con `cvData.es`; el conmutador ES/EN del escritorio (`LanguageProvider`, `localStorage`) sigue igual. Motivo: evitar hydration mismatch y garantizar contenido indexable. `cv-data` ya contiene EN para T3/T5.
- **Boot saltable y acortado a ~2,5 s** (ESC/Enter/Espacio/click). La animación a fondo (GSAP, waybar, temas) es T3; aquí sólo se quitó el bloqueo de 6 s.
- **Móvil:** escritorio sólo en ≥768 px con aviso; la propia landing es la "versión lineal navegable" (nav por anclas + scroll). Detección con `hooks/use-mobile.ts` (se conservó a propósito: `components/ui/use-mobile.tsx` duplicado sí se borró).
- **`public/cv-daniel-gonzalez-pascual.pdf` copiado de `origin/feature/t0-cv-experiencia-fixes`** porque `origin/develop` **no** incluye T0 y el botón de descarga daría 404. Es el mismo blob, así que no debería generar conflicto al mergeear T0.
- **`app/globals.css` y los componentes del desktop se dejaron sin rediseñar** (nada de tokens `--omarchy-*`): es trabajo de T3.

## Ficheros clave

Nuevos:

- `lib/cv-data.ts` — fuente única de datos. Tipos: `CVData`, `ExperienceItem`, `EducationItem`, `ProjectItem`, `SkillGroup`, `ContactInfo`, `AboutInfo`. Acceso: `getCvData(language)` y `cvData: Record<Language, CVData>`, `DEFAULT_LANGUAGE = "es"`.
- `components/landing-page.tsx` — landing SSR (Server Component). Hero + 3 bullets + experiencia + proyectos + educación + skills + contacto + footer.
- `components/system-entry.tsx` — client, máquina de estados `landing | boot | desktop`, contexto `useSystemEntry()`, clave `omarchyVisited`, renderiza `PWAServiceWorker`.
- `components/enter-system-button.tsx` — client, botón "Bootea el sistema" / aviso móvil (`useIsMobile`).
- `components/desktop-session.tsx` — client, extrae todo el estado y JSX del antiguo `app/page.tsx` (Postman, terminal, suspend, shutdown).
- `app/sitemap.ts`, `app/robots.ts`, `app/icon.svg` — SEO.
- `package-lock.json` — generado con npm (pnpm está bloqueado en este entorno).

Modificados: `app/page.tsx` (ahora Server Component), `app/layout.tsx` (metadata/OG/twitter/canonical/`viewport`, sale `generator` y el `<link rel="icon" href="/favicon.ico">` roto), `components/postman-app.tsx` (endpoint data desde `cv-data`), `components/terminal.tsx` (comandos `about|skills|experience|projects|education|contact` desde `cv-data` y fix de tipado `Record<string, () => string>`), `components/about-section.tsx`, `components/experience-section.tsx`, `components/contact-section.tsx`, `components/language-provider.tsx` (claves Inforyde, "3+ años", periodo DisOfic, `about.stat.*`), `components/presentation-mode.tsx`, `components/developer-mode.tsx`, `components/boot-animation.tsx`, `components/ubuntu-desktop.tsx` (fix `item.action`), `next.config.mjs`, `package.json`, `public/sw.js`.

## Cambios sin commitear

**Ninguno** en la rama: `git status` limpio y `feature/t2-frontend-fundacion` está en sincronía con su upstream `origin/feature/t2-frontend-fundacion`.

El único fichero sin commitear es **este `HANDOFF.md`** (creado por petición directa del usuario, deliberately fuera de los commits de DAN-91).

Artefactos locales ignorados por git: `node_modules/`, `.next/`, `tsconfig.tsbuildinfo`, `next-env.d.ts`.

## Comandos de arranque/test

pnpm está **bloqueado por política del sistema** en esta máquina: usar npm con `--legacy-peer-deps`.

```sh
git checkout feature/t2-frontend-fundacion
npm install --legacy-peer-deps

npx tsc --noEmit      # debe salir limpio
npm run build         # debe salir verde y SIN warnings
npm start             # http://localhost:3000 (producción)
# npm run dev         # para desarrollo

# Prueba SSR (la acceptance real):
curl -s http://localhost:3000 | grep -i "Inforyde"
curl -s http://localhost:3000 | grep -io "bootea el sistema"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/robots.txt      # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/sitemap.xml     # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/icon.svg        # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/cv-daniel-gonzalez-pascual.pdf  # 200
```

Manually: `/` → landing legible → click **Bootea el sistema** → boot ~2,5 s (saltable con ESC) → escritorio. Recargar en la misma pestaña → entra **directo** al escritorio. Para repetir el boot: abrir pestaña nueva o `sessionStorage.removeItem("omarchyVisited")`. Conmutar idioma ES/EN desde el escritorio sigue funcionando.

Windows + git-bash: matar el servidor en el puerto 3000 con
`powershell.exe -Command "Get-NetTCPConnection -LocalPort 3000 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }"`.

## Trampas y contexto no obvio

- **`origin/develop` NO incluye T0** (`fix(t0)` `194c3c5` vive sólo en `feature/t0-cv-experiencia-fixes`). Esta rama arranca de `develop` por orden del ticket, así que T0 está **duplicado en parte** aquí: los datos de experiencia (Inforyde, fechas, "3+ años") y el PDF del CV. Al mergeear T0 y T2 a `develop` puede haber conflicto en `components/language-provider.tsx`, `components/postman-app.tsx`, `components/terminal.tsx` y `components/ubuntu-desktop.tsx`. El PDF es el mismo blob (sin conflicto).
- **Los componentes que el ticket mandaba borrar están vivos.** Si un reviewer insiste en la lista nominal, hay que rediseñar `postman-app` (trabajo de T4), no borrar a ciegas.
- **`lib/cv-data.ts` no es la fuente de verdad del backend.** T1 tiene `backend/app/data/cv.py`; la integración front↔back es T5. Ahora mismo los datos pueden divergir entre ambos.
- **El email de contacto (`cv-data.ts` → `contact.email`) es una suposición**: se tomó del autor de los commits de git porque el repo sólo tenía el placeholder `daniel@example.com`. **Confirmar con Daniel** el email real antes de producción.
- **`metadataBase` está hardcodeado a `https://danigpascual.dev`** en `app/layout.tsx`, `app/sitemap.ts` y `app/robots.ts` (3 sitios). Cambiar dominio = tocar los tres.
- **OG image usa `/daniel-gonzalez-pascual-portrait.png` (1024×1024)**, no un 1200×630 dedicado. Queda pendiente una imagen OG propia.
- **Imagen de pantalla de `/` duplicada en memoria**: `SystemEntry` recibe la landing como `children`, así que en modo escritorio el RSC payload sigue incluyendo la landing. Es intencional (SEO) pero añade peso a la ruta; no es un bug.
- **Flash landing→escritorio en visitas repetidas**: `sessionStorage` no es legible en el servidor, por eso el cambio a escritorio ocurre tras la hidratación. Consecuencia inevitable de "SSR + dual-mode".
- **`public/manifest.json` sigue con `themeColor` naranja `#f97316`** mientras el `viewport` de Next usa `#0b0b0c`. Se dejó a propósito (no rediseñar el tema = T3), pero es incoherente.
- **`next.config.mjs` conserva `eslint.ignoreDuringBuilds: true`** y no hay config de ESLint: `npm run lint` no es útil aquí. Sí se activó la validación de tipos en el build.
- **El build pesa ~176 kB First Load JS en `/`** por el bundle del escritorio que viaja con la ruta (T5/T4 podrían separarlo con `next/dynamic`).
- **`pnpm-lock.yaml` queda obsoleto** (enumera dependencias ya eliminadas). No se pudo regenerar con pnpm. Decidir si se borra al mergeear.
- **No tocar `backend/`**: es de T1, en otro worktree (`t1-backend`) en paralelo.
- **El harness y el plan maestro no están en esta rama**: `harness/builder-guide.md` y `harness/plan.md` viven en el worktree `../wreckfish`.

## Próximos 3 pasos

1. **Review del coordinador** sobre `feature/t2-frontend-fundacion`: validar la decisión de mantener vivas las secciones del escritorio, confirmar el **email de contacto real** y si conviene borrar `pnpm-lock.yaml` / duplicar o no el PDF de T0. No crear PR ni mergeear (lo hace el orquestador).
2. **Coordinar el merge a `develop` con T0 y T1** resolviendo los conflictos en `language-provider.tsx`, `postman-app.tsx`, `terminal.tsx` y `ubuntu-desktop.tsx`, y acordando que `lib/cv-data.ts` (front) y `backend/app/data/cv.py` (back) deben quedar sincronizados para T5.
3. **Lanzar T3 sobre esta base** (temas Omarchy + tokens `--omarchy-*`, JetBrains Mono como tipografía base, boot ~3 s con GSAP y skip, waybar, wallpaper): el hook ya existe (`components/system-entry.tsx` + `omarchyVisited`) y la landing ya consume `lib/cv-data.ts`; T4 sustituirá `desktop-session.tsx` por el window manager real con Ctrl+K.
