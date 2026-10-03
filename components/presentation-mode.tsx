"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Presentation, ChevronLeft, ChevronRight, X } from "lucide-react"

interface PresentationModeProps {
  isOpen: boolean
  onClose: () => void
}

export function PresentationMode({ isOpen, onClose }: PresentationModeProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  const slides = [
    {
      title: "Daniel González Pascual",
      subtitle: "Desarrollador Backend Python",
      content: (
        <div className="text-center space-y-6">
          <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-r from-[var(--omarchy-accent)] to-[var(--omarchy-accent-alt)] flex items-center justify-center text-[var(--omarchy-bg)] text-4xl font-bold">
            DGP
          </div>
          <div className="space-y-2">
            <p className="text-xl">📍 Málaga, España</p>
            <p className="text-lg">🚀 3+ años de experiencia</p>
            <p className="text-lg">💡 Especializado en FastAPI y Python</p>
          </div>
        </div>
      ),
    },
    {
      title: "Experiencia Profesional",
      subtitle: "Semi-Senior Python Developer en Inforyde · antes Backend en DisOfic",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4">Logros Principales</h3>
              <ul className="space-y-2">
                <li>• API de integración para +50 sitios WordPress</li>
                <li>• Reducción del 50% en incidencias</li>
                <li>• Optimización de procesos con Python</li>
                <li>• Arquitectura asíncrona con Celery</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Tecnologías</h3>
              <div className="flex flex-wrap gap-2">
                <Badge>Python</Badge>
                <Badge>FastAPI</Badge>
                <Badge>MySQL</Badge>
                <Badge>PostgreSQL</Badge>
                <Badge>Redis</Badge>
                <Badge>RabbitMQ</Badge>
              </div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Proyectos Destacados",
      subtitle: "Soluciones innovadoras",
      content: (
        <div className="grid grid-cols-2 gap-8">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">El Nieto de Pascual</h3>
            <p className="mb-4">Blog técnico sobre desarrollo backend y Python</p>
            <Badge variant="outline">Blog</Badge>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-3">Portfolio Retro NES</h3>
            <p className="mb-4">Portfolio con estética retro de videojuegos</p>
            <Badge variant="outline">Portfolio</Badge>
          </Card>
        </div>
      ),
    },
    {
      title: "Formación Académica",
      subtitle: "Educación y certificaciones",
      content: (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-semibold">Universidad de Málaga</h3>
              <p className="text-[var(--omarchy-muted)]">Grado en Ingeniería Informática</p>
              <p className="text-sm">2017 - 2021</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold">Cesur</h3>
              <p className="text-[var(--omarchy-muted)]">Certificado de Profesionalidad - Programación</p>
              <p className="text-sm">2023</p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold">Junta de Andalucía</h3>
              <p className="text-[var(--omarchy-muted)]">Grado Superior DAW (Próximo)</p>
              <p className="text-sm">Septiembre 2025</p>
            </Card>
          </div>
        </div>
      ),
    },
    {
      title: "¿Por qué elegirme?",
      subtitle: "Valor diferencial",
      content: (
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Fortalezas</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--omarchy-accent)] rounded-full"></span>
                Experiencia real en producción
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--omarchy-accent)] rounded-full"></span>
                Optimización de rendimiento
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--omarchy-accent)] rounded-full"></span>
                Arquitecturas escalables
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-[var(--omarchy-accent)] rounded-full"></span>
                Pasión por la innovación
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Contacto</h3>
            <div className="space-y-2">
              <p>📧 danigpascual@protonmail.com</p>
              <p>📱 +34 XXX XXX XXX</p>
              <p>🌐 LinkedIn: daniel-gonzález-pascual-dev</p>
              <p>💻 GitHub: danigpas</p>
            </div>
          </div>
        </div>
      ),
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSlide()
      if (e.key === "ArrowLeft") prevSlide()
      if (e.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleKeyPress)
      return () => document.removeEventListener("keydown", handleKeyPress)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="flex h-full flex-col bg-[var(--omarchy-bg)]">
        {/* Header */}
        <div className="flex justify-between items-center p-6 text-[var(--omarchy-fg)]">
          <div className="flex items-center gap-4">
            <Presentation className="w-6 h-6" />
            <span className="font-semibold">Modo Presentación</span>
            <span className="text-sm opacity-70">
              {currentSlide + 1} / {slides.length}
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-[var(--omarchy-fg)] hover:bg-[var(--omarchy-fg)]/20">
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-6xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-[var(--omarchy-fg)] mb-2">{slides[currentSlide].title}</h1>
              <p className="text-xl text-[var(--omarchy-fg)]/80">{slides[currentSlide].subtitle}</p>
            </div>
            <div className="bg-[var(--omarchy-fg)]/10 backdrop-blur-md rounded-2xl p-8 text-[var(--omarchy-fg)]">
              {slides[currentSlide].content}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center p-6">
          <Button
            variant="ghost"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="text-[var(--omarchy-fg)] hover:bg-[var(--omarchy-fg)]/20"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? "bg-[var(--omarchy-fg)]" : "bg-[var(--omarchy-fg)]/30"}`}
              />
            ))}
          </div>

          <Button
            variant="ghost"
            onClick={nextSlide}
            disabled={currentSlide === slides.length - 1}
            className="text-[var(--omarchy-fg)] hover:bg-[var(--omarchy-fg)]/20"
          >
            Siguiente
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
