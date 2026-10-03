"use client"

import { useState } from "react"
import { UbuntuDesktop } from "@/components/ubuntu-desktop"
import { PostmanApp } from "@/components/postman-app"
import { Terminal as TerminalComponent } from "@/components/terminal"

/**
 * Sesión del escritorio Omarchy (shell, ventanas y estados de energía).
 * No rediseña nada: conserva el comportamiento actual, pero ya no fuerza boot.
 */
export function DesktopSession() {
  const [appLaunched, setAppLaunched] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showTerminal, setShowTerminal] = useState(false)
  const [activeSection, setActiveSection] = useState("GET /about")
  const [isSuspended, setIsSuspended] = useState(false)
  const [showShutdownConfirmation, setShowShutdownConfirmation] = useState(false)

  const handleReboot = () => {
    setAppLaunched(false)
    setIsMinimized(false)
    setShowTerminal(false)
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

  const handleSectionChange = (section: string) => {
    setActiveSection(section)
    setIsMinimized(false)
    setAppLaunched(true)
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
    setAppLaunched(false)
    setShowTerminal(true)
  }

  const handleOpenPostmanApp = () => {
    setShowTerminal(false)
    setAppLaunched(true)
  }

  return (
    <>
      {showShutdownConfirmation && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center">
          <div className="bg-white text-black p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Apagar</h2>
            <p className="mb-4">
              En este caso tras apagarse se volverá a iniciar el sistema operativo de forma automática.
            </p>
            <div className="flex justify-center space-x-4">
              <button onClick={confirmShutdown} className="bg-red-500 text-white px-4 py-2 rounded">
                Apagar
              </button>
              <button onClick={cancelShutdown} className="bg-gray-300 px-4 py-2 rounded">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {isSuspended && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Desbloquear el equipo"
          className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center text-white font-mono cursor-pointer"
          onClick={handleResume}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === " ") {
              event.preventDefault()
              handleResume()
            }
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/daniel-gonzalez-pascual-portrait.png"
            alt="Daniel González Pascual"
            className="w-40 h-40 rounded-full mb-4"
          />
          <h2 className="text-2xl font-bold">Daniel González Pascual</h2>
          <p className="text-lg">Desarrollador Backend Python</p>
          <p className="mt-8">Haz click o pulsa Enter para desbloquear el equipo o la pantalla.</p>
        </div>
      )}

      <UbuntuDesktop
        onSectionChange={handleSectionChange}
        onReboot={handleReboot}
        onSuspend={handleSuspend}
        onShutdown={handleShutdown}
        onOpenTerminal={handleOpenTerminal}
        onOpenPostmanApp={handleOpenPostmanApp}
        onCloseTerminal={handleCloseTerminal}
      >
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
    </>
  )
}
