"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { Monitor, Moon, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export type Theme = "ubuntu" | "vscode" | "matrix"

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
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

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("ubuntu")

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme") as Theme
    if (savedTheme && ["ubuntu", "vscode", "matrix"].includes(savedTheme)) {
      setTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("portfolio-theme", theme)
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  const getThemeClasses = () => {
    switch (theme) {
      case "ubuntu":
        return "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
      case "vscode":
        return "bg-gray-900"
      case "matrix":
        return "bg-black"
      default:
        return "bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
    }
  }

  const getAppClasses = () => {
    switch (theme) {
      case "ubuntu":
        return "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
      case "vscode":
        return "bg-gray-800 border-gray-600 text-gray-100"
      case "matrix":
        return "bg-black border-green-500 text-green-400"
      default:
        return "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, getThemeClasses, getAppClasses }}>
      <div className={`min-h-screen transition-all duration-500 ${getThemeClasses()}`}>{children}</div>
    </ThemeContext.Provider>
  )
}

export function ThemeSelector() {
  const { theme, setTheme } = useTheme()

  const themes = [
    { id: "ubuntu" as Theme, name: "Ubuntu", icon: Monitor, color: "text-orange-500" },
    { id: "vscode" as Theme, name: "VS Code Dark", icon: Moon, color: "text-blue-500" },
    { id: "matrix" as Theme, name: "Terminal Matrix", icon: Terminal, color: "text-green-500" },
  ]

  const currentTheme = themes.find((t) => t.id === theme)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`${
            theme === "matrix"
              ? "border-green-500 text-green-400 hover:bg-green-900"
              : theme === "vscode"
                ? "border-gray-600 text-gray-100 hover:bg-gray-700"
                : "border-orange-300 text-orange-600 hover:bg-orange-50"
          } 
                      transition-all duration-300`}
        >
          {currentTheme && <currentTheme.icon className={`w-4 h-4 mr-2 ${currentTheme.color}`} />}
          {currentTheme?.name}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className={`${
          theme === "matrix"
            ? "bg-black border-green-500 text-green-400"
            : theme === "vscode"
              ? "bg-gray-800 border-gray-600 text-gray-100"
              : "bg-white border-gray-200"
        }`}
      >
        {themes.map((themeOption) => (
          <DropdownMenuItem
            key={themeOption.id}
            onClick={() => setTheme(themeOption.id)}
            className={`cursor-pointer ${
              theme === "matrix"
                ? "hover:bg-green-900 focus:bg-green-900"
                : theme === "vscode"
                  ? "hover:bg-gray-700 focus:bg-gray-700"
                  : "hover:bg-gray-100 focus:bg-gray-100"
            }`}
          >
            <themeOption.icon className={`w-4 h-4 mr-2 ${themeOption.color}`} />
            {themeOption.name}
            {theme === themeOption.id && <span className={`ml-auto text-xs ${themeOption.color}`}>✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
