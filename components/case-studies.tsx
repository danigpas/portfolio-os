"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronUp, ExternalLink, Github, TrendingUp, Users, Zap } from "lucide-react"

interface CaseStudy {
  id: string
  title: string
  subtitle: string
  problem: string
  solution: string
  results: string[]
  technologies: string[]
  metrics: {
    label: string
    value: string
    icon: any
  }[]
  image?: string
}

const caseStudies: CaseStudy[] = [
  {
    id: "disofic-api",
    title: "API de Integración en Tiempo Real",
    subtitle: "DisOfic - Sistema de sincronización masiva",
    problem:
      "La empresa necesitaba sincronizar más de 50 sitios de WordPress con el CRM Odoo, un proceso que se realizaba manualmente y tomaba días, generando errores y inconsistencias en los datos.",
    solution:
      "Desarrollé una API robusta con FastAPI que automatiza completamente la sincronización. Implementé un sistema de workers con Celery y Redis para procesamiento asíncrono, garantizando coherencia y rendimiento en las plataformas.",
    results: [
      "Automatización completa del proceso de sincronización",
      "Reducción del tiempo de procesamiento de días a horas",
      "Eliminación del 95% de errores manuales",
      "Mejora del 300% en la eficiencia operativa",
    ],
    technologies: ["Python", "FastAPI", "Celery", "Redis", "MySQL", "WordPress API", "Odoo API"],
    metrics: [
      { label: "Sitios sincronizados", value: "50+", icon: Users },
      { label: "Reducción de errores", value: "95%", icon: TrendingUp },
      { label: "Mejora de eficiencia", value: "300%", icon: Zap },
    ],
  },
  {
    id: "inventory-optimization",
    title: "Optimización de Inventario",
    subtitle: "DisOfic - Sistema de gestión inteligente",
    problem:
      "Las discrepancias de inventario causaban pérdidas significativas y una experiencia de compra deficiente, con un 50% de incidencias relacionadas con pedidos.",
    solution:
      "Implementé una API para consulta de precios y stock en tiempo real en las páginas de producto. El sistema elimina discrepancias de inventario y mejora significativamente la experiencia de compra.",
    results: [
      "Reducción del 50% en incidencias de pedidos",
      "Aumento del 25% en el volumen de ventas",
      "Mejora del 40% en la satisfacción del cliente",
      "Eliminación completa de discrepancias de stock",
    ],
    technologies: ["Python", "FastAPI", "PostgreSQL", "Redis", "WebSockets"],
    metrics: [
      { label: "Reducción incidencias", value: "50%", icon: TrendingUp },
      { label: "Aumento ventas", value: "25%", icon: Users },
      { label: "Mejora satisfacción", value: "40%", icon: Zap },
    ],
  },
]

export function CaseStudies() {
  const [expandedStudy, setExpandedStudy] = useState<string | null>(null)

  const toggleExpanded = (id: string) => {
    setExpandedStudy(expandedStudy === id ? null : id)
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Case Studies</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Proyectos reales con impacto medible. Descubre cómo he resuelto desafíos complejos y generado valor tangible
          para las empresas.
        </p>
      </div>

      {caseStudies.map((study) => (
        <Card key={study.id} className="overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-semibold mb-1">{study.title}</h3>
                <p className="text-gray-600">{study.subtitle}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => toggleExpanded(study.id)}>
                {expandedStudy === study.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </Button>
            </div>

            {/* Metrics Preview */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {study.metrics.map((metric, index) => (
                <div key={index} className="text-center p-3 bg-gray-50 rounded-lg">
                  <metric.icon className="w-5 h-5 mx-auto mb-1 text-[var(--omarchy-accent)]" />
                  <div className="text-2xl font-bold text-[var(--omarchy-accent)]">{metric.value}</div>
                  <div className="text-xs text-gray-600">{metric.label}</div>
                </div>
              ))}
            </div>

            {/* Technologies */}
            <div className="flex flex-wrap gap-2 mb-4">
              {study.technologies.map((tech) => (
                <Badge key={tech} variant="outline">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* Expanded Content */}
            {expandedStudy === study.id && (
              <div className="mt-6 space-y-6 border-t pt-6">
                <div>
                  <h4 className="font-semibold mb-2 text-red-600">🎯 Problema</h4>
                  <p className="text-gray-700">{study.problem}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-blue-600">💡 Solución</h4>
                  <p className="text-gray-700">{study.solution}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 text-green-600">📈 Resultados</h4>
                  <ul className="space-y-2">
                    {study.results.map((result, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Ver Demo
                  </Button>
                  <Button size="sm" variant="outline">
                    <Github className="w-4 h-4 mr-2" />
                    Código
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  )
}
