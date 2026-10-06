"use client"

import { useEffect, useState } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

interface EnterSystemButtonProps {
  /** "primary" para el hero, "panel" para el bloque de contacto. */
  variant?: "primary" | "panel"
  className?: string
}

/**
 * CTA de la página CV (/cv y cv.danigpascual.dev).
 *
 * - En móvil: nota informativa (no hay escritorio en pantallas pequeñas).
 * - En desktop: enlace al escritorio completo en danigpascual.dev.
 *   Si la página está embebida en un iframe (ventana "CV en línea" del
 *   escritorio), el enlace usa target="_top" para salir del iframe.
 */
export function EnterSystemButton({ className = "" }: EnterSystemButtonProps) {
  const isMobile = useIsMobile()
  const [embedded, setEmbedded] = useState(false)

  useEffect(() => {
    try {
      setEmbedded(window.self !== window.top)
    } catch {
      setEmbedded(true)
    }
  }, [])

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

  return (
    <a
      href="/"
      {...(embedded ? { target: "_top", rel: "noreferrer" } : {})}
      className={`inline-flex items-center justify-center gap-2 border border-[#f5b301] bg-[#f5b301] px-5 py-3 font-mono text-sm text-[#0b0b0c] transition-colors hover:bg-[#f5b301]/85 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b301] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0b0b0c] ${className}`}
    >
      <span aria-hidden>▸</span>Ver escritorio interactivo
    </a>
  )
}
