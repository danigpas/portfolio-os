"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Globe, Menu, X } from "lucide-react"
import { useTheme } from "next-themes"
import { useLanguage } from "@/components/language-provider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Logo } from "@/components/logo"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { setTheme, theme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground hover:text-primary transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-accent/10"
              >
                {t("nav.about")}
              </button>
              <button
                onClick={() => scrollToSection("experience")}
                className="text-foreground hover:text-primary transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-accent/10"
              >
                {t("nav.experience")}
              </button>
              <button
                onClick={() => scrollToSection("education")}
                className="text-foreground hover:text-primary transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-accent/10"
              >
                {t("nav.education")}
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="text-foreground hover:text-primary transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-accent/10"
              >
                {t("nav.projects")}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground hover:text-primary transition-all duration-200 font-medium px-3 py-2 rounded-lg hover:bg-accent/10"
              >
                {t("nav.contact")}
              </button>
            </div>
          </div>

          {/* Theme and Language Controls */}
          <div className="flex items-center space-x-2">
            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="hover:bg-accent/10">
                  <Globe className="h-4 w-4" />
                  <span className="ml-1 text-sm">{language.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-background border-border">
                <DropdownMenuItem onClick={() => setLanguage("es")} className="hover:bg-accent/10">
                  🇪🇸 Español
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")} className="hover:bg-accent/10">
                  🇺🇸 English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="hover:bg-accent/10"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="hover:bg-accent/10"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background/95 backdrop-blur-md border-b border-border">
              <button
                onClick={() => scrollToSection("about")}
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent/10 transition-all duration-200 w-full text-left rounded-lg"
              >
                {t("nav.about")}
              </button>
              <button
                onClick={() => scrollToSection("experience")}
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent/10 transition-all duration-200 w-full text-left rounded-lg"
              >
                {t("nav.experience")}
              </button>
              <button
                onClick={() => scrollToSection("education")}
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent/10 transition-all duration-200 w-full text-left rounded-lg"
              >
                {t("nav.education")}
              </button>
              <button
                onClick={() => scrollToSection("projects")}
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent/10 transition-all duration-200 w-full text-left rounded-lg"
              >
                {t("nav.projects")}
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="block px-3 py-2 text-base font-medium text-foreground hover:text-primary hover:bg-accent/10 transition-all duration-200 w-full text-left rounded-lg"
              >
                {t("nav.contact")}
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
