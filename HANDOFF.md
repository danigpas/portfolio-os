# HANDOFF — T4: Window manager real + rofi Ctrl+K + terminal nav + a11y

Ticket Linear: **DAN-93** · Rama: **`feature/t4-omarchy-wm`** · Último commit: `2942724` (pusheado).

---

## Objetivo

Convertir el escritorio Omarchy en un **gestor de ventanas real** navegable 100% por teclado:

1. Ventanas arrastrables por el header, redimensionables por los bordes, con z-index/foco al frente, minimizar→taskbar, maximizar/restaurar y cerrar, con animaciones GSAP (respetando `prefers-reduced-motion`).
2. Alt-Tab switcher entre ventanas abiertas.
3. Lanzador estilo **rofi con Ctrl+K** (fuzzy filter + navegación por teclado): saltar a secciones, descargar CV, cambiar tema (delegando en `theme-system`), abrir terminal, reboot/suspend/shutdown.
4. Terminal como **nav real**: `help/about/experience/projects/education/contact/cv --download/theme <nombre>/open <app>/reboot`, historial con ↑/↓ y tab-completion básica; los comandos abren las ventanas correspondientes.
5. Shutdown/suspend como overlay oscuro estilo Omarchy, con `onKeyDown` (no `onKeyPress`).
6. A11y: `role="button"`/aria-labels en iconos y docks, foco atrapado en modales, Escape cierra, todo operable por teclado.

Restricciones del encargo: basarse en `feature/t2-frontend-fundacion` (no en `develop`), usar `lib/cv-data.ts` como única fuente de datos, **no tocar** `backend/`, `globals.css`, `theme-system`, `boot-animation` ni waybar (zona de T3, en paralelo). No crear PR, no mergear.

---

## Estado actual

- **Implementación completa y verificada.** `npx tsc --noEmit` = 0 errores. `npm run build` = OK (7/7 páginas, sin warnings).
- E2E con Playwright/Chromium **en verde, sin errores de consola**: Ctrl+K→sección, Alt-Tab, minimizar→taskbar→restaurar por teclado, maximizar/restaurar, terminal `help` / `open projects` / `theme matrix`, historial ↑, Escape (rofi y modal de apagado), drag/resize/Alt-flechas, persistencia de geometría al reabrir, reduced-motion, tab-completion y `cv --download` (descarga el PDF).
- `worker_done` enviado al coordinador (outcome `succeeded`) y DAN-93 documentado (comentario de arranque, checkpoint y final). El estado del ticket **no** se cambió (lo mueve el orquestador).
- Working tree **limpio** salvo este `HANDOFF.md` (creado a propósito sin commitear).

---

## Decisiones tomadas (y por qué)

- **El WM es un provider + un `ManagedWindow` genérico.** `PostmanApp` y `Terminal` pasan a ser *contenido*; el chrome, la posición y los controles los aporta el window manager. Así una sola fuente gestiona z-index/foco/animación. Se eliminó de `PostmanApp` su propio marco `absolute` y los `isMaximized`/`onMinimize/onMaximize/onClose`.
- **`savedRef` se mezcla en cada cambio de estado** (no solo al montar): cerrar y reabrir una ventana recupera su última posición dentro de la sesión, que es lo que pide la spec ("posición/tamaño persistidos por sesión").
- **El botón Ctrl+K vive en la taskbar, no como fixed abajo-derecha.** Un botón fijo en la esquina sureste **tapaba el asa de resize** de las ventanas (bug real detectado en las pruebas). Moverlo a la barra del sistema (abajo-izquierda) lo elimina y además da un punto de acceso con ratón sin canibalizar el teclado.
- **z-index por capas explícitas:** ventanas `20+` (incremental al enfocar), panel superior `50`, dock `60`, taskbar `110`, Alt-Tab `200`, rofi `300`, overlays de energía `400`. De este modo las ventanas quedan *debajo* del panel/dock (como en un escritorio real) y los modales por encima de todo.
- **Animaciones GSAP sincronizadas con el estilo de React:** la maximización usa `useLayoutEffect` + `gsap.fromTo` sobre `left/top/width/height` desde la geometría previa a la nueva (React ya pintó el destino, GSAP rellena el trayecto). Drag/resize van directos a `setWindowBounds` (sin tween) para ir fluidos. `prefersReducedMotion()` desactiva los tweens.
- **Temas vía delegación + `lib/omarchy-config.ts`:** T4 no redefine temas (son de T3). Se exporta una lista única de IDs usados por rofi/terminal/desktop-session y se llama a `setTheme(name as Theme)`. Esto evita duplicar listas y centraliza el punto de reconciliación con T3.
- **Colores con tokens Omarchy + fallback:** `var(--omarchy-*, #hex)`. Como `globals.css` (de T3) aún no define `--omarchy-*`, el fallback deja la capa de ventanas usable en solitario y, al fusionar con T3, tomará los tokens reales sin editar el código.
- **Datos siempre desde `lib/cv-data.ts`** y `useLanguage()` en terminal/desktop (antes la terminal fijaba `"es"`). Los literales de rofi son etiquetas de UI, no datos del CV.
- **No se añadió foco-trap a las ventanas** (sería un `aria-modal` falso en un escritorio multi-ventana); el foco atrapado se reserva a los modales reales: rofi y el diálogo de apagado. La ventana sí captura Escape cuando el foco está en su header.

---

## Ficheros clave

| Ruta | Rol |
|------|-----|
| `components/window-manager.tsx` | **Nuevo.** Provider (`useWindows`), `ManagedWindow`, `WindowTaskbar`, `AltTabSwitcher`, `WindowLayer`, persistencia y GSAP. |
| `components/rofi-launcher.tsx` | **Nuevo.** Paleta Ctrl+K, fuzzy filter, nav por teclado, foco atrapado. Exporta `RofiCommand`. |
| `components/terminal.tsx` | Reescrito como nav real (comandos, historial ↑/↓, tab-completion, a11y `role=log`/`aria-live`). |
| `components/desktop-session.tsx` | Orquestador: envuelve en `WindowManagerProvider`, construye `commands` de rofi, wiring terminal↔apps, overlays de shutdown/suspend, atajo global Ctrl+K. |
| `components/postman-app.tsx` | Contenido gestionado por el WM (se quitó su marco y los controles de OS). Conserva la barra de la app. |
| `components/ubuntu-desktop.tsx` | A11y en docks, iconos de escritorio y acciones Reboot/Shutdown del panel (`role=button`, `tabIndex`, `onKeyDown`). |
| `hooks/use-focus-trap.ts` | **Nuevo.** Trampa de foco para modales (rofi, apagado). |
| `lib/omarchy-config.ts` | **Nuevo.** IDs de temas/apps compartidos por rofi/terminal/desktop-session. |
| `lib/cv-data.ts` | Fuente de datos (NO se tocó). |
| `package.json` | `gsap` añadido. `package-lock.json` actualizado. |

API clave de contexto (`useWindows`): `windows, order, activeId, openWindow, closeWindow, closeAllWindows, minimizeWindow, restoreWindow, toggleMaximize, focusWindow, setWindowBounds, cycleWindows, isOpen`.

---

## Cambios sin commitear

- **Ninguno** en el código: todo el trabajo T4 está en el commit `2942724` (ya pusheado a `origin/feature/t4-omarchy-wm`).
- `HANDOFF.md` queda **untracked a propósito** (la orden de este documento es no commitear ni pushear).

---

## Comandos de arranque / test

```bash
# instalar (pnpm está bloqueado -> npm + legacy-peer-deps)
npm install --legacy-peer-deps
# gsap ya queda en package.json si se reinstala desde cero:
npm install gsap --legacy-peer-deps

# tipos y build (ambos deben salir verdes)
npx tsc --noEmit
npm run build

# desarrollo
npm run dev            # http://localhost:3000  (u otro puerto: npx next dev -p 3112)
# producción ya construida
npx next start -p 3111
```

Entrada al escritorio: `/` es landing SSR; el botón "Bootea el sistema" inicia el desktop. Con `sessionStorage.omarchyVisited = "true"` entra directo al escritorio (en móvil nunca entra).

E2E (Playwright se usó desde la caché de `npx`, no está en `package.json`):

```bash
export NODE_PATH="C:/Users/danig/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules"
export BASE_URL="http://localhost:3112"
node "$TEMP/wm-smoke.cjs"        # flujo de teclado completo
node "$TEMP/wm-interactions.cjs" # drag / resize / Alt-flechas / persistencia
node "$TEMP/wm-extra.cjs"        # reduced-motion + tab-completion + cv --download
```
Esos 3 `.cjs` están en el temp del runner (fuera del repo); si se necesitan, recrear. Los navegadores de Playwright (chromium-1243) ya están instalados en `~/AppData/Local/ms-playwright`.

Documentación del ticket (sin cambiar estado):

```bash
orca linear comment add --id DAN-93 --body-file - --json <<'EOF'
<comentario>
EOF
```

---

## Trampas y contexto no obvio

- **Conflicto de fusión esperado con T3** (`feature/t3-omarchy-tema-boot`): T3 reescribe `globals.css`, `theme-system`, `boot-animation` y añade waybar. T4 **no** tocó esos ficheros, pero sí `ubuntu-desktop.tsx` (panel/dock) — reconciliar ahí los a11y de T4 con la nueva barra de T3.
- **IDs de tema**: `lib/omarchy-config.ts` usa `tokyo-night/gruvbox/catppuccin/matrix` + `ubuntu/vscode` (legacy). El `Theme` actual de `theme-system` sólo conoce `ubuntu|vscode|matrix`, por eso hay un `as Theme` en `applyTheme`. Hasta que T3 se fusione, los temas nuevos no cambian nada visual. **Fusión:** exportar la lista desde `theme-system` y quitar el cast.
- **Tokens `--omarchy-*` aún no existen** en `globals.css`; todo el styling de la capa de ventanas usa `var(--omarchy-*, fallback)`. Nombres usados: `--omarchy-panel`, `--omarchy-panel-alt`, `--omarchy-border`, `--omarchy-fg`, `--omarchy-muted`, `--omarchy-accent`. T3 debería definir esos nombres para que T4 herede la paleta real (o hacer un find/replace de nombres).
- **`zRef` muta dentro de los updaters de `setWindows`** (`++zRef.current`): en dev con StrictMode el updater puede correr dos veces y el z sube de más. Es inocuo, pero no asumir valores exactos.
- **Geometría persistida** = sólo `bounds` + `maximized` (no `minimized`). Clave `sessionStorage` `omarchy-wm:v1`. `reboot` cierra todas las ventanas pero conserva la geometría guardada.
- **Ventanas bajo el panel/dock por z-index**: las ventanas nunca tapan el panel superior (z-50) ni el dock (z-60); por eso el launcher vive en la taskbar (z-110) y rofi/apagado van a z-300/z-400.
- **`as Theme` y `as keyof typeof corpus`** son los únicos "casts". No hay `: any` nuevos (los `: any` existentes están en ficheros que T4 no tocó).
- **No quedaba ningún `onKeyPress`** en el repo (buscado); toda la navegación por teclado usa `onKeyDown`.
- **Puertos**: el proceso en `:3000` es de **otro** builder/agente — matarlo rompió el servidor de T3. Levantar los propios en `3111/3112` y cerrarlos al terminar.
- **Foco/Escape en la terminal**: la ventana cierra con Escape sólo cuando el foco está en el *header*, no en la terminal (no interfiere al escribir).
- **Rofi reabre vacío**: el estado `query`/`activeIndex` se resetea en cada apertura.

---

## Próximos 3 pasos

1. **Review de T4 + fusión a `develop` por el orquestador** (este agente no crea PR ni mergea). Al fusionar, resolver el choque con T3 en `ubuntu-desktop.tsx` (a11y de T4 ↔ waybar de T3) y verificar el esquema de z-index (panel/dock por encima de ventanas).
2. **Reconciliar temas y tokens:** exportar la lista de temas desde `theme-system` (fuente de verdad de T3), eliminar el cast `as Theme` de `desktop-session`/`omarchy-config` y conectar los `var(--omarchy-*)` a los tokens reales definidos en `globals.css`.
3. **T5 (integración frontend↔backend):** que la app Postman, la terminal y el rofi consuman la API FastAPI de T1 (`/api/about`, `/api/experience`, `/api/cv`…) con fallback a `lib/cv-data.ts`; cablear `Descargar CV` y `cv --download` a `GET /api/cv` (hoy van al PDF estático `cv.contact.cvPath`).
