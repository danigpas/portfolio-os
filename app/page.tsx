"use client"

import { useState, useEffect } from "react"
import { BootAnimation } from "@/components/boot-animation"
import { UbuntuDesktop } from "@/components/ubuntu-desktop"
import { PostmanApp } from "@/components/postman-app"
import { PWAServiceWorker } from "@/components/pwa-service-worker"
import { Terminal as TerminalComponent } from "@/components/terminal"
import { useIsMobile } from "@/hooks/use-mobile"
import AndroidLauncher from "@/components/mobile/AndroidLauncher"

export default function Home() {
  const isMobile = useIsMobile()
  const [bootComplete, setBootComplete] = useState(false)
  const [appLaunched, setAppLaunched] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [activeSection, setActiveSection] = useState("GET /about")
  const [isSuspended, setIsSuspended] = useState(false)
  const [showShutdownConfirmation, setShowShutdownConfirmation] = useState(false)

  const handleReboot = () => {
    setBootComplete(false)
    setAppLaunched(false)
    setIsMinimized(false)
    setActiveSection("GET /about")
  }

  const handleSuspend = () => {
    setIsSuspended(true)
  }

  const handleResume = () => {
    setIsSuspended(false)
  }

  const handleShutdown = () => {
    setShowShutdownConfirmation(true)
  }

  const confirmShutdown = () => {
    setShowShutdownConfirmation(false)
    handleReboot()
  }

  const cancelShutdown = () => {
    setShowShutdownConfirmation(false)
  }

  useEffect(() => {
    if (isMobile) {
      setBootComplete(true) // No hay animación de arranque en móvil
      return
    }
    if (!bootComplete) {
      const bootTimer = setTimeout(() => {
        setBootComplete(true)
        // Auto-launch app after desktop loads
        const appTimer = setTimeout(() => {
          setAppLaunched(true)
        }, 2000)
        return () => clearTimeout(appTimer)
      }, 6000)

      return () => clearTimeout(bootTimer)
    }
  }, [bootComplete, isMobile])

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    // Si la app está minimizada, la restauramos cuando se hace clic en el dock
    if (isMinimized) {
      setIsMinimized(false)
    }
    // Si la app no está lanzada, la lanzamos
    if (!appLaunched) {
      setAppLaunched(true)
    }
  }

  const handleMinimize = () => {
    setIsMinimized(true)
  }

  const handleMaximize = () => {
    setIsMinimized(false)
  }

  const handleClose = () => {
    setAppLaunched(false)
    setIsMinimized(false)
  }

  const handleCloseTerminal = () => {
    setShowTerminal(false)
  }

  const handleOpenTerminal = () => {
    setAppLaunched(false) // Close PostmanApp
    setShowTerminal(true)
  }

  const handleOpenPostmanApp = () => {
    setShowTerminal(false) // Close Terminal
    setAppLaunched(true)
  }

  if (isMobile === undefined) {
    return null // O un spinner de carga, para evitar un flash de contenido incorrecto
  }

  if (isMobile) {
    return <AndroidLauncher />
  }

  return (
    <>
      <PWAServiceWorker />
      {showShutdownConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white text-black p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Apagar</h2>
            <p className="mb-4">En este caso tras apagarse se volvera a iniciar el sistema operativo de forma automatica.</p>
            <div className="flex justify-center space-x-4">
              <button onClick={confirmShutdown} className="bg-red-500 text-white px-4 py-2 rounded">Apagar</button>
              <button onClick={cancelShutdown} className="bg-gray-300 px-4 py-2 rounded">Cancelar</button>
            </div>
          </div>
        </div>
      )}
      {isSuspended && (
        <div
          className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center text-white font-mono"
          onClick={handleResume}
          onKeyPress={(e) => e.key === 'Enter' && handleResume()}
          tabIndex={0}
        >
          <img src="/daniel-gonzalez-pascual-portrait.png" alt="Daniel González Pascual" className="w-40 h-40 rounded-full mb-4" />
          <h2 className="text-2xl font-bold">Daniel González Pascual</h2>
          <p className="text-lg">Desarrollador Backend Python</p>
          <p className="mt-8">Haz click o pulsa Enter para desbloquear el equipo o la pantalla.</p>
        </div>
      )}
      {!bootComplete ? (
        <BootAnimation onComplete={() => setBootComplete(true)} />
      ) : (
        <UbuntuDesktop onSectionChange={handleSectionChange} onReboot={handleReboot} onSuspend={handleSuspend} onShutdown={handleShutdown} onOpenTerminal={handleOpenTerminal} onOpenPostmanApp={handleOpenPostmanApp} onCloseTerminal={handleCloseTerminal}>
          {appLaunched && !isMinimized && (
            <PostmanApp
              onMinimize={handleMinimize}
              onMaximize={handleMaximize}
              onClose={handleClose}
              initialSection={activeSection}
            />
          )}
          {showTerminal && (
            <TerminalComponent
              onClose={handleCloseTerminal}
              onReboot={handleReboot}
              onSuspend={handleSuspend}
              onShutdown={handleShutdown}
              onMinimize={() => setShowTerminal(false)}
            />
          )}
        </UbuntuDesktop>
      )}
    </>
  )
}
