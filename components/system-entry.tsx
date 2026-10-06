"use client"

import { useCallback, useEffect, useState, type ReactNode } from "react"
import { BootAnimation } from "@/components/boot-animation"
import { DesktopSession } from "@/components/desktop-session"
import { PWAServiceWorker } from "@/components/pwa-service-worker"
import { useIsMobile } from "@/hooks/use-mobile"

type Stage = "landing" | "boot" | "desktop"

/**
 * Decide entre landing SSR y escritorio Omarchy.
 *
 * - La landing (CV en línea) se renderiza en el servidor (SEO y móvil) y
 *   sigue disponible en /cv y en cv.danigpascual.dev.
 * - Al entrar en danigpascual.dev se va DIRECTO al boot del sistema:
 *   animación de arranque (skipeable con ESC) → escritorio Omarchy.
 * - En móvil (<768px) nunca se entra al escritorio; se muestra el CV lineal.
 */
export function SystemEntry({ children }: { children: ReactNode }) {
  const isMobile = useIsMobile()
  const [stage, setStage] = useState<Stage>("landing")

  useEffect(() => {
    if (!isMobile) {
      setStage("boot")
    }
  }, [isMobile])

  const handleBootComplete = useCallback(() => {
    setStage("desktop")
  }, [])

  return (
    <>
      <PWAServiceWorker />
      {stage === "desktop" ? (
        <DesktopSession />
      ) : stage === "boot" ? (
        <BootAnimation onComplete={handleBootComplete} />
      ) : (
        children
      )}
    </>
  )
}
