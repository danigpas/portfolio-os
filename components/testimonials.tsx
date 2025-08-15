"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react"

interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  content: string
  rating: number
  avatar?: string
  linkedinUrl?: string
}

const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "María García",
    position: "CTO",
    company: "DisOfic",
    content:
      "Daniel ha demostrado ser un desarrollador excepcional. Su trabajo en la API de integración ha transformado completamente nuestros procesos, reduciendo errores y mejorando la eficiencia operativa de manera significativa.",
    rating: 5,
    linkedinUrl: "#",
  },
  {
    id: "2",
    name: "Carlos Rodríguez",
    position: "Lead Developer",
    company: "TechSolutions",
    content:
      "La capacidad de Daniel para resolver problemas complejos y su dominio de Python y FastAPI son impresionantes. Es un profesional que siempre busca la excelencia en cada proyecto.",
    rating: 5,
    linkedinUrl: "#",
  },
  {
    id: "3",
    name: "Ana Martínez",
    position: "Product Manager",
    company: "InnovaTech",
    content:
      "Trabajar con Daniel ha sido una experiencia fantástica. Su enfoque meticuloso y su capacidad para entregar soluciones robustas en tiempo y forma lo convierten en un activo valioso para cualquier equipo.",
    rating: 5,
    linkedinUrl: "#",
  },
]

export function Testimonials() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000)
    return () => clearInterval(interval)
  }, [])

  const testimonial = testimonials[currentTestimonial]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Lo que dicen de mí</h2>
        <p className="text-gray-600">Testimonios reales de colegas y supervisores con los que he trabajado</p>
      </div>

      <Card className="relative overflow-hidden">
        <div className="p-8">
          <Quote className="w-12 h-12 text-orange-200 mb-4" />

          <blockquote className="text-lg mb-6 leading-relaxed">"{testimonial.content}"</blockquote>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold">
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <div>
                <div className="font-semibold">{testimonial.name}</div>
                <div className="text-sm text-gray-600">
                  {testimonial.position} en {testimonial.company}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4">
          <Button variant="ghost" size="sm" onClick={prevTestimonial} className="rounded-full w-10 h-10 p-0">
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>

        <div className="absolute top-1/2 -translate-y-1/2 right-4">
          <Button variant="ghost" size="sm" onClick={nextTestimonial} className="rounded-full w-10 h-10 p-0">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-2 pb-4">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTestimonial(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentTestimonial ? "bg-orange-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  )
}
