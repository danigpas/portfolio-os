"use client"

import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Code, Database, Server } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { getCvData } from "@/lib/cv-data"

const SKILL_ICONS = [Code, Database, Server]

export function AboutSection() {
  const { t, language } = useLanguage()
  const { about, skills, contact } = getCvData(language)
  const years = about.yearsOfExperience.replace(/[^0-9+]/g, "")

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
            <p className="text-lg text-muted-foreground leading-relaxed">{about.summary}</p>

            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{contact.location}</span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-6">
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary mb-2">{years}</div>
                <div className="text-sm text-muted-foreground">{t("about.stat.years")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">{t("about.stat.sites")}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-heading font-bold text-primary mb-2">12K+</div>
                <div className="text-sm text-muted-foreground">{t("about.stat.items")}</div>
              </div>
            </div>
          </div>

          {/* Skills Cards */}
          <div className="space-y-4 animate-slide-in-up" style={{ animationDelay: "0.2s" }}>
            {skills.map((group, index) => {
              const Icon = SKILL_ICONS[index] ?? Code
              const accent = index % 2 === 0
              return (
                <Card
                  key={group.category}
                  className={`card-elevated border-l-4 ${accent ? "border-l-primary" : "border-l-accent"}`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${accent ? "bg-primary/10" : "bg-accent/10"}`}>
                        <Icon className={`w-6 h-6 ${accent ? "text-primary" : "text-accent"}`} />
                      </div>
                      <div>
                        <h3 className="font-heading font-semibold text-lg mb-2">{group.category}</h3>
                        <p className="text-muted-foreground">{group.items.join(", ")}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
