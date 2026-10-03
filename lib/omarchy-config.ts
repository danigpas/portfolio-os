/**
 * lib/omarchy-config.ts
 *
 * Constantes del escritorio Omarchy compartidas entre el window manager, el
 * lanzador rofi y la terminal. Los datos personales SIEMPRE salen de lib/cv-data.ts;
 * aquí sólo viven identificadores de sistema (temas y apps).
 *
 * La lista de temas NO se declara aquí: `components/theme-system.tsx` es la
 * fuente única de verdad (tokens + `OMARCHY_THEMES`) y desde ahí se deriva.
 */

import { OMARCHY_THEMES } from "@/components/theme-system"

export interface ThemeOption {
  id: string
  label: string
}

/**
 * Temas válidos derivados de theme-system. Tras T3 (feature/t3-omarchy-tema-boot)
 * el set expuesto es tokyo-night | gruvbox | catppuccin | matrix.
 */
export const THEME_OPTIONS: ThemeOption[] = OMARCHY_THEMES.map((theme) => ({
  id: theme.id,
  label: theme.name,
}))

export const THEME_NAMES: string[] = THEME_OPTIONS.map((option) => option.id)

/** Apps que `open <app>` y el lanzador pueden abrir. */
export const APP_NAMES = ["terminal", "postman", "about", "experience", "projects", "education", "contact"]

/** Mapa app/sección → endpoint de la app Postman. */
export const SECTION_BY_APP: Record<string, string> = {
  about: "GET /about",
  experience: "GET /experience",
  projects: "GET /projects",
  education: "GET /education",
  contact: "POST /contact",
  certifications: "GET /certifications",
  blog: "GET /blog",
}
