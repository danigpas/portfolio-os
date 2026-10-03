"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Calendar } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { getCvData } from "@/lib/cv-data"

export function ExperienceSection() {
  const { t, language } = useLanguage()
  const { experience } = getCvData(language)

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

            {experience.map((job, index) => (
              <div
                key={job.id}
                className="relative flex items-start space-x-6 pb-12 animate-slide-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div
                  className={`flex-shrink-0 w-16 h-16 ${
                    index === 0 ? "bg-primary animate-gentle-pulse" : "bg-accent"
                  } rounded-full flex items-center justify-center`}
                >
                  <Building className={`w-8 h-8 ${index === 0 ? "text-primary-foreground" : "text-accent-foreground"}`} />
                </div>

                <Card className="flex-1 card-elevated">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-heading font-bold text-foreground mb-1">{job.role}</h3>
                        <p className={`font-semibold ${index === 0 ? "text-primary" : "text-accent"}`}>
                          {job.company} · {job.location}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 text-muted-foreground mt-2 md:mt-0">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">{job.period}</span>
                      </div>
                    </div>

                    <p className="text-muted-foreground mb-4 leading-relaxed">{job.summary}</p>

                    <ul className="space-y-2 text-muted-foreground mb-4 leading-relaxed">
                      {job.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-2">
                          <span className={index === 0 ? "text-primary" : "text-accent"}>▸</span>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-wrap gap-2">
                      {job.stack.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className={
                            index === 0
                              ? "bg-primary/10 text-primary hover:bg-primary/20"
                              : "bg-secondary/50 text-secondary-foreground"
                          }
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
