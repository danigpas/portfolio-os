"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Code, Database, Server } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function AboutSection() {
  const { t } = useLanguage()

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-secondary/20 via-background to-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">{t("about.title")}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6 animate-slide-in-up">
            <p className="text-lg text-muted-foreground leading-relaxed">{t("about.description")}</p>

            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{t("about.location")}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary mb-2">2+</div>
                <div className="text-sm text-muted-foreground">Años de Experiencia</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Sitios Integrados</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary mb-2">12K+</div>
                <div className="text-sm text-muted-foreground">Artículos Gestionados</div>
              </div>
            </div>
          </div>

          {/* Skills Cards */}
          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            <Card className="card-elevated border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Code className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{t("skills.backend")}</h3>
                    <p className="text-muted-foreground">Python, FastAPI, Flask, Django</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated border-l-4 border-l-accent">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-accent/10 rounded-lg">
                    <Database className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{t("skills.databases")}</h3>
                    <p className="text-muted-foreground">MySQL, PostgreSQL, Oracle</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="card-elevated border-l-4 border-l-primary">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Server className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">{t("skills.tools")}</h3>
                    <p className="text-muted-foreground">Docker, Kubernetes, CI/CD, Odoo, WordPress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
