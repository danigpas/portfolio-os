# HANDOFF — T3: Omarchy (temas rice, boot 3s con GSAP y waybar)

Ticket Linear: **DAN-92** · Proyecto: PorfoliOS · Rama: `feature/t3-omarchy-tema-boot`
(Base: `origin/feature/t2-frontend-fundacion`, commit `455ed7c`.)

## Objetivo

Convertir la capa visual del escritorio del portfolio en un "rice" estilo Omarchy:

1. Sistema de temas con tokens CSS `--omarchy-*` (Tokyo Night default, Gruvbox Dark,
   Catppuccin Mocha, Matrix), sin naranja por defecto ni colores hardcodeados en
   escritorio, ventanas y terminal.
2. Tipografía: JetBrains Mono como fuente base del sistema; display solo para el nombre.
3. Boot de ~3s estilo tty (log tipo systemd, stagger con GSAP, barra ASCII, skip con
   ESC y click, integración con `sessionStorage.omarchyVisited`).
4. Waybar superior: workspaces 1-5 mapeados a secciones (activa resaltada), reloj,
   módulo de red, separadores `│`, bordes 1px, esquinas rectas.
5. Wallpaper por tema con patrones ASCII/dither/scanline (CSS/SVG), sin círculos blur.
6. GSAP en micro-interacciones del escritorio, respetando `prefers-reduced-motion`.

Restricciones del ticket: no tocar `backend/`, no romper la landing SSR de T2, no crear
PR, no mergear, push solo de la propia rama.

## Estado actual

**Completado y pusheado.** `worker_done` enviado al coordinador con `--outcome succeeded`.
El estado del ticket NO se cambió (lo mueve el orquestador).

- 4 commits en la rama (`git log`):
  - `feat(t3): tokens --omarchy-* con 4 temas y JetBrains Mono base`
  - `feat(t3): boot tty ~3s con GSAP, barra ASCII y skip ESC/click`
  - `feat(t3): waybar, wallpaper por tema y micro-interacciones GSAP`
  - `refactor(t3): ventanas, terminal y paneles sobre tokens omarchy`
- `npx tsc --noEmit`: **limpio**.
- `npm run build`: **verde**, 7/7 páginas estáticas, sin warnings. Landing `/` = 65.8 kB / 205 kB first-load.
- Verificación en Chromium headless (Playwright): boot normal **2918 ms**, skip ESC **22 ms**,
  skip click **46 ms**, los 4 temas aplican `data-omarchy` correctamente, revisita entra
  directa al escritorio, **0 errores** en consola de página.
- Comentarios de progreso publicados en DAN-92 (inicio con modelo + final con detalle).
- **No** hay PR creada (por diseño).

## Decisiones tomadas (y por qué)

- **Tokens crudos + puente a los tokens semánticos de shadcn/Tailwind.** En vez de reescribir
  los componentes de contenido de T2, `globals.css` define `--omarchy-*` y los reexpone como
  `--background/--foreground/--card/--border/--muted/...`. Así las secciones que ya usaban
  clases semánticas (`about-section`, `experience-section`, …) heredan el tema sin tocarlas.
- **Los 4 temas viven en CSS, no en JS.** El tema solo pone `data-omarchy="<id>"` en
  `<html>`; no hay condicionales `theme === ...` en el chrome. Los "switch" devolvían 3
  paletas y ahora hay 4 temas: cualquier condicional se queda corto por diseño.
- **`ThemeProvider` conserva `getThemeClasses()`/`getAppClasses()`** por compatividad con
  llamadores viejos; devuelven clases basadas en tokens. Hoy solo las consume `postman-app`.
- **Presupuesto de boot 2.5s de timeline en lugar de 3.0s.** Con 3.0s el tiempo medido de
  "clic → escritorio" daba ~3.7s (montaje de React + polling del selector + render). Con 2.5s
  queda ~2.9-3.4s medido, dentro del límite observable de 3.5s. Sigue habiendo red de seguridad:
  un `setTimeout` a `BOOT_SECONDS + 0.3` remata el boot si GSAP no hace tick.
- **`gsap` con `stagger` numérico y `autoAlpha`** (no `opacity`): `autoAlpha` también gestiona
  `visibility`, así que si GSAP fallara las líneas no quedan "invisibles pero ocupando sitio".
- **Wallpaper 100% CSS** (gradientes repetidos por tema en `[data-omarchy="..."] .om-wallpaper-pattern`
  + scanlines + viñeta). Evita assets binarios, SVG inline con `#` escapado y huele a "rice" real.
- **`--radius: 0.125rem` y `rounded-none` en el chrome.** La estética Omarchy es de esquinas
  rectas; dejar el radio global en `calc()` permite que `ui/*` de shadcn siga compilando.
- **Selector de tema con `aria-label="Seleccionar tema"`.** No es solo a11y: el botón iba a tener
  como nombre accesible el nombre del tema activo ("Tokyo Night"), que cambia al seleccionar y
  rompe los selectores de test.
- **Migración del `localStorage` antiguo**: clave nueva `omarchy-theme`, con lectura de fallback
  de `portfolio-theme` (`ubuntu`/`vscode` → `tokyo-night`, `matrix` → `matrix`).
- **Se deja la landing SSR (`landing-page.tsx`) intacta**, incluidas sus clases duras
  (`#0b0b0c`, `#f5b301`). Es HTML estático y SEO de T2; el scope de T3 es
  escritorio/ventanas/terminal. Cambiarla ponía en riesgo el requisito "el HTML estático
  debe seguir teniendo contenido".
- **Se pospone para T4** el lanzador rofi (Ctrl+K) y los comandos de terminal
  `theme <nombre>` / `open <app>`; hay una pista deshabilitada en el dropdown del selector.

## Ficheros clave

| Fichero | Qué hace aquí |
|---|---|
| `app/globals.css` | Definición de los 4 temas, puente a tokens semánticos, superficies `.om-window/.om-panel/.om-inset`, wallpapers, scanlines, JSON highlighting, media query de `prefers-reduced-motion`. Base de todo. |
| `components/theme-system.tsx` | `OMARCHY_THEMES`, `ThemeProvider` (localStorage + `data-omarchy`), `useTheme()`, `ThemeSelector` (dropdown con swatches). |
| `components/boot-animation.tsx` | Boot tty: `BOOT_LINES` estilo systemd, `gsap.timeline`, `renderBar()` ASCII, skip por teclado/click, rama de reduced-motion. |
| `components/omarchy-waybar.tsx` | **Nuevo.** Waybar: workspaces 1-5, reloj, módulo red (`navigator.onLine` + eventos `online/offline`), `Separator` con `│`, botones terminal/reboot/shutdown. |
| `components/omarchy-wallpaper.tsx` | **Nuevo.** Solo 3 divs con las clases del patrón. |
| `components/ubuntu-desktop.tsx` | Compone wallpaper + waybar + dock + iconos; GSAP de entrada y hover; `activeSection` como prop nueva. |
| `components/desktop-session.tsx` | Pasa `activeSection` al escritorio; modales de shutdown/suspend sobre tokens. |
| `components/postman-app.tsx` | Ventana de la app: el render se reescribió a tokens (0 condicionales `theme ===`). Los `getEndpointData()` de datos NO se tocaron. |
| `components/terminal.tsx` | Terminal sobre tokens, prompt `daniel@omarchy:~$`, esquinas rectas. Ya no usa `useTheme`. |
| `hooks/use-prefers-reduced-motion.ts` | **Nuevo.** Hook con `matchMedia` para saltar tweens GSAP. |
| `app/layout.tsx` | `viewport.themeColor` → `#1a1b26` (Tokyo Night). Fuentes `next/font` ya existían. |
| `package.json` / `package-lock.json` | Añade `gsap` (instalado con `--legacy-peer-deps`). |

## Cambios sin commitear

**Ninguno.** El árbol estaba limpio tras los 4 commits y el push de
`feature/t3-omarchy-tema-boot` a `origin`.

Sin embargo, hay **basura no rastreada que sí conviene limpiar antes de seguir** (ignorada
por git, no aparece en `git status`):

- `.next/start.log` y `.next/start.pid` creados por las pruebas de servidor.
- `/tmp/pwtest` (fuera del repo): `node_modules` con `playwright-core` y los scripts
  `measure.cjs` / `debug.cjs` usados para medir el boot.

Esta entrega (HANDOFF.md) es el único fichero nuevo en el árbol de trabajo y no se ha
commiteado a propósito.

## Comandos de arranque/test

```bash
# instalacion (pnpm esta BLOQUEADO en este repo; usar npm)
npm install --legacy-peer-deps

# desarrollo
npm run dev                      # http://localhost:3000

# verificacion exigida por el ticket
npx tsc --noEmit                 # debe salir limpio
npm run build                    # debe salir verde

# servir el build y medir el boot (una sola vez, el shell de cada tool-call mata el bg)
node node_modules/next/dist/bin/next start -p 3000 > .next/start.log 2>&1 &
echo $! > .next/start.pid
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/   # 200
kill "$(cat .next/start.pid)"

# comprobar que la landing SSR sigue teniendo contenido
curl -s http://localhost:3000/ | grep -c "Daniel González Pascual"   # > 0
```

Prueba manual: abrir `/` → clic en **"Bootea el sistema"** → boot (saltar con **ESC** o
**clic**) → escritorio. En la waybar: workspaces 1-5, selector de tema, reloj e indicador
de red. Recargar: entra directo al escritorio (misma sesión). Probar
`prefers-reduced-motion` desde DevTools → Rendering.

## Trampas y contexto no obvio

- **El harness vive en otra rama.** `harness/builder-guide.md` y `harness/plan.md` NO están
  en esta rama; leerlos con:
  `git show origin/chore/harness-docs:harness/builder-guide.md`
- **La guía dice "rama basada en develop", pero este ticket ordena basarla en
  `feature/t2-frontend-fundacion`.** Manda la orden del coordinador. T2 aún no está en develop.
- **`danigpas/t3-omarchy` ya existía** y apuntaba al mismo commit que T2; la rama buena es
  `feature/t3-omarchy-tema-boot`. Al crearla con `git checkout -b ... origin/feature/t2-...`
  el upstream quedó apuntando a **T2**, no a sí misma: el push debe ser explícito
  `git push -u origin feature/t3-omarchy-tema-boot` (ya hecho, ahora el upstream es correcto).
- **OJO con el puerto 3000: la máquina es compartida con otros agentes de Orca.** Antes de
  matar nada, identificar el PID (`netstat -ano | grep ":3000"`) y confirmar que es de ESTE
  worktree con `Get-CimInstance Win32_Process -Filter "ProcessId=<pid>"`. Hubo un `next start`
  huérfano que sobrevivió a los `kill` y seguía sirviendo un build **obsoleto**: eso produce
  400 en recursos, hidratación rota, clics que no hacen nada y timings falsos. `npm start`
  enmascara el PID real; usar `node node_modules/next/dist/bin/next start`.
- **Medir el boot exige servidor + prueba en la MISMA llamada de shell** (los procesos en
  segundo plano mueren al acabar cada tool-call).
- **No hay Playwright en el repo.** Existe caché de navegadores en
  `%LOCALAPPDATA%\ms-playwright` (`chromium-1243`). Se puede instalar `playwright-core` fuera
  del repo y pasar `executablePath` — NO añadir Playwright a `package.json` de este proyecto.
- **Las líneas del boot se pintan con `style={{opacity: 0}}`** y GSAP las enciende. Si se toca
  el timeline sin `autoAlpha`, se ve un flash o, peor, una pantalla vacía.
- **Los condicionales `theme === "ubuntu" / "vscode"` ya no tienen sentido** con los nuevos IDs.
  Si aparece código con esos strings (p. ej. migraciones, snippets viejos), no lanza error:
  simplemente cae al `default` y pinta la paleta vieja. Buscar con
  `grep -rn '"ubuntu"\|"vscode"' components/` (solo debe quedar la migración de localStorage).
- **El botón "Preview" de la app Postman monta componentes de T2 que siguen teniendo colores
  duros** (`availability-calendar`, `certifications`, `analytics-dashboard`, `developer-mode`,
  `api-metrics`…). No se han tocado: quedan como deuda visual entre T3 y T4/T5.
- **El servicio worker PWA de T2 puede servir landing obsoleta** (commiteado como
  network-first en `455ed7c`). Si la landing "no cambia", duro-recargar / limpiar SW.
- **Landing y escritorio usan paletas distintas a propósito.** La landing es terminal
  verde/ámbar estática; el escritorio usa el tema activo. No "unificarlas" sin hablar con
  el coordinador: rompe el requisito de HTML estático.

## Próximos 3 pasos

1. **Que el orquestador lance el review de T3** sobre `feature/t3-omarchy-tema-boot`
   (no crear PR desde aquí) y, si es aprobado, mergear a `develop` junto con T2, resolviendo
   el conflicto previsible en `app/globals.css` / `theme-system.tsx`.
2. **Encarar T4** (`feature/t4-omarchy-wm`): window manager real (arrastrar/redimensionar/
   z-index/minimizar), launcher rofi con **Ctrl+K**, terminal como navegación real
   (`theme <nombre>`, `open <app>`, historial) y a11y completa por teclado. Reutilizar
   `use-prefers-reduced-motion.ts` y los `.om-*` para el modal de shutdown.
3. **Saldar la deuda de color** que queda en los componentes de contenido montados dentro de
   la ventana Postman (migrar `availability-calendar`, `certifications`, `analytics-dashboard`,
   `developer-mode`, `api-metrics` a `--omarchy-*`) y añadir un chequeo de regresión que
   vuelva a medir el boot (< 3.5s) y los 4 temas, para que T5 no lo rompa en silencio.
