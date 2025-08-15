"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Calendar } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function ExperienceSection() {
  const { t } = useLanguage()

  return (
    <section id="experience" className="py-20 bg-gradient-to-br from-accent/5 via-secondary/10 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">{t("experience.title")}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-primary/30"></div>

            <div className="relative flex items-start space-x-6 pb-12 animate-slide-in-up">
              <div className="flex-shrink-0 w-16 h-16 bg-primary rounded-full flex items-center justify-center animate-gentle-pulse">
                <Building className="w-8 h-8 text-primary-foreground" />
              </div>

              <Card className="flex-1 card-elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                        {t("experience.disofic.title")}
                      </h3>
                      <p className="text-primary font-semibold">{t("experience.disofic.company")}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground mt-2 md:mt-0">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{t("experience.disofic.period")}</span>
                    </div>
                  </div>

                  <div className="space-y-3 text-muted-foreground mb-4 leading-relaxed">
                    <p>{t("experience.disofic.description1")}</p>
                    <p>{t("experience.disofic.description2")}</p>
                    <p>{t("experience.disofic.description3")}</p>
                    <p>{t("experience.disofic.description4")}</p>
                    <p>{t("experience.disofic.description5")}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      Python
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      FastAPI
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                      WordPress
                    </Badge>
                    <Badge variant="secondary" className="bg-accent/10 text-accent hover:bg-accent/20">
                      Odoo CRM
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                      MySQL
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                      PostgreSQL
                    </Badge>
                    <Badge variant="secondary" className="bg-secondary/50 text-secondary-foreground">
                      Oracle
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      Celery
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      Redis
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                      RabbitMQ
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div
              className="relative flex items-start space-x-6 pb-12 animate-slide-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="flex-shrink-0 w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <Building className="w-8 h-8 text-accent-foreground" />
              </div>

              <Card className="flex-1 card-elevated">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-foreground mb-1">
                        {t("experience.internship.title")}
                      </h3>
                      <p className="text-accent font-semibold">{t("experience.internship.company")}</p>
                    </div>
                    <div className="flex items-center space-x-2 text-muted-foreground mt-2 md:mt-0">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{t("experience.internship.period")}</span>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 leading-relaxed">{t("experience.internship.description")}</p>

                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-accent text-accent hover:bg-accent/10">
                      C#
                    </Badge>
                    <Badge variant="outline" className="border-accent text-accent hover:bg-accent/10">
                      Oracle Forms
                    </Badge>
                    <Badge variant="outline" className="border-primary text-primary hover:bg-primary/10">
                      {t("experience.internship.skills")}
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
