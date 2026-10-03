/**
 * lib/omarchy-config.ts
 *
 * Constantes del escritorio Omarchy compartidas entre el window manager, el
 * lanzador rofi y la terminal. Los datos personales SIEMPRE salen de lib/cv-data.ts;
 * aquí sólo viven identificadores de sistema (temas y apps).
 */

export interface ThemeOption {
  id: string
  label: string
}

/**
 * Temas conocidos. T3 (feature/t3-omarchy-tema-boot) es la fuente de verdad de
 * los tokens; aquí sólo se listan los nombres para delegar en theme-system.
 */
export const THEME_OPTIONS: ThemeOption[] = [
  { id: "tokyo-night", label: "Tokyo Night" },
  { id: "gruvbox", label: "Gruvbox Dark" },
  { id: "catppuccin", label: "Catppuccin Mocha" },
  { id: "matrix", label: "Matrix" },
  { id: "ubuntu", label: "Ubuntu (legacy)" },
  { id: "vscode", label: "VS Code Dark (legacy)" },
]

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
