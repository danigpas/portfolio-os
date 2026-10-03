"use client"

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { CornerDownLeft, Search } from "lucide-react"
import { useFocusTrap } from "@/hooks/use-focus-trap"

export interface RofiCommand {
  id: string
  label: string
  hint?: string
  group?: string
  icon?: ReactNode
  keywords?: string[]
  run: () => void
}

interface RofiLauncherProps {
  open: boolean
  onClose: () => void
  commands: RofiCommand[]
  placeholder?: string
}

/**
 * Filtro difusa sencilla (subsecuencia ordenada) con puntuación.
 * Devuelve null si no hay coincidencia.
 */
function fuzzyScore(query: string, target: string): number | null {
  if (!query) return 0
  const q = query.toLowerCase()
  const t = target.toLowerCase()
  let score = 0
  let queryIndex = 0
  let lastMatch = -1
  for (let i = 0; i < t.length && queryIndex < q.length; i += 1) {
    if (t[i] === q[queryIndex]) {
      score += lastMatch === i - 1 ? 8 : 2
      if (i === 0 || /[\s/·-]/.test(t[i - 1])) score += 6
      lastMatch = i
      queryIndex += 1
    }
  }
  if (queryIndex < q.length) return null
  // Penaliza objetivos largos para preferir coincidencias compactas.
  return score - t.length * 0.05
}

export function RofiLauncher({ open, onClose, commands, placeholder = "Buscar comando…" }: RofiLauncherProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)

  useFocusTrap(containerRef, open)

  const filtered = useMemo(() => {
    const scored = commands
      .map((command) => {
        const haystack = [command.label, command.hint ?? "", command.group ?? "", ...(command.keywords ?? [])].join(" ")
        return { command, score: fuzzyScore(query, haystack) }
      })
      .filter((entry): entry is { command: RofiCommand; score: number } => entry.score !== null)
      .sort((a, b) => b.score - a.score)
    return scored.map((entry) => entry.command)
  }, [commands, query])

  useEffect(() => {
    if (!open) return
    setQuery("")
    setActiveIndex(0)
    const id = window.setTimeout(() => inputRef.current?.focus(), 0)
    return () => window.clearTimeout(id)
  }, [open])

  useEffect(() => {
    setActiveIndex((current) => (filtered.length === 0 ? 0 : Math.min(current, filtered.length - 1)))
  }, [filtered])

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const active = list.querySelector<HTMLElement>('[data-active="true"]')
    active?.scrollIntoView({ block: "nearest" })
  }, [activeIndex, filtered])

  if (!open) return null

  const runCommand = (command: RofiCommand) => {
    onClose()
    command.run()
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setActiveIndex((current) => (filtered.length === 0 ? 0 : (current + 1) % filtered.length))
        break
      case "ArrowUp":
        event.preventDefault()
        setActiveIndex((current) => (filtered.length === 0 ? 0 : (current - 1 + filtered.length) % filtered.length))
        break
      case "Home":
        event.preventDefault()
        setActiveIndex(0)
        break
      case "End":
        event.preventDefault()
        setActiveIndex(Math.max(0, filtered.length - 1))
        break
      case "Enter": {
        event.preventDefault()
        const command = filtered[activeIndex]
        if (command) runCommand(command)
        break
      }
      case "Escape":
        event.preventDefault()
        onClose()
        break
      default:
        break
    }
  }

  return (
    <div
      className="fixed inset-0 z-[300] flex items-start justify-center bg-black/60 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-label="Lanzador de comandos"
        className="w-full max-w-xl overflow-hidden rounded-sm border border-[var(--omarchy-border,#2a2a2e)] bg-[var(--omarchy-panel,#0d0d10)] font-[family-name:var(--font-jetbrains-mono),ui-monospace,monospace] text-[var(--omarchy-fg,#e6e6e6)] shadow-[0_24px_80px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center gap-2 border-b border-[var(--omarchy-border,#2a2a2e)] px-3 py-2">
          <span className="text-[var(--omarchy-accent,#7aa2f7)]" aria-hidden="true">
            &gt;
          </span>
          <Search className="h-3.5 w-3.5 text-[var(--omarchy-muted,#8b8b93)]" aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            role="combobox"
            aria-expanded="true"
            aria-controls="rofi-results"
            aria-activedescendant={filtered[activeIndex] ? `rofi-item-${filtered[activeIndex].id}` : undefined}
            aria-label="Buscar comando"
            placeholder={placeholder}
            autoComplete="off"
            spellCheck={false}
            className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--omarchy-muted,#8b8b93)]"
          />
          <span className="shrink-0 text-[10px] uppercase tracking-widest text-[var(--omarchy-muted,#8b8b93)]">
            ctrl+k
          </span>
        </div>

        <ul
          ref={listRef}
          id="rofi-results"
          role="listbox"
          aria-label="Resultados"
          className="max-h-[46vh] overflow-y-auto py-1"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-6 text-center text-xs text-[var(--omarchy-muted,#8b8b93)]">Sin resultados</li>
          ) : (
            filtered.map((command, index) => {
              const isActive = index === activeIndex
              return (
                <li key={command.id} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    id={`rofi-item-${command.id}`}
                    data-active={isActive}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => runCommand(command)}
                    className={`flex w-full items-center gap-3 px-3 py-2 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--omarchy-accent,#7aa2f7)] ${
                      isActive
                        ? "border-l-2 border-l-[var(--omarchy-accent,#7aa2f7)] bg-[var(--omarchy-accent,#7aa2f7)]/10 text-[var(--omarchy-accent,#7aa2f7)]"
                        : "border-l-2 border-l-transparent text-[var(--omarchy-fg,#e6e6e6)]"
                    }`}
                  >
                    {command.icon ? (
                      <span className="shrink-0 text-[var(--omarchy-accent,#7aa2f7)]" aria-hidden="true">
                        {command.icon}
                      </span>
                    ) : null}
                    <span className="min-w-0 flex-1">
                      <span className="block truncate">{command.label}</span>
                      {command.hint ? (
                        <span className="block truncate text-[11px] text-[var(--omarchy-muted,#8b8b93)]">
                          {command.hint}
                        </span>
                      ) : null}
                    </span>
                    {command.group ? (
                      <span className="shrink-0 text-[10px] uppercase tracking-widest text-[var(--omarchy-muted,#8b8b93)]">
                        {command.group}
                      </span>
                    ) : null}
                    {isActive ? <CornerDownLeft className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
                  </button>
                </li>
              )
            })
          )}
        </ul>

        <div className="flex items-center justify-between border-t border-[var(--omarchy-border,#2a2a2e)] px-3 py-1.5 text-[10px] uppercase tracking-widest text-[var(--omarchy-muted,#8b8b93)]">
          <span>↑ ↓ navegar · enter ejecutar</span>
          <span>esc cerrar</span>
        </div>
      </div>
    </div>
  )
}
