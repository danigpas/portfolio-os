"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import { useTheme } from "@/components/theme-system"
import { useLanguage } from "@/components/language-provider"
import { getCvData } from "@/lib/cv-data"
import { APP_NAMES, THEME_NAMES } from "@/lib/omarchy-config"

export interface TerminalProps {
  onClose?: () => void
  onOpenApp?: (app: string) => void
  onNavigate?: (section: string) => void
  onDownloadCv?: () => void
  onSetTheme?: (theme: string) => boolean
  onReboot?: () => void
  onSuspend?: () => void
  onShutdown?: () => void
}

interface TerminalEntry {
  id: number
  command: string
  output: string
}

export function Terminal({
  onOpenApp,
  onNavigate,
  onDownloadCv,
  onSetTheme,
  onReboot,
  onSuspend,
  onShutdown,
}: TerminalProps) {
  const { language } = useLanguage()
  const { theme } = useTheme()
  const cv = useMemo(() => getCvData(language), [language])

  const [input, setInput] = useState("")
  const [entries, setEntries] = useState<TerminalEntry[]>([])
  const [commandLog, setCommandLog] = useState<string[]>([])
  const [navIndex, setNavIndex] = useState<number | null>(null)
  const entryIdRef = useRef(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const corpus = {
    help: () => `Comandos disponibles:
  help              Muestra esta ayuda
  about             Abre la sección Sobre mí
  experience        Abre Experiencia
  projects          Abre Proyectos
  education         Abre Educación
  contact           Abre Contacto
  cv --download     Descarga el CV en PDF
  theme             Lista los temas disponibles
  theme <nombre>    Cambia el tema del sistema
  open <app>        Abre una app (${APP_NAMES.join(", ")})
  clear             Limpia la terminal
  whoami            Usuario actual
  reboot            Reinicia el sistema
  suspend           Suspende la sesión
  shutdown          Apaga el sistema`,
    about: () => {
      onNavigate?.("GET /about")
      onOpenApp?.("postman")
      return `${cv.about.name}\n${cv.about.role}\n${cv.contact.location}\n${cv.about.yearsOfExperience} · ${cv.about.tagline}`
    },
    experience: () => {
      onNavigate?.("GET /experience")
      onOpenApp?.("postman")
      return `Experiencia:\n${cv.experience
        .map((job) => `  • ${job.role} @ ${job.company} (${job.period})`)
        .join("\n")}`
    },
    projects: () => {
      onNavigate?.("GET /projects")
      onOpenApp?.("postman")
      return `Proyectos:\n${cv.projects.map((project) => `  • ${project.name}: ${project.description}`).join("\n")}`
    },
    education: () => {
      onNavigate?.("GET /education")
      onOpenApp?.("postman")
      return `Formación:\n${cv.education
        .map((item) => `  • ${item.title} — ${item.institution} (${item.period})`)
        .join("\n")}`
    },
    contact: () => {
      onNavigate?.("POST /contact")
      onOpenApp?.("postman")
      return `Contacto:\n  • Email: ${cv.contact.email}\n  • LinkedIn: ${cv.contact.linkedin}\n  • GitHub: ${cv.contact.github}`
    },
    skills: () => `Habilidades:\n${cv.skills.map((group) => `  • ${group.category}: ${group.items.join(", ")}`).join("\n")}`,
  }

  useEffect(() => {
    setEntries([
      {
        id: entryIdRef.current++,
        command: "",
        output: `${cv.about.name} · terminal v2.0\n${cv.about.role} · ${cv.contact.location}\nEscribe 'help' para ver los comandos. Ctrl+K abre el lanzador.`,
      },
    ])
    // Sólo el mensaje de bienvenida inicial.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const node = scrollRef.current
    if (node) node.scrollTop = node.scrollHeight
  }, [entries])

  const append = (command: string, output: string) => {
    setEntries((current) => [...current, { id: entryIdRef.current++, command, output }])
  }

  const runCommand = (raw: string): string => {
    const trimmed = raw.trim()
    if (!trimmed) return ""
    const [head, ...args] = trimmed.split(/\s+/)
    const command = head.toLowerCase()
    const rest = args.join(" ").toLowerCase()

    if (command === "clear") {
      setEntries([])
      return ""
    }
    if (command === "whoami") return "guest"
    if (command === "sudo") return "guest no está en el fichero sudoers. Este incidente será reportado."
    if (command === "theme") {
      if (!rest) return `Tema actual: ${theme}\nDisponibles: ${THEME_NAMES.join(", ")}`
      const changed = onSetTheme?.(rest)
      if (changed === false) {
        return `Tema no válido: '${rest}'.\nTemas válidos: ${THEME_NAMES.join(", ")}.`
      }
      return `Tema cambiado a '${rest}'.`
    }
    if (command === "cv") {
      if (rest === "--download" || rest === "") {
        onDownloadCv?.()
        return "Descargando CV…"
      }
      return "Uso: cv --download"
    }
    if (command === "open") {
      if (!rest) return `Uso: open <app>. Apps: ${APP_NAMES.join(", ")}`
      onOpenApp?.(rest)
      return `Abriendo '${rest}'…`
    }
    if (command === "reboot") {
      onReboot?.()
      return "Reiniciando el sistema…"
    }
    if (command === "suspend") {
      onSuspend?.()
      return "Suspendiendo la sesión…"
    }
    if (command === "shutdown") {
      onShutdown?.()
      return "Apagando el sistema…"
    }

    const handler = corpus[command as keyof typeof corpus]
    if (handler) return handler()
    return `Comando no encontrado: ${trimmed}. Escribe 'help'.`
  }

  const submit = () => {
    const value = input.trim()
    if (!value) return
    const output = runCommand(value)
    if (value.toLowerCase() !== "clear") {
      append(value, output)
      setCommandLog((current) => [...current, value])
    }
    setInput("")
    setNavIndex(null)
  }

  const completions = (): string[] => {
    const tokens = input.split(/\s+/)
    if (tokens.length <= 1) {
      return ["help", "about", "experience", "projects", "education", "contact", "skills", "cv --download", "theme", "open", "reboot", "suspend", "shutdown", "clear", "whoami"].filter((candidate) =>
        candidate.startsWith(input.trim().toLowerCase()),
      )
    }
    if (tokens[0] === "theme") {
      return THEME_NAMES.filter((name) => name.startsWith(tokens[tokens.length - 1].toLowerCase()))
    }
    if (tokens[0] === "open") {
      return APP_NAMES.filter((name) => name.startsWith(tokens[tokens.length - 1].toLowerCase()))
    }
    return []
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault()
      submit()
      return
    }
    if (event.key === "ArrowUp") {
      event.preventDefault()
      if (commandLog.length === 0) return
      const nextIndex = navIndex === null ? commandLog.length - 1 : Math.max(0, navIndex - 1)
      setNavIndex(nextIndex)
      setInput(commandLog[nextIndex])
      return
    }
    if (event.key === "ArrowDown") {
      event.preventDefault()
      if (navIndex === null) return
      const nextIndex = navIndex + 1
      if (nextIndex >= commandLog.length) {
        setNavIndex(null)
        setInput("")
      } else {
        setNavIndex(nextIndex)
        setInput(commandLog[nextIndex])
      }
      return
    }
    if (event.key === "Tab") {
      event.preventDefault()
      const matches = completions()
      if (matches.length === 1) {
        const tokens = input.split(/\s+/)
        if (tokens.length <= 1) setInput(matches[0])
        else setInput(`${tokens.slice(0, -1).join(" ")} ${matches[0]}`)
      } else if (matches.length > 1) {
        append(input, matches.join("  "))
      }
    }
  }

  return (
    <div className="flex h-full flex-col bg-[var(--omarchy-bg,#0d0d10)] font-[family-name:var(--font-jetbrains-mono),ui-monospace,monospace] text-sm text-[var(--omarchy-fg,#e6e6e6)]">
      <div
        ref={scrollRef}
        role="log"
        aria-label="Salida de la terminal"
        aria-live="polite"
        className="flex-1 overflow-y-auto p-4"
        onClick={() => inputRef.current?.focus()}
      >
        {entries.map((entry) => (
          <div key={entry.id} className="mb-3 whitespace-pre-wrap">
            {entry.command ? (
              <div className="flex">
                <span className="text-[var(--omarchy-accent,#4ade80)]">daniel@portfolio:~$</span>
                <span className="ml-2">{entry.command}</span>
              </div>
            ) : null}
            {entry.output ? <div className="text-[var(--omarchy-fg,#d4d4d8)]">{entry.output}</div> : null}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-[var(--omarchy-accent,#4ade80)]">daniel@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(event) => {
              setInput(event.target.value)
              setNavIndex(null)
            }}
            onKeyDown={handleKeyDown}
            aria-label="Entrada de comandos"
            autoComplete="off"
            spellCheck={false}
            className="ml-2 w-full border-none bg-transparent outline-none"
          />
        </div>
      </div>
    </div>
  )
}
