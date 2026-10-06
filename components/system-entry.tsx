"use client"

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react"
import { BootAnimation } from "@/components/boot-animation"
import { DesktopSession } from "@/components/desktop-session"
import { PWAServiceWorker } from "@/components/pwa-service-worker"
import { useIsMobile } from "@/hooks/use-mobile"

/* Ya no se cachea la visita: el boot se muestra siempre */

interface SystemEntryContextValue {
  /** Entra al escritorio Omarchy (siempre con animación de boot). */
  enter: () => void
  /** true si ya se ha booteado en esta sesión (sólo para el label del botón). */
  isBooted: boolean
}

const SystemEntryContext = createContext<SystemEntryContextValue>({
  enter: () => {},
  isBooted: false,
})

export function useSystemEntry() {
  return useContext(SystemEntryContext)
}

type Stage = "landing" | "boot" | "desktop"

/**
 * Decide entre landing SSR y escritorio Omarchy.
 *
 * - La landing siempre se renderiza en el servidor (SEO).
 * - El escritorio sólo arranca a petición (botón "Bootea el sistema").
 * - La animación de boot se muestra SIEMPRE al entrar (se puede saltar con ESC).
 * - En móvil (<768px) nunca se entra al escritorio; se muestra aviso.
 */
export function SystemEntry({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  const [stage, setStage] = useState<Stage>("landing")
  const [isBooted, setIsBooted] = useState(false)

  const enter = useCallback(() => {
    if (isMobile) return
    setStage("boot")
  }, [isMobile])

  const handleBootComplete = useCallback(() => {
    setIsBooted(true)
    setStage("desktop")
  }, [])

  const value = useMemo<SystemEntryContextValue>(() => ({ enter, isBooted }), [enter, isBooted])

  return (
    <SystemEntryContext.Provider value={value}>
      <PWAServiceWorker />
      {stage === "desktop" ? (
        <DesktopSession />
      ) : stage === "boot" ? (
        <BootAnimation onComplete={handleBootComplete} />
      ) : (
        children
      )}
    </SystemEntryContext.Provider>
  )
}
