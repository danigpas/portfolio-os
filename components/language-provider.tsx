"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

/**
 * Traducciones de la UI. Sólo se mantienen las claves realmente usadas por
 * algún `t()` (títulos de sección y textos de contacto). Los datos del CV
 * (experiencia, educación, proyectos, skills...) viven en `lib/cv-data.ts`.
 */
const translations = {
  es: {
    "about.title": "Sobre Mí",
    "about.stat.years": "Años de Experiencia",
    "about.stat.sites": "Sitios Integrados",
    "about.stat.items": "Artículos Gestionados",

    "experience.title": "Experiencia",
    "education.title": "Educación",
    "projects.title": "Proyectos Destacados",

    "contact.title": "Contacto",
    "contact.description": "Estoy siempre abierto a nuevas oportunidades y colaboraciones. ¡Hablemos!",
    "contact.email": "Enviar Email",
  },
  en: {
    "about.title": "About Me",
    "about.stat.years": "Years of Experience",
    "about.stat.sites": "Integrated Sites",
    "about.stat.items": "Managed Items",

    "experience.title": "Experience",
    "education.title": "Education",
    "projects.title": "Featured Projects",

    "contact.title": "Contact",
    "contact.description": "I'm always open to new opportunities and collaborations. Let's talk!",
    "contact.email": "Send Email",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "es" || savedLanguage === "en")) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang
  }

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
