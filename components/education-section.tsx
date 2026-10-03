"use client"

import type { LucideIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Calendar, BookOpen } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { getCvData } from "@/lib/cv-data"

interface EducationPresentation {
  /** Icono de la tarjeta; si falta se muestra `label`. */
  icon?: LucideIcon
  /** Texto mostrado en el círculo (alternativa al icono). */
  label?: string
  circleClass: string
  iconClass: string
  institutionClass: string
  borderClass: string
  badgeClass: string
}

/**
 * Estilos por titulación. La información (título, institución, periodo,
 * descripción, estado y tags) vive en `lib/cv-data.ts`; aquí sólo queda la
 * presentación concreta de cada entrada del escritorio.
 */
const EDUCATION_PRESENTATION: Record<string, EducationPresentation> = {
  daw: {
    icon: BookOpen,
    circleClass: "bg-green-500",
    iconClass: "text-white",
    institutionClass: "text-green-600",
    borderClass: "border-l-green-500",
    badgeClass: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  cesur: {
    icon: GraduationCap,
    circleClass: "bg-primary",
    iconClass: "text-primary-foreground",
    institutionClass: "text-primary",
    borderClass: "border-l-primary",
    badgeClass: "bg-primary/10 text-primary hover:bg-primary/20",
  },
  uma: {
    label: "UMA",
    circleClass: "bg-accent",
    iconClass: "",
    institutionClass: "text-accent",
    borderClass: "border-l-accent",
    badgeClass: "bg-accent/10 text-accent hover:bg-accent/20",
  },
  uimp: {
    label: "UIMP",
    circleClass: "bg-blue-500",
    iconClass: "",
    institutionClass: "text-blue-600",
    borderClass: "border-l-blue-500",
    badgeClass: "bg-blue-50 text-blue-600 hover:bg-blue-100",
  },
}

const DEFAULT_PRESENTATION: EducationPresentation = EDUCATION_PRESENTATION.cesur

const TAG_BADGE_CLASS = "bg-secondary/50 text-secondary-foreground hover:bg-secondary/70"

export function EducationSection() {
  const { t, language } = useLanguage()
  const { education } = getCvData(language)

  return (
    <section id="education" className="py-20 bg-gradient-to-br from-background via-secondary/5 to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">{t("education.title")}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>

            {education.map((item, index) => {
              const presentation = EDUCATION_PRESENTATION[item.id] ?? DEFAULT_PRESENTATION
              const Icon = presentation.icon

              return (
                <div
                  key={item.id}
                  className="relative flex items-start space-x-6 pb-12 animate-slide-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`flex-shrink-0 w-16 h-16 ${presentation.circleClass} rounded-full flex items-center justify-center ${
                      index === 0 ? "animate-gentle-pulse" : ""
                    }`}
                  >
                    {Icon ? (
                      <Icon className={`w-8 h-8 ${presentation.iconClass}`} />
                    ) : (
                      <span className="text-white font-bold text-sm">{presentation.label}</span>
                    )}
                  </div>

                  <Card className={`flex-1 card-elevated border-l-4 ${presentation.borderClass}`}>
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-heading font-bold text-foreground mb-1">{item.title}</h3>
                          <p className={`${presentation.institutionClass} font-semibold`}>{item.institution}</p>
                        </div>
                        <div className="flex items-center space-x-2 text-muted-foreground mt-2 md:mt-0">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{item.period}</span>
                        </div>
                      </div>

                      <p className="text-muted-foreground mb-4 leading-relaxed">{item.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {item.status && (
                          <Badge variant="secondary" className={presentation.badgeClass}>
                            {item.status}
                          </Badge>
                        )}
                        {item.tags?.map((tag) => (
                          <Badge key={tag} variant="secondary" className={TAG_BADGE_CLASS}>
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
