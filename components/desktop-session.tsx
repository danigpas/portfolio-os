"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Code, Download, Monitor, Moon, Palette, Power, RotateCcw, Terminal as TerminalIcon } from "lucide-react"
import { UbuntuDesktop } from "@/components/ubuntu-desktop"
import { PostmanApp } from "@/components/postman-app"
import { Terminal } from "@/components/terminal"
import { useTheme, isOmarchyTheme } from "@/components/theme-system"
import { useCvData, PortfolioDataProvider } from "@/components/portfolio-data-provider"
import { downloadCv as downloadCvFromApi } from "@/lib/api"
import { APP_NAMES, SECTION_BY_APP, THEME_OPTIONS } from "@/lib/omarchy-config"
import { RofiLauncher, type RofiCommand } from "@/components/rofi-launcher"
import {
  ManagedWindow,
  WindowLayer,
  WindowManagerProvider,
  useWindows,
} from "@/components/window-manager"
import { useFocusTrap } from "@/hooks/use-focus-trap"

type PowerDialog = "shutdown" | null

const POSTMAN_TITLE = "Daniel's Portfolio API"
const TERMINAL_TITLE = "daniel@portfolio: ~"

/**
 * Sesión del escritorio Omarchy: ventanas gestionadas, lanzador rofi (Ctrl+K),
 * terminal como nav real y estados de energía.
 */
export function DesktopSession() {
  return (
    <PortfolioDataProvider>
      <WindowManagerProvider>
        <DesktopSessionInner />
      </WindowManagerProvider>
    </PortfolioDataProvider>
  )
}

function DesktopSessionInner() {
  const { openWindow, closeAllWindows } = useWindows()
  const { theme, setTheme } = useTheme()
  const cv = useCvData()

  const [activeSection, setActiveSection] = useState("GET /about")
  const [isSuspended, setIsSuspended] = useState(false)
  const [powerDialog, setPowerDialog] = useState<PowerDialog>(null)
  const [rofiOpen, setRofiOpen] = useState(false)

  const powerRef = useRef<HTMLDivElement>(null)
  useFocusTrap(powerRef, powerDialog !== null)

  const applyTheme = useCallback(
    (name: string): boolean => {
      const normalized = name.toLowerCase().trim()
      if (!isOmarchyTheme(normalized)) return false
      setTheme(normalized)
      return true
    },
    [setTheme],
  )

  const downloadCv = useCallback(() => {
    void downloadCvFromApi(cv.contact.cvPath)
  }, [cv.contact.cvPath])

  const openPostman = useCallback(
    (section?: string) => {
      if (section) setActiveSection(section)
      openWindow("postman", { title: POSTMAN_TITLE })
    },
    [openWindow],
  )

  const openTerminal = useCallback(() => {
    openWindow("terminal", { title: TERMINAL_TITLE })
  }, [openWindow])

  const openApp = useCallback(
    (app: string) => {
      const normalized = app.toLowerCase().trim()
      const section = SECTION_BY_APP[normalized]
      if (section) {
        openPostman(section)
        return
      }
      if (normalized === "terminal" || normalized === "shell") {
        openTerminal()
        return
      }
      openPostman()
    },
    [openPostman, openTerminal],
  )

  const resetToLandingState = useCallback(() => {
    closeAllWindows()
    setActiveSection("GET /about")
    setRofiOpen(false)
    setPowerDialog(null)
  }, [closeAllWindows])

  const handleReboot = useCallback(() => {
    resetToLandingState()
  }, [resetToLandingState])

  const handleSuspend = useCallback(() => {
    setRofiOpen(false)
    setIsSuspended(true)
  }, [])

  const handleResume = useCallback(() => {
    setIsSuspended(false)
  }, [])

  const requestShutdown = useCallback(() => {
    setRofiOpen(false)
    setPowerDialog("shutdown")
  }, [])

  const confirmShutdown = useCallback(() => {
    resetToLandingState()
  }, [resetToLandingState])

  const cancelShutdown = useCallback(() => {
    setPowerDialog(null)
  }, [])

  // Atajo global Ctrl/Cmd+K para el lanzador rofi.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault()
        setRofiOpen((current) => !current)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const commands = useMemo<RofiCommand[]>(() => {
    const sectionCommands: RofiCommand[] = [
      { id: "go-about", label: "Ir a Sobre mí", hint: "GET /about", group: "secciones", keywords: ["about", "bio"], run: () => openPostman("GET /about") },
      { id: "go-experience", label: "Ir a Experiencia", hint: "GET /experience", group: "secciones", keywords: ["trabajo", "jobs"], run: () => openPostman("GET /experience") },
      { id: "go-projects", label: "Ir a Proyectos", hint: "GET /projects", group: "secciones", keywords: ["portfolio"], run: () => openPostman("GET /projects") },
      { id: "go-education", label: "Ir a Educación", hint: "GET /education", group: "secciones", keywords: ["formacion"], run: () => openPostman("GET /education") },
      { id: "go-contact", label: "Ir a Contacto", hint: "POST /contact", group: "secciones", keywords: ["email"], run: () => openPostman("POST /contact") },
    ]

    const appCommands: RofiCommand[] = [
      {
        id: "open-terminal",
        label: "Abrir Terminal",
        hint: "daniel@portfolio: ~",
        group: "apps",
        icon: <TerminalIcon className="h-3.5 w-3.5" aria-hidden="true" />,
        keywords: ["shell", "consola"],
        run: openTerminal,
      },
      {
        id: "download-cv",
        label: "Descargar CV",
        hint: "cv --download",
        group: "apps",
        icon: <Download className="h-3.5 w-3.5" aria-hidden="true" />,
        keywords: ["pdf", "curriculum"],
        run: downloadCv,
      },
    ]

    const themeCommands: RofiCommand[] = THEME_OPTIONS.map((option) => ({
      id: `theme-${option.id}`,
      label: `Tema: ${option.label}`,
      hint: `theme ${option.id}`,
      group: "temas",
      icon: <Palette className="h-3.5 w-3.5" aria-hidden="true" />,
      keywords: ["theme", "color", option.id],
      run: () => applyTheme(option.id),
    }))

    const powerCommands: RofiCommand[] = [
      {
        id: "reboot",
        label: "Reiniciar",
        hint: "reboot",
        group: "energía",
        icon: <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />,
        run: handleReboot,
      },
      {
        id: "suspend",
        label: "Suspender",
        hint: "suspend",
        group: "energía",
        icon: <Moon className="h-3.5 w-3.5" aria-hidden="true" />,
        run: handleSuspend,
      },
      {
        id: "shutdown",
        label: "Apagar",
        hint: "shutdown",
        group: "energía",
        icon: <Power className="h-3.5 w-3.5" aria-hidden="true" />,
        run: requestShutdown,
      },
    ]

    return [...sectionCommands, ...appCommands, ...themeCommands, ...powerCommands]
  }, [openPostman, openTerminal, downloadCv, applyTheme, handleReboot, handleSuspend, requestShutdown])

  return (
    <>
      <UbuntuDesktop
        activeSection={activeSection}
        onSectionChange={(section) => openPostman(section)}
        onReboot={handleReboot}
        onSuspend={handleSuspend}
        onShutdown={requestShutdown}
        onOpenTerminal={openTerminal}
        onOpenPostmanApp={() => openPostman()}
      >
        <WindowLayer onOpenLauncher={() => setRofiOpen(true)}>
          <ManagedWindow id="postman" title={POSTMAN_TITLE} icon={<Code className="h-3.5 w-3.5" aria-hidden="true" />}>
            <PostmanApp initialSection={activeSection} />
          </ManagedWindow>
          <ManagedWindow
            id="terminal"
            title={TERMINAL_TITLE}
            icon={<TerminalIcon className="h-3.5 w-3.5" aria-hidden="true" />}
          >
            <Terminal
              onOpenApp={openApp}
              onNavigate={(section) => setActiveSection(section)}
              onDownloadCv={downloadCv}
              onSetTheme={applyTheme}
              onReboot={handleReboot}
              onSuspend={handleSuspend}
              onShutdown={requestShutdown}
            />
          </ManagedWindow>
        </WindowLayer>
      </UbuntuDesktop>

      <RofiLauncher open={rofiOpen} onClose={() => setRofiOpen(false)} commands={commands} />

      {/* Overlay de apagado estilo Omarchy */}
      {powerDialog === "shutdown" ? (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/80 font-[family-name:var(--font-jetbrains-mono),ui-monospace,monospace]">
          <div
            ref={powerRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="shutdown-title"
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.preventDefault()
                cancelShutdown()
              }
            }}
            className="w-full max-w-md rounded-sm border border-[var(--omarchy-border,#2a2a2e)] bg-[var(--omarchy-surface,#0d0d10)] p-6 text-[var(--omarchy-fg,#e6e6e6)] shadow-2xl"
          >
            <div className="mb-3 flex items-center gap-2 text-[var(--omarchy-accent,#7aa2f7)]">
              <Power className="h-4 w-4" aria-hidden="true" />
              <h2 id="shutdown-title" className="text-sm font-medium uppercase tracking-widest">
                apagar el sistema
              </h2>
            </div>
            <p className="mb-5 text-xs text-[var(--omarchy-muted,#a0a0a8)]">
              Se cerrarán todas las ventanas. Al volver a arrancar, el sistema se reiniciará de forma automática.
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={cancelShutdown}
                className="rounded-sm border border-[var(--omarchy-border,#2a2a2e)] px-4 py-2 text-xs uppercase tracking-widest text-[var(--omarchy-muted,#a0a0a8)] transition-colors hover:text-[var(--omarchy-fg,#e6e6e6)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--omarchy-accent,#7aa2f7)]"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmShutdown}
                className="rounded-sm border border-[var(--omarchy-danger,#f7768e)]/60 bg-[var(--omarchy-danger,#f7768e)]/10 px-4 py-2 text-xs uppercase tracking-widest text-[var(--omarchy-danger,#f7768e)] transition-colors hover:bg-[var(--omarchy-danger,#f7768e)]/20 focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--omarchy-danger,#f7768e)]"
              >
                Apagar
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Overlay de suspensión estilo Omarchy */}
      {isSuspended ? (
        <div
          role="button"
          tabIndex={0}
          aria-label="Desbloquear el equipo"
          className="fixed inset-0 z-[400] flex cursor-pointer flex-col items-center justify-center bg-[var(--omarchy-bg,#0d0d10)] font-[family-name:var(--font-jetbrains-mono),ui-monospace,monospace] text-[var(--omarchy-fg,#e6e6e6)]"
          onClick={handleResume}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              handleResume()
            }
          }}
        >
          <Monitor className="mb-4 h-10 w-10 text-[var(--omarchy-muted,#8b8b93)]" aria-hidden="true" />
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--omarchy-muted,#8b8b93)]">sesión suspendida</p>
          <h2 className="mt-2 text-lg">{cv.about.name}</h2>
          <p className="text-xs text-[var(--omarchy-muted,#a0a0a8)]">{cv.about.role}</p>
          <p className="mt-8 text-xs text-[var(--omarchy-muted,#8b8b93)]">
            Pulsa Enter o haz click para desbloquear
          </p>
        </div>
      ) : null}

      {/* Recordatorio de atajos accesible */}
      <p className="sr-only" aria-live="polite">
        Pulsa Ctrl más K para abrir el lanzador de comandos. Alt más Tab cambia de ventana. Apps disponibles: {APP_NAMES.join(", ")}. Tema actual: {theme}.
      </p>
    </>
  )
}
