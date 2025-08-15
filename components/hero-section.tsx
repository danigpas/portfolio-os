"use client"

import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail, Download } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { MalagaDecorations } from "@/components/malaga-decorations"

export function HeroSection() {
  const { t } = useLanguage()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const downloadCV = () => {
    const link = document.createElement("a")
    link.href = "/cv-daniel-gonzalez-pascual.pdf"
    link.download = "CV-Daniel-Gonzalez-Pascual.pdf"
    link.click()
  }

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-background via-accent/5 to-secondary/10">
      {/* Málaga decorations */}
      <MalagaDecorations />

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-float"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center animate-slide-in-up">
          {/* Profile Image */}
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-accent/20 p-1 animate-gentle-pulse">
              <div className="w-full h-full rounded-full bg-background flex items-center justify-center border border-border">
                <img
                  src="/professional-developer-portrait.png"
                  alt="Daniel González Pascual"
                  className="w-28 h-28 rounded-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Name and Location */}
          <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">Daniel González Pascual</h2>
          <p className="text-lg text-muted-foreground mb-8">{t("about.location")}</p>

          {/* Main Content */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-black text-foreground mb-6 leading-tight">
            {t("hero.title")}
          </h1>

          <p className="text-xl md:text-2xl text-primary font-heading font-semibold mb-6">{t("hero.subtitle")}</p>

          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>

          {/* CTA Buttons - Unified Design */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="btn-primary" onClick={() => scrollToSection("projects")}>
              {t("hero.cta")}
            </Button>
            <Button size="lg" className="btn-outline" onClick={() => scrollToSection("contact")}>
              {t("hero.contact")}
            </Button>
            <Button size="lg" className="btn-secondary" onClick={downloadCV}>
              <Download className="w-4 h-4 mr-2" />
              {t("hero.downloadCV")}
            </Button>
          </div>

          {/* Social Links */}
          <div className="flex justify-center space-x-6 mb-12">
            <a
              href="https://github.com/danielgonzalezpascual"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 transform p-2 rounded-lg hover:bg-accent/10"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="https://linkedin.com/in/danielgonzalezpascual"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 transform p-2 rounded-lg hover:bg-accent/10"
            >
              <Linkedin className="w-6 h-6" />
            </a>
            <a
              href="mailto:daniel@example.com"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110 transform p-2 rounded-lg hover:bg-accent/10"
            >
              <Mail className="w-6 h-6" />
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="animate-bounce">
            <button
              onClick={() => scrollToSection("about")}
              className="text-muted-foreground hover:text-primary transition-colors duration-300 p-2 rounded-lg hover:bg-accent/10"
            >
              <ArrowDown className="w-6 h-6 mx-auto" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
