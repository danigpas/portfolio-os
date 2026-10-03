"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { BootAnimation } from "@/components/boot-animation"
import { DesktopSession } from "@/components/desktop-session"
import { PWAServiceWorker } from "@/components/pwa-service-worker"
import { useIsMobile } from "@/hooks/use-mobile"

const VISITED_KEY = "omarchyVisited"

interface SystemEntryContextValue {
  /** Entra al escritorio Omarchy (con boot la primera vez de la sesión). */
  enter: () => void
  /** true si ya se ha booteado en esta sesión. */
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
 * - La animación de boot se muestra únicamente la primera vez de la sesión:
 *   después `sessionStorage.omarchyVisited=true` entra directo.
 * - En móvil (<768px) nunca se entra al escritorio; se muestra aviso.
 */
export function SystemEntry({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  const [stage, setStage] = useState<Stage>("landing")
  const [isBooted, setIsBooted] = useState(false)

  useEffect(() => {
    const visited = window.sessionStorage.getItem(VISITED_KEY) === "true"
    setIsBooted(visited)
    if (visited && !isMobile) {
      setStage("desktop")
    } else if (isMobile) {
      setStage("landing")
    }
  }, [isMobile])

  const enter = useCallback(() => {
    if (isMobile) return
    const visited = window.sessionStorage.getItem(VISITED_KEY) === "true"
    setIsBooted(visited)
    setStage(visited ? "desktop" : "boot")
  }, [isMobile])

  const handleBootComplete = useCallback(() => {
    window.sessionStorage.setItem(VISITED_KEY, "true")
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
