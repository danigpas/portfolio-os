"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Calendar, BookOpen } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function EducationSection() {
  const { t } = useLanguage()

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

            {/* DAW - Próximo */}
            <div className="relative flex items-start space-x-6 pb-12 animate-slide-in-up">
              <div className="flex-shrink-0 w-16 h-16 bg-green-500 rounded-full flex items-center justify-center animate-gentle-pulse">
                <BookOpen className="w-8 h-8 text-white" />
              </div>

              <Card className="flex-1 card-elevated border-l-4 border-l-green-500">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                        {t("education.daw.title")}
                      </h3>
                      <p className="text-green-600 font-semibold">{t("education.daw.institution")}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground mt-2 md:mt-0">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{t("education.daw.period")}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{t("education.daw.description")}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-200">
                      {t("education.daw.upcoming")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Cesur */}
            <div
              className="relative flex items-start space-x-6 pb-12 animate-slide-in-up"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-primary-foreground" />
              </div>

              <Card className="flex-1 card-elevated border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                        {t("education.cesur.title")}
                      </h3>
                      <p className="text-primary font-semibold">{t("education.cesur.institution")}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground mt-2 md:mt-0">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{t("education.cesur.period")}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{t("education.cesur.description")}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      HTML
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      GitHub
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                      Visual Studio
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                      C#
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                      Documentación
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                      MySQL
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                      .NET Framework
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Universidad de Málaga */}
            <div
              className="relative flex items-start space-x-6 pb-12 animate-slide-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex-shrink-0 w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-accent-foreground rounded-sm flex items-center justify-center">
                  <span className="text-accent font-bold text-sm">UMA</span>
                </div>
              </div>

              <Card className="flex-1 card-elevated border-l-4 border-l-accent">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                        {t("education.uma.title")}
                      </h3>
                      <p className="text-accent font-semibold">{t("education.uma.institution")}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground mt-2 md:mt-0">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{t("education.uma.period")}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{t("education.uma.description")}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-accent text-accent hover:bg-accent/10">
                      Documentación
                    </Badge>
                    <Badge variant="outline" className="border-accent text-accent hover:bg-accent/10">
                      {t("education.uma.skills")}
                    </Badge>
                    <Badge variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      {t("education.uma.problem_solving")}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Universidad Internacional Menéndez Pelayo */}
            <div className="relative flex items-start space-x-6 animate-slide-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="flex-shrink-0 w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">UIMP</span>
              </div>

              <Card className="flex-1 card-elevated border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                        {t("education.uimp.title")}
                      </h3>
                      <p className="text-blue-600 font-semibold">{t("education.uimp.institution")}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground mt-2 md:mt-0">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{t("education.uimp.period")}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{t("education.uimp.description")}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                      {t("education.uimp.skills")}
                    </Badge>
                    <Badge variant="outline" className="border-blue-500 text-blue-600 hover:bg-blue-50">
                      B1
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
