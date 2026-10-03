"use client"

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { Check, Layers, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type OmarchyTheme = "tokyo-night" | "gruvbox" | "catppuccin" | "matrix"

export interface ThemeDefinition {
  id: OmarchyTheme
  name: string
  description: string
  /** Swatch used in the selector; mirrors the accent token of the theme. */
  swatch: string
}

export const OMARCHY_THEMES: ThemeDefinition[] = [
  { id: "tokyo-night", name: "Tokyo Night", description: "Azul neón, por defecto", swatch: "#7aa2f7" },
  { id: "gruvbox", name: "Gruvbox Dark", description: "Ámbar retro", swatch: "#fabd2f" },
  { id: "catppuccin", name: "Catppuccin Mocha", description: "Malva pastel", swatch: "#cba6f7" },
  { id: "matrix", name: "Matrix", description: "Verde terminal", swatch: "#00ff41" },
]

const STORAGE_KEY = "omarchy-theme"
const LEGACY_STORAGE_KEY = "portfolio-theme"
const THEME_IDS = OMARCHY_THEMES.map((theme) => theme.id)

interface ThemeContextType {
  theme: OmarchyTheme
  setTheme: (theme: OmarchyTheme) => void
  getThemeClasses: () => string
  getAppClasses: () => string
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface ThemeProviderProps {
  children: ReactNode
}

function migrateLegacyTheme(value: string | null): OmarchyTheme | null {
  if (!value) return null
  if (value === "matrix") return "matrix"
  if (value === "ubuntu" || value === "vscode") return "tokyo-night"
  return null
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<OmarchyTheme>("tokyo-night")

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY)
    if (saved && THEME_IDS.includes(saved as OmarchyTheme)) {
      setTheme(saved as OmarchyTheme)
      return
    }
    const legacy = migrateLegacyTheme(window.localStorage.getItem(LEGACY_STORAGE_KEY))
    if (legacy) setTheme(legacy)
  }, [])

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, theme)
    document.documentElement.setAttribute("data-omarchy", theme)
  }, [theme])

  const value = useMemo<ThemeContextType>(
    () => ({
      theme,
      setTheme,
      // Kept for backwards compatibility with existing desktop components.
      getThemeClasses: () => "bg-background text-foreground",
      getAppClasses: () => "om-window",
    }),
    [theme],
  )

  return (
    <ThemeContext.Provider value={value}>
      <div className="min-h-screen bg-background font-mono text-foreground">{children}</div>
    </ThemeContext.Provider>
  )
}

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()
  const currentTheme = OMARCHY_THEMES.find((option) => option.id === theme) ?? OMARCHY_THEMES[0]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          aria-label="Seleccionar tema"
          className="om-inset h-6 gap-1.5 rounded-none border px-2 font-mono text-[11px] text-foreground hover:bg-[var(--omarchy-surface-alt)] focus-visible:ring-1 focus-visible:ring-[var(--omarchy-accent)]"
        >
          <span
            aria-hidden
            className="h-2.5 w-2.5 rounded-none border border-[var(--omarchy-border)]"
            style={{ backgroundColor: currentTheme.swatch }}
          />
          <span className="hidden sm:inline">{currentTheme.name}</span>
          <Layers className="h-3 w-3 om-muted-text sm:hidden" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="om-panel min-w-48 rounded-none border font-mono text-xs"
      >
        {OMARCHY_THEMES.map((option) => (
          <DropdownMenuItem
            key={option.id}
            onClick={() => setTheme(option.id)}
            className="cursor-pointer gap-2 rounded-none focus:bg-[var(--omarchy-surface-alt)] focus:text-foreground"
          >
            <span
              aria-hidden
              className="h-3 w-3 rounded-none border border-[var(--omarchy-border)]"
              style={{ backgroundColor: option.swatch }}
            />
            <span className="flex flex-col">
              <span>{option.name}</span>
              <span className="om-muted-text text-[10px]">{option.description}</span>
            </span>
            {theme === option.id && <Check className="ml-auto h-3.5 w-3.5 om-accent-text" />}
          </DropdownMenuItem>
        ))}
        <DropdownMenuItem
          disabled
          className="om-muted-text cursor-default gap-2 rounded-none text-[10px] focus:bg-transparent"
        >
          <Terminal className="h-3 w-3" />
          <span>Ctrl+K → theme &lt;nombre&gt; (T4)</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
