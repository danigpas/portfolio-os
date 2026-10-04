"use client"

/**
 * CvWebWindow — ventana "CV en línea" del escritorio Omarchy.
 *
 * Embebe la web-curriculum en un iframe con una barra de estilo Omarchy
 * (URL + abrir en pestaña nueva). Si el origen bloquea el embebido
 * (X-Frame-Options) o está protegido por auth, la barra ofrece siempre la
 * salida por pestaña nueva.
 */

import { ExternalLink, Globe } from "lucide-react"
import { CV_WEB_URL } from "@/lib/omarchy-config"

export function CvWebWindow() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-[var(--omarchy-bg,#1a1b26)] text-[var(--omarchy-fg,#c0caf5)]">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--omarchy-border,#2a2b3d)] bg-[var(--omarchy-surface,#141419)] px-3 py-2">
        <div className="flex min-w-0 items-center gap-2 font-[family-name:var(--font-jetbrains-mono),ui-monospace,monospace] text-xs">
          <Globe className="h-3.5 w-3.5 shrink-0 text-[var(--omarchy-accent,#7aa2f7)]" aria-hidden="true" />
          <span className="truncate text-[var(--omarchy-muted,#9aa5ce)]">{CV_WEB_URL}</span>
        </div>
        <a
          href={CV_WEB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-sm border border-[var(--omarchy-border,#2a2b3d)] px-2 py-1 text-xs transition-colors hover:bg-[var(--omarchy-surface-alt,#1f2033)]"
          aria-label="Abrir CV en línea en una pestaña nueva"
        >
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
          Pestaña nueva
        </a>
      </div>
      <div className="min-h-0 flex-1">
        <iframe
          src={CV_WEB_URL}
          title="CV en línea de Daniel González Pascual"
          className="h-full w-full border-0 bg-white"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      </div>
      <div className="border-t border-[var(--omarchy-border,#2a2b3d)] px-3 py-1.5 font-[family-name:var(--font-jetbrains-mono),ui-monospace,monospace] text-[10px] text-[var(--omarchy-muted,#9aa5ce)]">
        Si el contenido no carga, el origen bloquea el embebido: usa «Pestaña nueva».
      </div>
    </div>
  )
}
