"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"

interface BootAnimationProps {
  onComplete: () => void
}

export function BootAnimation({ onComplete }: BootAnimationProps) {
  const { t } = useLanguage()
  const [currentStep, setCurrentStep] = useState(0)
  const [loadingText, setLoadingText] = useState("")

  const bootSteps = [
    { text: "Inicializando kernel...", duration: 350 },
    { text: "Montando /dev/portfolio...", duration: 350 },
    { text: "Cargando perfil de Daniel González Pascual", duration: 450 },
    { text: "Desarrollador Backend Python", duration: 350 },
    { text: "Arrancando servicios...", duration: 350 },
    { text: "Sistema listo ✓", duration: 350 },
  ]

  useEffect(() => {
    if (currentStep < bootSteps.length) {
      const timer = setTimeout(
        () => {
          setLoadingText(bootSteps[currentStep].text)
          setCurrentStep((prev) => prev + 1)
        },
        currentStep === 0 ? 200 : bootSteps[currentStep - 1]?.duration || 350,
      )

      return () => clearTimeout(timer)
    } else {
      const completeTimer = setTimeout(onComplete, 250)
      return () => clearTimeout(completeTimer)
    }
  }, [currentStep, onComplete])

  // Boot saltable: ESC, Enter, Espacio o click. T3 rediseñará la animación a fondo.
  useEffect(() => {
    const skip = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
        onComplete()
      }
    }
    window.addEventListener("keydown", skip)
    return () => window.removeEventListener("keydown", skip)
  }, [onComplete])

  return (
    <div
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800 flex items-center justify-center overflow-hidden cursor-pointer"
      onClick={onComplete}
      role="presentation"
    >
      {/* Matrix-style background */}
      <div className="absolute inset-0 opacity-10">
        <div className="matrix-rain"></div>
      </div>

      <div className="text-center z-10">
        {/* Logo con foto de Daniel - diseño más moderno */}
        <div className="mb-8 relative">
          <div className="relative w-40 h-40 mx-auto">
            {/* Hexágono exterior animado */}
            <div className="absolute inset-0 hexagon-border animate-pulse">
              <div className="hexagon-inner bg-gradient-to-br from-orange-500 to-orange-600 p-1">
                <div className="hexagon-content bg-black p-2">
                  <img
                    src="/daniel-gonzalez-pascual-portrait.png"
                    alt="Daniel González Pascual"
                    className="w-full h-full object-cover hexagon-image"
                  />
                </div>
              </div>
            </div>

            {/* Anillos de carga modernos */}
            <div className="absolute inset-0 animate-spin-slow">
              <div className="w-full h-full border-4 border-transparent border-t-orange-500 border-r-orange-400 rounded-full opacity-80"></div>
            </div>
            <div className="absolute inset-2 animate-spin-reverse">
              <div className="w-full h-full border-2 border-transparent border-b-orange-300 border-l-orange-200 rounded-full opacity-60"></div>
            </div>
          </div>
        </div>

        {/* Texto de carga */}
        <div className="text-orange-400 text-2xl font-mono mb-6 h-10 flex items-center justify-center">
          <span className="animate-pulse">{loadingText}</span>
        </div>

        {/* Barra de progreso moderna */}
        <div className="w-96 h-3 bg-gray-800 rounded-full mx-auto overflow-hidden border border-gray-700">
          <div
            className="h-full bg-gradient-to-r from-orange-500 via-orange-400 to-orange-300 transition-all duration-1000 ease-out relative"
            style={{ width: `${(currentStep / bootSteps.length) * 100}%` }}
          >
            <div className="absolute inset-0 bg-white opacity-30 animate-pulse"></div>
          </div>
        </div>

        {/* Indicadores de sistema */}
        <div className="mt-10 text-green-400 font-mono text-sm space-y-2">
          <div className="flex justify-center space-x-6">
            <span
              className={`transition-all duration-500 ${currentStep > 0 ? "text-green-400 animate-pulse" : "text-gray-600"}`}
            >
              ● KERNEL
            </span>
            <span
              className={`transition-all duration-500 ${currentStep > 2 ? "text-green-400 animate-pulse" : "text-gray-600"}`}
            >
              ● USER
            </span>
            <span
              className={`transition-all duration-500 ${currentStep > 4 ? "text-green-400 animate-pulse" : "text-gray-600"}`}
            >
              ● SERVICES
            </span>
            <span
              className={`transition-all duration-500 ${currentStep > 6 ? "text-green-400 animate-pulse" : "text-gray-600"}`}
            >
              ● READY
            </span>
          </div>
        </div>
        <p className="mt-6 text-xs font-mono text-gray-500">Pulsa ESC o haz click para saltar</p>
      </div>
    </div>
  )
}
