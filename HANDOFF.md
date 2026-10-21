# HANDOFF — T4 (Omarchy window manager) rebasado sobre T3

Worktree: `C:/Users/danig/orca/workspaces/portfolio-os/t4-fixes`
Rama actual: `feature/t4-fixes` @ `5c87b6c` (merge commit; padres `d09a901` = T3, `2942724` = T4)

## Objetivo
Cerrar los 2 bloqueantes del review de **DAN-93** y rebasar la rama T4 sobre T3 para
dejar `origin/feature/t4-omarchy-wm` = T3 + T4 arreglado y listo para un merge limpio
sobre `develop`. No abrir PR, no mergear a `develop`, pushear solo a
`origin/feature/t4-omarchy-wm`.

- **Bloqueante 1:** `lib/omarchy-config.ts` declaraba su propia lista de temas (6, con
  `ubuntu`/`vscode` legacy). Debía derivarse de `components/theme-system.tsx` (fuente
  única). `desktop-session.tsx` hacía `setTheme(name as Theme)` sin validar → no-ops y
  `localStorage` inválido. Tras T3 el set válido es: `tokyo-night`, `gruvbox`,
  `catppuccin`, `matrix`.
- **Bloqueante 2:** los paneles usaban los tokens inexistentes `--omarchy-panel` y
  `--omarchy-panel-alt` (T3 define `--omarchy-surface` / `--omarchy-surface-alt`), así
  que tras el merge ventanas/rofi no seguían el cambio de tema.

## Estado actual
- **Completado y pusheado.** `origin/feature/t4-omarchy-wm` está en `5c87b6c`
  (fast-forward desde `2942724`). Working tree limpio.
- Verificación ejecutada: `npx tsc --noEmit` → 0 errores · `npm run build` → OK
  (Next 15.2.4, 7/7 rutas) · `npm start` + `curl -s localhost:3000 | grep -i Inforyde`
  → HTTP 200 con "Inforyde" · `grep -rn "omarchy-panel" components/ lib/` → **0** ·
  `grep -rn "as Theme" components/ lib/` → **0**.
- Comentario de cierre publicado en DAN-93 (sin cambiar el estado del ticket, sigue
  "In Review"). No hay PR abierto.

## Decisiones tomadas (y por qué)
- **Conflicto a favor de T3 en lo visual, a favor de T4 en lo estructural:** `T4` salió
  de T2 y NO traía el rediseño por tokens de T3, así que no se podía tomar `--theirs`
  a ciegas (perdería Waybar/wallpaper/tokens) ni `--ours` (perdería el WM/rofi/terminal).
  - `ubuntu-desktop.tsx`: se tomó **T3** (`git checkout --ours`) por conservar Waybar +
    `OmarchyWallpaper` + tokens + micro-interacciones GSAP; el `WindowLayer` de T4 entra
    como `children` y se le pasa `activeSection` desde `desktop-session`.
  - `postman-app.tsx`: se tomó **T3** (tokenizado) y se le quitaron los controles de
    ventana propios (minimizar/maximizar/cerrar y `isMaximized`), porque ahora los aporta
    el WM; el contenedor pasa a `flex h-full min-h-0` para llenar el `ManagedWindow`.
  - `terminal.tsx` y `desktop-session.tsx`: se tomó **T4** (`--theirs`) por su reescritura
    (nav real / WM), y encima se aplicaron los fixes de bloqueantes + tokens T3.
- **Fuente única de temas sin cast:** en vez de exportar solo la lista, se añade un type
  guard `isOmarchyTheme(value): value is OmarchyTheme`. Así `setTheme` se llama solo con
  valores ya estrechados (TS feliz, sin `as Theme`). `lib/omarchy-config.ts` importa
  `OMARCHY_THEMES` de `theme-system` y deriva `THEME_OPTIONS`/`THEME_NAMES` → rofi y
  terminal listan/aceptan solo los 4 temas válidos.
- **`applyTheme` devuelve `boolean`** (éxito) para que la terminal pueda decidir el
  mensaje; en `terminal.tsx` si `onSetTheme(...)` devuelve `false` se imprime
  "Tema no válido: … Temas válidos: …". Rofi no puede recibir entrada libre, así que
  solo genera comandos desde `THEME_OPTIONS`.
- **No se tocó** `globals.css`, `theme-system` (salvo los exports nuevos),
  `boot-animation`, `omarchy-waybar`, `omarchy-wallpaper`, `backend/`.
- Se aprovechó para usar tokens T3 en superficies T4 que aún llevaban literales:
  fondo de apagado/suspend → `var(--omarchy-surface)` / `var(--omarchy-bg)`, y el botón
  de Apagar pasa de `red-500` a `var(--omarchy-danger)` (nice-to-have del review, no
  bloqueante).

## Ficheros clave
- `components/theme-system.tsx` — fuente única de temas; `OMARCHY_THEMES`,
  `THEME_IDS`, `isOmarchyTheme()`, `OmarchyTheme`.
- `lib/omarchy-config.ts` — deriva `THEME_OPTIONS`/`THEME_NAMES` de theme-system;
  `APP_NAMES`, `SECTION_BY_APP`.
- `components/desktop-session.tsx` — orquesta WM + rofi (Ctrl+K) + overlays
  onKeyDown; `applyTheme` valida con `isOmarchyTheme` (sin cast); pasa `activeSection`
  a `UbuntuDesktop`.
- `components/terminal.tsx` — nav real; `theme <nombre>` rechaza inválidos
  (`onSetTheme?: (t: string) => boolean`).
- `components/window-manager.tsx` — WM (drag/resize/z-index/taskbar/Alt-Tab/GSAP);
  tokens `--omarchy-surface[/-alt]` en :575, :597, :674, :787.
- `components/rofi-launcher.tsx` — Ctrl+K, fuzzy, teclado; token `--omarchy-surface` en :139.
- `components/postman-app.tsx` — app tipo Postman tokenizada, sin chrome propio.
- `components/ubuntu-desktop.tsx` — capa T3 (Waybar + wallpaper + GSAP), recibe WM como children.
- `hooks/use-focus-trap.ts` — foco atrapado en modales (T4).

## Cambios sin commitear
- Ninguno. Working tree limpio en `feature/t4-fixes` (`5c87b6c`).
- Nota: esta instrucción de crear `HANDOFF.md` es la única modificación pendiente y NO
  se comitea (a petición explícita).

## Comandos de arranque/test
```sh
npm install --legacy-peer-deps        # pnpm bloqueado en este repo; gsap ya viene de T3
npx tsc --noEmit                      # tipos: 0 errores esperados
npm run build                         # next build, 7/7 rutas
npm start && curl -s localhost:3000 | grep -i Inforyde   # smoke HTTP
npm run dev                            # para probar a mano en el navegador
```
Flujo de prueba manual: entrar al escritorio → `Ctrl+K` (rofi) → flechas+Enter;
terminal: `theme matrix` (válida) y `theme foo` (inválida, debe dar error), `open
projects`, `cv --download`; `Alt+Tab`; minimizar/restaurar en la taskbar.

## Trampas y contexto no obvio
- **`lib/omarchy-config.ts` importa desde un módulo `"use client"`** (`theme-system`).
  Está bien porque solo lo consumen client components (`desktop-session`, `terminal`);
  NO lo importéis desde un server component o RSC raíz.
- **Círculo de imports a vigilar:** `theme-system` NO debe pasar a importar
  `omarchy-config` (la derivación es en una sola dirección: config → theme-system).
- **Rama T4 ocupada por otro worktree:** `feature/t4-omarchy-wm` está checked-out en
  `C:/Users/danig/orca/workspaces/portfolio-os/t4-wm`, así que `git checkout
  feature/t4-omarchy-wm` falla aquí. Por eso la entrega se hizo con push por refspec:
  `git push origin feature/t4-fixes:feature/t4-omarchy-wm`. El branch LOCAL `t4-wm`
  (en su worktree) sigue en `2942724`; hay que actualizarlo si se trabaja ahí.
- **Puerto 3000 puede estar ocupado** por un `next start` de otro worktree (p.ej.
  `rerev-t2`). Para verificar el build propio, matar el proceso ajeno antes o usar otro
  puerto. Identificar con: `netstat -ano | grep ":3000"` y
  `powershell.exe Get-CimInstance Win32_Process -Filter 'ProcessId=<pid>'`.
- **Temas legacy:** `theme-system` aún migra `ubuntu`/`vscode` (localStorage legacy) a
  `tokyo-night` vía `migrateLegacyTheme`. No volver a añadir `ubuntu`/`vscode` como
  temas seleccionables: no existen en el set de T3.
- **Nice-to-have NO hechos** (por no ser bloqueantes; quedan para el próximo): cleanup
  de GSAP al desmontar en `window-manager.tsx` (`gsap.context()`/`killTweensOf`),
  quitar código muerto (`cycleWindows`, `TerminalProps.onClose`), validar la forma del
  `JSON.parse` de geometría, mover el handler de teclado de rofi del `<input>` al
  `role="dialog"`, e implementar "saltar a secciones" en la paleta.

## Próximos 3 pasos
1. **Reverificación rápida por el coordinador/reviewer** sobre `5c87b6c` (los 2
   bloqueantes ya cerrados y verificación verde): si es OK, mover DAN-93 hacia merge a
   `develop` (el worker no lo hace).
2. **Sincronizar el worktree local `feature/t4-omarchy-wm`** (en `.../t4-wm`) con la
   remota actualizada, o descartar ese worktree, para evitar un fast-forward duplicado.
3. **(Opcional) Cerrar los nice-to-haves** del review en un commit `chore(t4):` —
   cleanup GSAP al desmontar, quitar `cycleWindows`/`TerminalProps.onClose`, validar
   geometría parseada y mover el key handler de rofi al contenedor del diálogo.
