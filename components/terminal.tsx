"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "@/components/theme-system"
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
  const { theme } = useTheme()

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

  const commands = {
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

    about: () => `Daniel González Pascual
Desarrollador Backend especializado en Python
📍 Málaga, España
🎯 2+ años de experiencia
🚀 Apasionado por crear soluciones eficientes`,

    skills: () => `Habilidades Técnicas:
• Backend: Python (FastAPI, Flask, Django), Node.js
• Frontend: React, Next.js, TypeScript
• Bases de Datos: MySQL, PostgreSQL, Oracle
• DevOps: Docker, Kubernetes, CI/CD
• Otros: Odoo, WordPress`,

    experience: () => `Experiencia Laboral:
• Desarrollador Backend en Aftalia (2022 - Presente)
• ...`,

    projects: () => `Proyectos Realizados:
• Portfolio personal con Next.js y TypeScript
• ...`,

    education: () => `Formación Académica:
• Grado en Ingeniería de Software - Universidad de Málaga (2018 - 2022)
• ...`,

    contact: () => `Información de Contacto:
• Email: daniel.gonzalez.pascual@email.com
• LinkedIn: linkedin.com/in/daniel-gonzalez-pascual
• GitHub: github.com/daniel-gonzalez-pascual`,

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
    <div className={`absolute ${isMaximized ? "inset-8" : "top-1/4 left-1/4 w-1/2 h-1/2"} rounded-lg shadow-2xl border overflow-hidden transition-all duration-300 bg-black text-white font-mono text-sm flex flex-col`}>
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <button
            className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
            onClick={onClose}
          ></button>
          <button
            className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
            onClick={handleMinimize}
          ></button>
          <button
            className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
            onClick={handleMaximize}
          ></button>
        </div>
        <span className="text-xs">daniel@portfolio: ~</span>
        <div className="flex items-center space-x-2">
            <button
              className={`p-1 rounded transition-colors hover:bg-gray-600`}
              onClick={handleMinimize}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded transition-colors hover:bg-gray-600`}
              onClick={handleMaximize}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded transition-colors hover:bg-gray-600`}
              onClick={onClose}
            >
              <X className="w-4 h-4" />
            </button>
        </div>
      </div>
      <div className="flex-grow p-4 overflow-y-auto" onClick={() => inputRef.current?.focus()}>
        {history.map((item, index) => (
          <div key={index} className="mb-4">
            <div className="flex items-center">
              <span className="text-green-400">daniel@portfolio:~$</span>
              <span className="ml-2">{item.command}</span>
            </div>
            <div className="whitespace-pre-wrap">{item.output}</div>
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-green-400">daniel@portfolio:~$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className="bg-transparent border-none focus:ring-0 focus:outline-none w-full ml-2"
          />
        </div>
      </div>
    </div>
  )
}
