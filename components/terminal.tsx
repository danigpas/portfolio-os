"use client"

import { useState, useEffect, useRef } from "react"
import { getCvData } from "@/lib/cv-data"
import { X, Minimize2, Maximize2 } from "lucide-react"

interface TerminalProps {
  onClose: () => void
  onMinimize?: () => void
  onMaximize?: () => void
  onReboot?: () => void
  onSuspend?: () => void
  onShutdown?: () => void
}

export function Terminal({ onClose, onMinimize, onMaximize, onReboot, onSuspend, onShutdown }: TerminalProps) {


  const [input, setInput] = useState("")
  const [history, setHistory] = useState<Array<{ command: string; output: string; timestamp: Date }>>([])
  const [isMaximized, setIsMaximized] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const cv = getCvData("es")

  useEffect(() => {
    // Welcome message
    setHistory([
      {
        command: "",
        output: `Daniel González Pascual Terminal v1.0
Desarrollador Backend Python | Málaga, España
Escribe 'help' para ver comandos disponibles`,
        timestamp: new Date(),
      },
    ])
  }, [])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  const commands: Record<string, () => string> = {
    help: () => `Comandos disponibles:
• about - Información personal
• skills - Habilidades técnicas
• experience - Experiencia laboral
• projects - Proyectos realizados
• education - Formación académica
• contact - Información de contacto
• git status - Estado del repositorio
• python --version - Versión de Python
• docker ps - Contenedores activos
• clear - Limpiar terminal
• whoami - Usuario actual
• reboot - Reiniciar el sistema
• suspend - Suspender la sesión
• shutdown - Apagar el sistema`,

    about: () => `${cv.about.name}
${cv.about.role}
📍 ${cv.contact.location}
🎯 ${cv.about.yearsOfExperience} de experiencia
🚀 ${cv.about.tagline}`,

    skills: () => `Habilidades Técnicas:
${cv.skills.map((group) => `• ${group.category}: ${group.items.join(", ")}`).join("\n")}`,

    experience: () => `Experiencia Laboral:
${cv.experience
      .map((job) => `• ${job.role} en ${job.company} (${job.period})`)
      .join("\n")}`,

    projects: () => `Proyectos Realizados:
${cv.projects.map((project) => `• ${project.name}: ${project.description}`).join("\n")}`,

    education: () => `Formación Académica:
${cv.education
      .map((item) => `• ${item.title} - ${item.institution} (${item.period})`)
      .join("\n")}`,

    contact: () => `Información de Contacto:
• Email: ${cv.contact.email}
• LinkedIn: ${cv.contact.linkedin.replace("https://", "")}
• GitHub: ${cv.contact.github.replace("https://", "")}`,

    "git status": () => `On branch main
Your branch is up to date with 'origin/main'.

nothing to commit, working tree clean`,

    "python --version": () => `Python 3.10.4`,

    "docker ps": () => `CONTAINER ID   IMAGE     COMMAND   CREATED   STATUS    PORTS     NAMES`,

    clear: () => {
      setHistory([])
      return ""
    },

    whoami: () => `guest`,

    reboot: () => {
      if (onReboot) {
        onReboot()
      }
      return "Reiniciando..."
    },

    suspend: () => {
      if (onSuspend) {
        onSuspend()
      }
      return "Suspendiendo..."
    },

    shutdown: () => {
      if (onShutdown) {
        onShutdown()
      }
      return "Apagando..."
    },
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
  }

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      const command = input.trim().toLowerCase()
      if (command) {
        const output = commands[command]?.() || `Comando no encontrado: ${command}`
        setHistory([...history, { command, output, timestamp: new Date() }])
        setInput("")
      }
    }
  }

  const handleMinimize = () => {
    if (onMinimize) onMinimize()
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    if (onMaximize) onMaximize()
  }

  return (
    <div className={`om-window absolute ${isMaximized ? "inset-8 z-40" : "top-1/4 left-1/4 h-1/2 w-1/2 z-30"} flex flex-col overflow-hidden border font-mono text-sm shadow-2xl transition-all duration-300`}>
      <div className="flex items-center justify-between border-b border-[var(--omarchy-border)] bg-[var(--omarchy-surface)] px-4 py-2">
        <div className="flex items-center gap-2">
          <button
            aria-label="Cerrar terminal"
            className="h-3 w-3 rounded-none border border-[var(--omarchy-border)] bg-[var(--omarchy-danger)] transition-opacity hover:opacity-80"
            onClick={onClose}
          ></button>
          <button
            aria-label="Minimizar terminal"
            className="h-3 w-3 rounded-none border border-[var(--omarchy-border)] bg-[var(--omarchy-warning)] transition-opacity hover:opacity-80"
            onClick={handleMinimize}
          ></button>
          <button
            aria-label="Maximizar terminal"
            className="h-3 w-3 rounded-none border border-[var(--omarchy-border)] bg-[var(--omarchy-success)] transition-opacity hover:opacity-80"
            onClick={handleMaximize}
          ></button>
        </div>
        <span className="text-xs om-muted-text">daniel@omarchy: ~</span>
        <div className="flex items-center gap-2">
            <button
              className="p-1 transition-colors hover:bg-[var(--omarchy-surface-alt)]"
              onClick={handleMinimize}
            >
              <Minimize2 className="h-4 w-4" />
            </button>
            <button
              className="p-1 transition-colors hover:bg-[var(--omarchy-surface-alt)]"
              onClick={handleMaximize}
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <button
              className="p-1 transition-colors hover:bg-[var(--omarchy-surface-alt)]"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </button>
        </div>
      </div>
      <div className="om-scrollbar flex-grow overflow-y-auto p-4" onClick={() => inputRef.current?.focus()}>
        {history.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center">
              <span className="text-[var(--omarchy-success)]">daniel@omarchy:~$</span>
              <span className="ml-2">{item.command}</span>
            </div>
            <div className="whitespace-pre-wrap text-[var(--omarchy-fg)]">{item.output}</div>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-[var(--omarchy-success)]">daniel@omarchy:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="ml-2 w-full border-none bg-transparent text-[var(--omarchy-fg)] focus:outline-none focus:ring-0"
          />
        </div>
      </div>
    </div>
  )
}
