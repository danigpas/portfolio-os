# Plan maestro — Portfolio OS Omarchy

Objetivo: convertir el portfolio en una experiencia Omarchy (moderno/cyberpunk/retro)
con backend Python FastAPI, frontend TypeScript, boot de ~3s con GSAP, ventanas
reales, dual-mode (landing SSR + desktop opcional) y SEO/a11y/móvil resueltos.

## Tickets

### T0 — Hotfixes CV + experiencia (hecho por el orquestador)
- PDF en `public/cv-daniel-gonzalez-pascual.pdf` (URL: https://danigpascual.dev/cv-daniel-gonzalez-pascual.pdf)
- Experiencia: DisOfic sept 2023–mar 2026; Inforyde mar 2026–actualidad (Madrid, semi-senior Python, mercado eléctrico).
- Errores TS corregidos, warnings Next 15 (viewport) resueltos, DAW "En curso", "3+ años".
- Estado: **Done**. PR a develop.

### T1 — Backend FastAPI (`feature/t1-backend-fastapi`)
- Nuevo directorio `backend/`: app FastAPI con endpoints que espejan el concepto
  Portfolio API: `GET /api/about`, `GET /api/experience`, `GET /api/education`,
  `GET /api/projects`, `GET /api/skills`, `POST /api/contact`, `GET /api/cv`
  (sirve el PDF con `Content-Disposition`), `GET /api/health`.
- Datos centralizados en `backend/app/data/cv.py` (única fuente de verdad, ES/EN).
- Pydantic v2 para schemas, CORS configurado para dominios propios, rate-limit
  básico en `/contact` (validación anti-spam), logging estructurado.
- Tests pytest de todos los endpoints. `requirements.txt` o `pyproject.toml`.
- README de backend con arranque (`uvicorn`) y variables de entorno.
- **Aceptación:** `pytest` verde; cada endpoint responde 200 con schema correcto;
  `/api/cv` sirve el PDF; lint/ruff sin errores.

### T2 — Frontend: limpieza + datos centralizados + landing SSR/SEO (`feature/t2-frontend-fundacion`)
- Eliminar ~3.000 líneas de código muerto: `hero-section`, `about-section`,
  `experience-section`, `education-section`, `projects-section`, `testimonials`,
  `case-studies`, `analytics-dashboard`, `api-metrics`, `availability-calendar`,
  `certifications`, `contact-section`, `footer`, `navbar`, `malaga-decorations`,
  `hover-effects`, `enhanced-animations`, `scroll-animations`, `loading-states`,
  `pwa-installer` (y lo que resulte huérfano tras el análisis de imports).
- Eliminar dependencias sin uso (recharts, react-hook-form, zod, embla, date-fns,
  input-otp, react-day-picker, vaul, etc. — verificar imports reales antes).
- Crear `lib/cv-data.ts` como única fuente de datos del frontend (tipada, ES/EN).
- **Dual-mode**: landing SSR legible por SEO en `/` con hero + resumen + CV + contacto,
  botón "Bootear el sistema" que entra al desktop. Sin boot forzado: si
  `sessionStorage.omarchyVisited` → desktop directo; primer arranque muestra boot.
- Metadata completa: title/description reales, Open Graph, favicon, sitemap, robots.
- Fallback móvil: detección → versión lineal navegable (sin desktop), con aviso.
- **Aceptación:** `npm run build` verde sin warnings; `tsc --noEmit` limpio; la landing
  renderiza contenido en el HTML estático (curl visible); sin imports muertos
  (knip o grep manual); Lighthouse SEO básico razonable.

### T3 — Omarchy: temas + boot 3s GSAP + waybar (`feature/t3-omarchy-tema-boot`)
- Sistema de temas estilo rice: **Tokyo Night** (default), Gruvbox Dark,
  Catppuccin Mocha, Matrix. Tokens CSS coherentes (bg, fg, accent, border, muted).
- Tipografía: JetBrains Mono como fuente principal del sistema (ya está instalada
  via next/font; promoverla a base del diseño), display font solo para el nombre.
- Boot ~3s estilo tty: líneas de log tipo systemd (`[ OK ] Mounted /dev/portfolio`),
  barra de progreso ASCII, GSAP para entrada de líneas/stagger, skip con ESC y
  con click, `sessionStorage` para no repetir. Sin spinner hexagonal naranja.
- **Waybar** superior: workspaces 1-5 mapeados a secciones, reloj, módulo de red
  (online/offline), separadores `│`, estética 1px borders, sin rounded-2xl.
- Wallpaper temático por tema: patrones ASCII/dither/grano/scanline sutiles (CSS/SVG),
  nada de círculos blur naranjas.
- Escritorio usa GSAP para micro-interacciones (hover docks, aperturas de ventana).
- **Aceptación:** boot total ≤ 3.5s con skip funcional; 4 temas completos;
  waybar refleja sección activa; build verde.

### T4 — Window manager real + rofi Ctrl+K + terminal + a11y (`feature/t4-omarchy-wm`)
- Ventanas de verdad: arrastrables (header), redimensionables (bordes), z-index
  manager, minimizar → taskbar, maximizar, cerrar; GSAP en open/close/minimize.
- Alt-Tab switcher entre ventanas; focus visible; navegación por teclado completa.
- **Rofi-style launcher (Ctrl+K)**: paleta de comandos para saltar a secciones,
  descargar CV, cambiar tema, abrir terminal. Fuzzy filter, teclado-first.
- Terminal funcional como nav real: `help`, `experience`, `cv --download`,
  `contact`, `theme <nombre>`, `open <app>`, historial con flechas.
- Modal de shutdown/suspend rediseñado al estilo Omarchy (nada de blanco/azul genérico).
- A11y: `role="button"`, aria-labels, foco gestionado en modales, Escape cierra.
- **Aceptación:** todo operable solo con teclado; ventanas no se pierden ni
  solapan mal; build verde; `tsc` limpio.

### T5 — Integración frontend↔backend + review final (`feature/t5-integracion`)
- La app tipo Postman del escritorio consume la API FastAPI real (T1) con fetch
  y estados de carga/error; fallback a datos locales si el backend no responde.
- Botón "Descargar CV" usa `GET /api/cv` (con fallback a `/cv-...pdf` estático).
- Variables de entorno `NEXT_PUBLIC_API_URL` documentadas; proxy de dev si aplica.
- Smoke test E2E básico (flujo: boot → abrir sección → contacto).
- **Aceptación:** con backend levantado, datos vienen de la API; sin backend,
  degradación elegante; build + tests verdes.

## Dependencias y waves

```
Wave 1:  T1 (backend)     ‖  T2 (fundación frontend)
Wave 2:  T3 (tema/boot)   ‖  T4 (WM)            [tras T2]
Wave 3:  T5 (integración)                       [tras T1 + T4]
Reviews: 1 reviewer por ticket tras cada builder_done (slot: 2 workers max)
```

Cada ticket = 1 issue Linear (proyecto PorfoliOS) + 1 rama feature + 1 PR a develop.
