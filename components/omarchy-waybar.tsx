"use client"

import { useEffect, useState } from "react"
import {
  Briefcase,
  Code,
  GraduationCap,
  Mail,
  Power,
  RotateCcw,
  TerminalSquare,
  User,
  Wifi,
  WifiOff,
} from "lucide-react"
import { ThemeSelector } from "@/components/theme-system"

export interface WaybarProps {
  activeSection: string
  onSectionChange: (endpoint: string) => void
  onOpenTerminal?: () => void
  onReboot?: () => void
  onShutdown?: () => void
}

const WORKSPACES = [
  { index: 1, endpoint: "GET /about", label: "sobre-mi", icon: User },
  { index: 2, endpoint: "GET /experience", label: "experiencia", icon: Briefcase },
  { index: 3, endpoint: "GET /education", label: "educacion", icon: GraduationCap },
  { index: 4, endpoint: "GET /projects", label: "proyectos", icon: Code },
  { index: 5, endpoint: "POST /contact", label: "contacto", icon: Mail },
] as const

function Separator() {
  return (
    <span aria-hidden className="px-2 text-[var(--omarchy-border)]">
      │
    </span>
  )
}

export function Waybar({ activeSection, onSectionChange, onOpenTerminal, onReboot, onShutdown }: WaybarProps) {
  const [time, setTime] = useState<Date | null>(null)
  const [online, setOnline] = useState(true)

  useEffect(() => {
    setTime(new Date())
    const timer = window.setInterval(() => setTime(new Date()), 30000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    const update = () => setOnline(window.navigator.onLine)
    update()
    window.addEventListener("online", update)
    window.addEventListener("offline", update)
    return () => {
      window.removeEventListener("online", update)
      window.removeEventListener("offline", update)
    }
  }, [])

  return (
    <header
      role="banner"
      className="absolute left-0 right-0 top-0 z-50 flex h-8 items-center justify-between border-b border-[var(--omarchy-border)] bg-[var(--omarchy-bg-alt)] px-2 font-mono text-[11px] text-[var(--omarchy-fg)]"
    >
      {/* Workspaces 1-5 → secciones */}
      <div className="flex items-center">
        <span className="om-accent-text hidden pr-2 font-semibold tracking-widest sm:inline">OMARCHY</span>
        <Separator />
        <nav aria-label="Workspaces" className="flex items-center">
          {WORKSPACES.map((workspace) => {
            const active = workspace.endpoint === activeSection
            const Icon = workspace.icon
            return (
              <button
                key={workspace.index}
                type="button"
                aria-current={active ? "page" : undefined}
                aria-label={`Workspace ${workspace.index}: ${workspace.label}`}
                title={`${workspace.index} · ${workspace.label}`}
                onClick={() => onSectionChange(workspace.endpoint)}
                className={`ml-px flex h-6 items-center gap-1 border border-transparent px-2 transition-colors ${
                  active
                    ? "border-[var(--omarchy-accent)] bg-[var(--omarchy-accent)] text-[var(--omarchy-bg)]"
                    : "text-[var(--omarchy-muted)] hover:bg-[var(--omarchy-surface-alt)] hover:text-[var(--omarchy-fg)]"
                }`}
              >
                <span className="tabular-nums">{workspace.index}</span>
                <Icon className="hidden h-3 w-3 md:block" />
                <span className="hidden lg:inline">{workspace.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Centro: título de ventana activa + selector de tema */}
      <div className="flex items-center gap-1">
        <span className="hidden truncate md:inline">
          {WORKSPACES.find((workspace) => workspace.endpoint === activeSection)?.label ?? "escritorio"}
        </span>
        <Separator />
        <ThemeSelector />
      </div>

      {/* Módulos de sistema */}
      <div className="flex items-center">
        <div className="flex items-center gap-1" title={online ? "Red disponible" : "Sin conexión"}>
          {online ? <Wifi className="h-3 w-3 om-accent-text" /> : <WifiOff className="h-3 w-3 text-[var(--omarchy-danger)]" />}
          <span className="hidden sm:inline">{online ? "online" : "offline"}</span>
        </div>
        <Separator />
        <span className="tabular-nums" suppressHydrationWarning>
          {time ? time.toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }) : "--:--"}
        </span>
        <Separator />
        <button
          type="button"
          onClick={onOpenTerminal}
          aria-label="Abrir terminal"
          title="Terminal"
          className="flex h-6 w-6 items-center justify-center text-[var(--omarchy-muted)] hover:bg-[var(--omarchy-surface-alt)] hover:text-[var(--omarchy-fg)]"
        >
          <TerminalSquare className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onReboot}
          aria-label="Reiniciar"
          title="Reiniciar"
          className="flex h-6 w-6 items-center justify-center text-[var(--omarchy-muted)] hover:bg-[var(--omarchy-surface-alt)] hover:text-[var(--omarchy-fg)]"
        >
          <RotateCcw className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={onShutdown}
          aria-label="Apagar"
          title="Apagar"
          className="flex h-6 w-6 items-center justify-center text-[var(--omarchy-muted)] hover:bg-[var(--omarchy-danger)] hover:text-[var(--omarchy-bg)]"
        >
          <Power className="h-3.5 w-3.5" />
        </button>
      </div>
    </header>
  )
}
