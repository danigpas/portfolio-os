"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Clock,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Mail,
  Download,
  Github,
  Linkedin,
  Terminal,
  Palette,
  Power,
} from "lucide-react"
import { useTheme, ThemeSelector } from "@/components/theme-system"
import { Terminal as TerminalComponent } from "@/components/terminal"

interface UbuntuDesktopProps {
  children: React.ReactNode
  onSectionChange?: (section: string) => void
  onReboot?: () => void
  onSuspend?: () => void
  onShutdown?: () => void
  onOpenTerminal?: () => void
  onOpenPostmanApp?: () => void
  onCloseTerminal?: () => void
}

export function UbuntuDesktop({ children, onSectionChange, onReboot, onSuspend, onShutdown, onOpenTerminal, onOpenPostmanApp, onCloseTerminal }: UbuntuDesktopProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  const { theme, getThemeClasses } = useTheme()

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const handleSectionClick = (section: string) => {
    if (onOpenPostmanApp) {
      onOpenPostmanApp()
    }
    if (onSectionChange) {
      onSectionChange(section)
    }
  }

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank")
  }

  const handleDownloadCV = () => {
    const link = document.createElement("a")
    link.href = "/cv-daniel-gonzalez-pascual.pdf"
    link.download = "CV-Daniel-Gonzalez-Pascual.pdf"
    link.click()
  }

  const dockItems = [
    {
      id: "about",
      icon: User,
      label: "Sobre mí",
      color: theme === "matrix" ? "bg-green-600" : theme === "vscode" ? "bg-blue-600" : "bg-green-500",
      endpoint: "GET /about",
    },
    {
      id: "experience",
      icon: Briefcase,
      label: "Experiencia",
      color: theme === "matrix" ? "bg-green-700" : theme === "vscode" ? "bg-indigo-600" : "bg-blue-500",
      endpoint: "GET /experience",
    },
    {
      id: "education",
      icon: GraduationCap,
      label: "Educación",
      color: theme === "matrix" ? "bg-green-800" : theme === "vscode" ? "bg-purple-600" : "bg-purple-500",
      endpoint: "GET /education",
    },
    {
      id: "projects",
      icon: Code,
      label: "Proyectos",
      color: theme === "matrix" ? "bg-green-500" : theme === "vscode" ? "bg-orange-600" : "bg-orange-500",
      endpoint: "GET /projects",
    },
    {
      id: "contact",
      icon: Mail,
      label: "Contacto",
      color: theme === "matrix" ? "bg-green-900" : theme === "vscode" ? "bg-red-600" : "bg-red-500",
      endpoint: "POST /contact",
    },
  ]

  const allDockItems = [...dockItems];

  const desktopIcons = [
    {
      id: "terminal",
      icon: Terminal,
      label: "Terminal",
      color: theme === "matrix" ? "bg-green-600" : theme === "vscode" ? "bg-gray-700" : "bg-gray-800",
      action: () => {
        if (onOpenTerminal) onOpenTerminal()
      },
    },
    {
      id: "cv",
      icon: Download,
      label: "Descargar CV",
      color: theme === "matrix" ? "bg-green-600" : theme === "vscode" ? "bg-emerald-700" : "bg-emerald-600",
      action: handleDownloadCV,
    },
    {
      id: "github",
      icon: Github,
      label: "GitHub",
      color: theme === "matrix" ? "bg-green-800" : theme === "vscode" ? "bg-gray-700" : "bg-gray-800",
      action: () => handleExternalLink("https://github.com/danigpas"),
    },
    {
      id: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      color: theme === "matrix" ? "bg-green-700" : theme === "vscode" ? "bg-blue-700" : "bg-blue-600",
      action: () => handleExternalLink("https://www.linkedin.com/in/daniel-gonz%C3%A1lez-pascual-dev/"),
    },
  ]

  const getWallpaperElements = () => {
    switch (theme) {
      case "matrix":
        return (
          <>
            <div className="matrix-rain"></div>
            <div className="absolute inset-0 bg-black/80"></div>
            <div className="absolute inset-0 opacity-10">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute text-green-400 font-mono text-xs animate-pulse"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 5}s`,
                  }}
                >
                  {Math.random().toString(2).substr(2, 8)}
                </div>
              ))}
            </div>
          </>
        )
      case "vscode":
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
          </div>
        )
      default:
        return (
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-500 rounded-full blur-3xl animate-pulse delay-2000"></div>
          </div>
        )
    }
  }

  const getTopPanelClasses = () => {
    switch (theme) {
      case "matrix":
        return "bg-black/90 border-green-500/50 text-green-400"
      case "vscode":
        return "bg-gray-800/90 border-gray-600/50 text-gray-100"
      default:
        return "bg-gray-900/80 border-gray-700/50 text-white"
    }
  }

  const getDockClasses = () => {
    switch (theme) {
      case "matrix":
        return "bg-black/90 border-green-500/50"
      case "vscode":
        return "bg-gray-800/90 border-gray-600/50"
      default:
        return "bg-gray-900/80 border-gray-700/50"
    }
  }

  return (
    <div className={`fixed inset-0 overflow-hidden transition-all duration-500 ${getThemeClasses()}`}>
      {/* Theme-specific wallpaper elements */}
      {getWallpaperElements()}

      {/* Top panel */}
      <div
        className={`absolute top-0 left-0 right-0 h-8 backdrop-blur-sm border-b flex items-center justify-between px-4 z-50 ${getTopPanelClasses()}`}
      >
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium">
            {theme === "matrix"
              ? "MATRIX_PORTFOLIO.EXE"
              : theme === "vscode"
                ? "Daniel's Dev Environment"
                : "Daniel's Portfolio OS"}
          </div>
        </div>

        <div className="flex items-center space-x-2 mx-auto">
            <Palette className="w-3 h-3" />
            <span className="text-xs">Escoger tema</span>
            <ThemeSelector />
          </div>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span>{currentTime.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onReboot}>
            <Power className="w-4 h-4" />
            <span>Reboot</span>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer" onClick={onShutdown}>
            <Power className="w-4 h-4 text-red-500" />
            <span>Shutdown</span>
          </div>
          <div
            className={`w-4 h-4 rounded-full animate-pulse ${theme === "matrix" ? "bg-green-500" : theme === "vscode" ? "bg-blue-500" : "bg-green-500"}`}
          ></div>
        </div>
      </div>

      {/* Desktop icons - Portfolio sections */}
      <div className="absolute top-12 left-4 space-y-4 z-10">
        {dockItems.slice(0, 3).map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center space-y-1 cursor-pointer hover:bg-white/10 p-2 rounded transition-all duration-200 ${
                theme === "matrix" ? "text-green-400" : theme === "vscode" ? "text-gray-100" : "text-white"
              }`}
              onClick={() => {
                  if (onOpenPostmanApp) onOpenPostmanApp()
                  handleSectionClick(item.endpoint)
                }}
            >
              <div
                className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs text-center">{item.label}</span>
            </div>
          )
        })}
      </div>

      <div className="absolute top-12 right-4 space-y-4 z-10">
        {desktopIcons.map((item) => {
          const Icon = item.icon
          return (
            <div
              key={item.id}
              className={`flex flex-col items-center space-y-1 cursor-pointer hover:bg-white/10 p-2 rounded transition-all duration-200 group ${
                theme === "matrix" ? "text-green-400" : theme === "vscode" ? "text-gray-100" : "text-white"
              }`}
              onClick={item.action}
            >
              <div
                className={`w-12 h-12 ${item.color} rounded-lg flex items-center justify-center hover:scale-110 transition-transform shadow-lg hover:shadow-xl`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>
              <span
                className={`text-xs text-center transition-colors ${
                  theme === "matrix"
                    ? "group-hover:text-green-300"
                    : theme === "vscode"
                      ? "group-hover:text-blue-300"
                      : "group-hover:text-orange-300"
                }`}
              >
                {item.label}
              </span>
            </div>
          )
        })}
      </div>

      {/* Dock */}
      <div
        className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 backdrop-blur-sm rounded-2xl px-4 py-2 border z-60 ${getDockClasses()}`}
      >
        <div className="flex items-center space-x-3">
          {allDockItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.id}
                className={`w-10 h-10 ${item.color} rounded-lg flex items-center justify-center cursor-pointer hover:scale-110 transition-transform group relative`}
                onClick={() => (item.action ? item.action() : handleSectionClick(item.endpoint))}
                title={item.label}
              >
                <Icon className="w-5 h-5 text-white" />

                {/* Tooltip */}
                <div
                  className={`absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap ${
                    theme === "matrix"
                      ? "bg-black text-green-400 border border-green-500"
                      : theme === "vscode"
                        ? "bg-gray-800 text-gray-100 border border-gray-600"
                        : "bg-gray-900 text-white"
                  }`}
                >
                  {item.label}
                  <div
                    className={`absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent ${
                      theme === "matrix"
                        ? "border-t-black"
                        : theme === "vscode"
                          ? "border-t-gray-800"
                          : "border-t-gray-900"
                    }`}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* App window */}
      {children}
    </div>
  )
}
