"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, X, Smartphone, Monitor, Wifi, WifiOff } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[]
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed"
    platform: string
  }>
  prompt(): Promise<void>
}

export function PWAInstaller() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true)
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    // Listen for app installed event
    const handleAppInstalled = () => {
      setIsInstalled(true)
      setShowInstallPrompt(false)
      setDeferredPrompt(null)
    }

    // Listen for online/offline events
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
      window.removeEventListener("appinstalled", handleAppInstalled)
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      setDeferredPrompt(null)
      setShowInstallPrompt(false)
    }
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
  }

  if (isInstalled || !showInstallPrompt) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        {/* Online/Offline Indicator */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-all ${
            isOnline
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
          {isOnline ? "En línea" : "Sin conexión"}
        </div>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="p-4 shadow-lg border-orange-200 bg-gradient-to-r from-orange-50 to-orange-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Download className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Instalar App</h3>
              <p className="text-xs text-gray-600">Portfolio de Daniel</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
            <X className="w-4 h-4" />
          </Button>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Instala esta aplicación en tu dispositivo para acceso rápido y funcionalidad offline.
        </p>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Smartphone className="w-3 h-3" />
            <span>Móvil</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Monitor className="w-3 h-3" />
            <span>Escritorio</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <WifiOff className="w-3 h-3" />
            <span>Offline</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleInstallClick} className="flex-1 bg-orange-500 hover:bg-orange-600">
            <Download className="w-4 h-4 mr-2" />
            Instalar
          </Button>
          <Button variant="outline" onClick={handleDismiss} className="px-3 bg-transparent">
            Ahora no
          </Button>
        </div>
      </Card>
    </div>
  )
}

export function PWAFeatures() {
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsInstalled(window.matchMedia("(display-mode: standalone)").matches)
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const features = [
    {
      icon: Download,
      title: "Instalación Rápida",
      description: "Instala como app nativa en cualquier dispositivo",
      available: true,
    },
    {
      icon: WifiOff,
      title: "Funcionalidad Offline",
      description: "Accede al portfolio sin conexión a internet",
      available: true,
    },
    {
      icon: Smartphone,
      title: "Responsive Design",
      description: "Optimizado para móvil, tablet y escritorio",
      available: true,
    },
    {
      icon: Monitor,
      title: "Experiencia Nativa",
      description: "Interfaz fluida como una aplicación nativa",
      available: isInstalled,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Aplicación Web Progresiva</h2>
        <p className="text-gray-600">Este portfolio está optimizado como PWA para la mejor experiencia de usuario</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <Card key={index} className={`p-4 ${feature.available ? "border-green-200" : "border-gray-200"}`}>
            <div className="flex items-start gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  feature.available ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                }`}
              >
                <feature.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
                {feature.available && (
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600">Disponible</span>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-red-500"}`}></div>
          <span className="font-medium">Estado de Conexión</span>
        </div>
        <p className="text-sm text-gray-700">
          {isOnline ? "Conectado - Todas las funciones disponibles" : "Sin conexión - Funcionando en modo offline"}
        </p>
      </Card>
    </div>
  )
}
