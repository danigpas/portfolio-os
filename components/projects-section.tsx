"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

export function ProjectsSection() {
  const { t } = useLanguage()

  const projects = [
    {
      title: t("projects.blog.title"),
      description: t("projects.blog.description"),
      image: "/python-backend-blog.png",
      technologies: ["Python", "Django", "PostgreSQL", "HTML/CSS"],
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
    },
    {
      title: t("projects.portfolio.title"),
      description: t("projects.portfolio.description"),
      image: "/retro-nes-portfolio.png",
      technologies: ["JavaScript", "CSS3", "HTML5", "Pixel Art"],
      liveUrl: "#",
      githubUrl: "#",
      featured: true,
    },
    {
      title: "API de Integración FastAPI",
      description:
        "Sistema de sincronización en tiempo real entre WordPress y Odoo CRM, gestionando más de 50 sitios web.",
      image: "/placeholder-aftli.png",
      technologies: ["FastAPI", "Python", "MySQL", "WordPress", "Odoo"],
      githubUrl: "#",
      featured: false,
    },
  ]

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-accent/10 via-background to-secondary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-slide-in-up">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">{t("projects.title")}</h2>
          <div className="w-20 h-1 bg-primary mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <Card
              key={index}
              className={`group card-elevated ${
                project.featured ? "border-primary/50 shadow-lg" : ""
              } animate-slide-in-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  {project.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-semibold">
                        Destacado
                      </span>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <CardTitle className="text-xl font-heading font-bold mb-3 group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>

                <p className="text-muted-foreground mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-md text-xs font-medium hover:bg-secondary/70 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex space-x-3">
                  {project.liveUrl && (
                    <Button size="sm" className="btn-primary flex-1" asChild>
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Ver Proyecto
                      </a>
                    </Button>
                  )}
                  {project.githubUrl && (
                    <Button size="sm" className="btn-outline flex-1" asChild>
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Github className="w-4 h-4 mr-2" />
                        Código
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
