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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
          <div className="om-window w-full max-w-md border p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold om-accent-text">Apagar</h2>
            <p className="mb-6 text-sm text-[var(--omarchy-fg)]">
              En este caso tras apagarse se volverá a iniciar el sistema operativo de forma automática.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={confirmShutdown}
                className="border border-[var(--omarchy-danger)] bg-[var(--omarchy-danger)] px-4 py-2 text-sm text-[var(--omarchy-bg)] hover:opacity-90"
              >
                Apagar
              </button>
              <button
                onClick={cancelShutdown}
                className="border border-[var(--omarchy-border)] bg-[var(--omarchy-surface)] px-4 py-2 text-sm text-[var(--omarchy-fg)] hover:bg-[var(--omarchy-surface-alt)]"
              >
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
          className="fixed inset-0 z-[100] flex cursor-pointer flex-col items-center justify-center bg-[var(--omarchy-bg)] font-mono text-[var(--omarchy-fg)]"
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
            className="mb-4 h-40 w-40 border border-[var(--omarchy-border)] object-cover"
          />
          <h2 className="text-2xl font-bold om-accent-text">Daniel González Pascual</h2>
          <p className="text-lg">Desarrollador Backend Python</p>
          <p className="mt-8 text-[var(--omarchy-muted)]">Haz click o pulsa Enter para desbloquear el equipo o la pantalla.</p>
        </div>
      )}

      <UbuntuDesktop
        activeSection={activeSection}
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
