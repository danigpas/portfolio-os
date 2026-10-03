"use client"

import { useIsMobile } from "@/hooks/use-mobile"
import { useSystemEntry } from "@/components/system-entry"

interface EnterSystemButtonProps {
  /** "primary" para el hero, "panel" para el bloque de contacto. */
  variant?: "primary" | "panel"
  className?: string
}

export function EnterSystemButton({ variant = "primary", className = "" }: EnterSystemButtonProps) {
  const { enter, isBooted } = useSystemEntry()
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <p
        className="border border-dashed border-[#29292f] px-4 py-3 font-mono text-xs leading-relaxed text-[#9b9ba4]"
        role="note"
      >
        El escritorio Omarchy está pensado para pantallas de 768px o más. En móvil tienes toda la información en esta
        versión lineal.
      </p>
    )
  }

  const base =
    "inline-flex items-center justify-center gap-2 border px-5 py-3 font-mono text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b301] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0c]"
  const styles =
    variant === "panel"
      ? "border-[#7ee787]/50 text-[#7ee787] hover:bg-[#7ee787] hover:text-[#0b0b0c]"
      : "border-[#f5b301] bg-[#f5b301] text-[#0b0b0c] hover:bg-[#f5b301]/85"

  return (
    <button type="button" onClick={enter} className={`${base} ${styles} ${className}`}>
      <span aria-hidden>▸</span>
      {isBooted ? "Abrir escritorio" : "Bootea el sistema"}
    </button>
  )
}
