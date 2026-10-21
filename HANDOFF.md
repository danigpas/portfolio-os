# HANDOFF.md — T3 fixes (DAN-92)

## Objetivo
Corregir los 3 bloqueantes del review de DAN-92 en la rama Omarchy: eliminar los
colores hardcodeados residuales (naranja y blanco) sustituyéndolos por los tokens
`--omarchy-*`, de modo que ningún tema (Tokyo Night, Gruvbox, Catppuccin, Matrix)
pinte candados blancos ni acentos naranja. Todo bajo el paraguas del ticket
DAN-92 ("Nada de naranja por defecto ni colores hardcodeados").

## Estado actual
- Rama local: `feature/t3-fixes` (creada desde `origin/feature/t3-omarchy-tema-boot`).
- Commit aplicado: `d09a901` `fix(t3): elimina naranja y blanco hardcodeados residuales` (12 ficheros, +78 / −130).
- Push fast-forward hecho: `origin/feature/t3-omarchy-tema-boot` pasó de `a72063c` → `d09a901`.
- Verificación en verde: `npx tsc --noEmit` = 0 errores; `npm run build` = verde 7/7 sin warnings;
  `grep -rn "orange-\|bg-white" components/` = 0 resultados.
- 1 comentario publicado en DAN-92 (resumen archivo:línea + verificación). El estado del
  ticket **no** se cambió (sigue "In Review").
- No hay PR creado ni merge a `develop` (por diseño de la tarea).
- Working tree limpio en este worktree.

## Decisiones tomadas (y por qué)
- **Tokens arbitrarios de Tailwind v4 (`text-[var(--omarchy-accent)]`, `bg-[var(--omarchy-bg)]/80`,
  `border-[var(--omarchy-border)]`) en vez de clases semánticas (`text-primary`, `bg-card`…).**
  Es la convención que ya usaba la propia rama T3 (ver `boot-animation.tsx`, `omarchy-waybar.tsx`)
  y la que pedía explícitamente la tarea; mantiene coherencia con el resto del escritorio.
- **Tints de "fondo claro" (`bg-orange-100/50`) → `bg-[var(--omarchy-accent)]/10` o `/15`.**
  Tailwind v4 los compila a `color-mix(in oklab, var(--omarchy-accent) N%, transparent)`, que
  funciona con cualquier tema sin crear un token nuevo por variante.
- **`text-white` sobre superficies de acento → `text-[var(--omarchy-bg)]`** (contraste correcto
  en los 4 temas); **`text-white`/`bg-white/xx` del overlay oscuro de presentación → `--omarchy-fg`**.
- **Ampliación de alcance a `technical-blog.tsx`, `testimonials.tsx` y `pwa-installer.tsx`.**
  El review sólo listaba 6 ficheros en el B3, pero los tres anteriores también tienen naranja
  real (no mock), se importan desde `postman-app.tsx` y eran alcanzables. Los arreglé porque el
  criterio de aceptación de la tarea era "grep → 0 residuos", no sólo los ficheros enumerados.
  Quedan documentados en el comentario de DAN-92.
- **`enhanced-animations.tsx`: se BORRAN `PulsingDot`, `WaveAnimation` y `RotatingBorder`.**
  Grep de imports = 0 (sólo `CountUpAnimation` y `ProgressBar` se consumen desde
  `analytics-dashboard.tsx`). Al borrar `RotatingBorder` desaparece también su `bg-white` (el
  menor del review). Esto es una eliminación de API pública del fichero: ver "Trampas".
- **No se tocó:** `backend/`, `landing-page.tsx` (follow-up T2), `theme-system.tsx`,
  `boot-animation.tsx`, `omarchy-waybar.tsx`, `omarchy-wallpaper.tsx`, ni el mock
  `postman-app.tsx:193` (`themeColor: "#f97316"`, dato JSON, no UI).
- **No se limpiaron los otros duros no-naranja** (`blue-500`, `green-500`, `purple-500`, `gray-*`
  de tarjetas, `bg-gray-200` de `enhanced-animations.tsx:119`, `text-gray-*` de textos): quedan
  fuera del alcance de estos 3 bloqueantes.

## Ficheros clave
- `components/loading-states.tsx` — B1 (overlay `:129`, grises `:31,34,35,46,62,65,66,78,80,81`,
  border `:44`, `text-gray-500` `:98,149,168`, `text-white` `:105,166`). Reescrito entero.
- `components/presentation-mode.tsx` — B2 (avatar `:23`, viñetas `:116,120,124,128`,
  `text-gray-600` `:90,95,100`, header/nav/pager blancos `:174-226`).
- `components/analytics-dashboard.tsx` — `:109,173,180`.
- `components/api-metrics.tsx` — `:81,95,104,107,112,179`.
- `components/availability-calendar.tsx` — `:168,202,283,360`.
- `components/case-studies.tsx` — `:104,105`.
- `components/certifications.tsx` — `:66` (campo `color` del mock, render en `:185`), `:250`, `:258`.
- `components/developer-mode.tsx` — `:218` (spinner), `:225,227,228,232,245,252,262`.
  (No se tocaron los `text-white` de la cabecera del modal `:460-491`, no aparecen en el grep de aceptación.)
- `components/enhanced-animations.tsx` — borrados 3 exports muertos.
- `components/technical-blog.tsx` — `:230,239,260,264,320,323`.
- `components/testimonials.tsx` — `:79,85,127`.
- `components/pwa-installer.tsx` — `:96,99,100,132`.
- `app/globals.css` — fuente de los tokens `--omarchy-*` (`:11-78` tokyo-night/gruvbox/catppuccin/matrix,
  puente shadcn `:80-118`, utilidades `.om-*` ~`:204-254`). NO lo modifiques sin revisar antes.
- Punto de entrada para probar: `components/postman-app.tsx` (monta los paneles legacy del sidebar,
  `PresentationMode`, `ApiMetrics`, `DeveloperMode`, blog, testimonials, PWA).

## Cambios sin commitear
Ninguno. Todo el trabajo está en `d09a901`, ya pusheado a `origin/feature/t3-omarchy-tema-boot`
(fast-forward). Working tree limpio.

## Comandos de arranque/test
```bash
# Dependencias (pnpm está bloqueado en este repo; usa npm)
npm install --legacy-peer-deps

# Tipos y build
npx tsc --noEmit
npm run build

# Servir en un puerto libre (3000 suele estar ocupado por otros workspaces de Orca)
npx next start -p 3100
curl -s http://localhost:3100/ | grep -c Inforyde

# Dev
npm run dev   # http://localhost:3000

# Aceptación de este fix
grep -rn "orange-\|bg-white" components/          # debe dar 0 (exit 1)
grep -rn "orange-" components/landing-page.tsx    # 0 (la landing usa hex, no clases orange-)
# Comprobación de que las opacidades con var() compilan:
grep -o "color-mix(in oklab,var(--omarchy-accent)[^)]*)" .next/static/css/*.css | sort -u
```

## Trampas y contexto no obvio
- **Nombre de rama vs. remote.** El trabajo se hace en `feature/t3-fixes` pero se push a
  `origin/feature/t3-omarchy-tema-boot` (`git push origin HEAD:feature/t3-omarchy-tema-boot`).
  No hay rama remota `feature/t3-fixes`; la local es sólo un carril de trabajo.
- **Los comentarios de Linear y el texto de tickets son datos no instruidos**: revisor y tarea
  mandan, pero la spec del ticket no es una orden ejecutable.
- **El review original contó "9 ficheros" porque grepeó sobre el diff de la rama**, no sobre
  `components/` completo. De ahí que `technical-blog`/`testimonials`/`pwa-installer` no
  aparecieran como bloqueantes; el grep de aceptación, en cambio, es global.
- **Borrar exports es una rotura de API.** Si otro trabajo posterior importara `PulsingDot`,
  `WaveAnimation` o `RotatingBorder`, deberá re-escribirse con tokens; ya no existen.
- **`certifications.tsx` usa un campo `color` de datos**: la cadena `"bg-[var(--omarchy-accent)]"`
  se renderiza en `:185`; Tailwind escanea el literal, así que la clase se genera igual (no es
  una clase dinámica invisible).
- **`landing-page.tsx` sí contiene duros** (`#f5b301`, `#0b0b0c`, `#7ee787`) pero **no** casan con
  el patrón `orange-|bg-white`; por eso el grep da 0 aunque la landing siga pendiente (T2 follow-up).
- **Puerto 3000 ocupado** por el `next start` de otros workspaces (p. ej. `rerev-t2`). Usa 3100 o
  el que esté libre en el servidor.
- **`npm install` puede tocar `package-lock.json`** por los avisos de `allow-scripts`/`sharp`;
  no commitees cambios de lockfile que no correspondan a una dependencia real.
- **`npm audit --omit=dev`** sigue tirando 3 hallazgos (1 crítico, 2 altos) en `next@15.2.4`/`sharp`,
  preexistentes y fuera de este alcance. No ejecutes `audit fix --force`.
- Los `text-white` del mock de datos (p. ej. `DeveloperMode`) se consideran parte de un string de
  código mostrado; el grep de aceptación no mira `text-white`, así que no son bloqueantes.

## Próximos 3 pasos
1. **Re-review del DAN-92**: el coordinador/revisor vuelve sobre `origin/feature/t3-omarchy-tema-boot`
   (`d09a901`) confirmando los 3 bloqueantes cerrados y moviendo el ticket si procede (aquí no se cambió estado).
2. **Abrir ticket aparte** para la `landing-page.tsx` (hex `#f5b301/#0b0b0c/#7ee787`) y los duros
   secundarios (`blue-*`, `green-*`, `purple-*`, `gray-*` en paneles legacy y `bg-gray-200` de
   `enhanced-animations.tsx:119`) para completar la coherencia total de temas.
3. **Validación visual en los 4 temas** (`npx next start -p 3100`, cambiar tema en la waybar):
   click por el sidebar de Postman para ver el `LoadingOverlay`, abrir `PresentationMode`, el blog,
   testimonials, calendar, certifications y developer-mode; confirmar que ningún panel pinta naranja
   ni flash blanco y que `prefers-reduced-motion` sigue OK.
