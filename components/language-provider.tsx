"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "es" | "en"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  es: {
    // Navigation
    "nav.about": "Sobre Mí",
    "nav.experience": "Experiencia",
    "nav.education": "Educación",
    "nav.projects": "Proyectos",
    "nav.contact": "Contacto",

    // Hero Section
    "hero.title": "Transformando Ideas en Código Eficiente",
    "hero.subtitle": "Desarrollador Backend Python | Pasión por la Innovación",
    "hero.description":
      "Especializado en crear APIs robustas y escalables con más de 2 años de experiencia en el ecosistema Python.",
    "hero.cta": "Explora Mis Proyectos",
    "hero.contact": "Contactar",
    "hero.downloadCV": "Descargar CV",

    // About Section
    "about.title": "Sobre Mí",
    "about.description":
      "Como desarrollador backend especializado en el stack de Python con 2+ años de experiencia, me apasiona construir la lógica robusta y escalable que potencia las aplicaciones. Mi enfoque se centra en la trazabilidad de los datos, la optimización de procesos y el diseño de APIs eficientes.",
    "about.location": "Málaga, España",

    // Experience Section
    "experience.title": "Experiencia",
    "experience.disofic.title": "Desarrollador de Backend",
    "experience.disofic.company": "DisOfic",
    "experience.disofic.period": "Sept 2023 - Actualidad · 2 años",
    "experience.disofic.description1":
      "Desarrollo de API de integración en tiempo real: Lideré el diseño e implementación de una API con FastAPI para sincronizar más de 50 sitios de WordPress con el CRM Odoo. Esta solución automatizó la consulta de stock y precios de más de 12,000 productos y la gestión de pedidos, mejorando la eficiencia operativa.",
    "experience.disofic.description2":
      "Optimización de procesos con scripts en Python: Creé scripts y tareas programadas en Python para la sincronización masiva de clientes y artículos, reemplazando procesos manuales que tomaban días y reduciendo el tiempo de ejecución a solo dos horas.",
    "experience.disofic.description3":
      "Mejora de la experiencia de compra y reducción de incidencias: Implementé una API para la consulta de precios y stock en tiempo real en las páginas de producto. Esto eliminó las discrepancias de inventario, lo que resultó en un aumento del volumen de ventas y una reducción del 50% en las incidencias relacionadas con pedidos.",
    "experience.disofic.description4":
      "Implementación de arquitectura asíncrona: Desarrollé un sistema de workers con Celery, Redis y RabbitMQ para la sincronización masiva de datos en segundo plano entre Odoo y WordPress Multisite, garantizando la coherencia y el rendimiento de las plataformas.",
    "experience.disofic.description5":
      "Manejo avanzado de bases de datos: Trabajé de forma habitual con MySQL, PostgreSQL y Oracle (12), realizando tareas de creación de tablas, optimización de consultas, actualización y gestión de backups, asegurando la integridad de los datos en toda la infraestructura.",

    "experience.internship.title": "Desarrollador de Aplicaciones",
    "experience.internship.company": "DisOfic - Contrato de Prácticas",
    "experience.internship.period": "Jun 2023 - Sept 2023 · 4 meses",
    "experience.internship.description":
      "Lideré el desarrollo de una aplicación totalmente nueva para la gestión del almacén y la entrada y salida de su mercancía. Para ello montamos mis compañeros y yo una aplicación de escritorio en C# la cual presentamos que mejora tanto en funcionalidad como en velocidad y sencillez a la actual en Oracle Forms de la que disponían.",
    "experience.internship.skills": "Arquitectura de aplicación",

    // Education Section
    "education.title": "Educación",

    "education.daw.title": "Grado Superior en Desarrollo de Aplicaciones Web (DAW)",
    "education.daw.institution": "Junta de Andalucía",
    "education.daw.period": "Sept 2025 - Jun 2027",
    "education.daw.description":
      "Próximo a comenzar el Grado Superior en Desarrollo de Aplicaciones Web para ampliar mis conocimientos en tecnologías frontend y fullstack.",
    "education.daw.upcoming": "Próximamente",

    "education.cesur.title": "Certificado de Profesionalidad - Programación de Sistemas Informáticos",
    "education.cesur.institution": "Cesur",
    "education.cesur.period": "Feb 2023 - Jun 2023",
    "education.cesur.description":
      "Especialización en desarrollo de aplicaciones con enfoque en programación orientada a objetos y gestión de bases de datos.",

    "education.uma.title": "Grado en Ingeniería Informática",
    "education.uma.institution": "Universidad de Málaga",
    "education.uma.period": "Sept 2017 - Sept 2021",
    "education.uma.description":
      "Formación sólida en fundamentos de programación, estructuras de datos, algoritmos y desarrollo de software.",
    "education.uma.skills": "Habilidades sociales",
    "education.uma.problem_solving": "Resolución de problemas",

    "education.uimp.title": "Curso de Inmersión en la Lengua Inglesa",
    "education.uimp.institution": "Universidad Internacional Menéndez Pelayo",
    "education.uimp.period": "Jul 2019 - Jul 2019",
    "education.uimp.description":
      "Curso intensivo de inglés para mejorar las competencias lingüísticas en entorno académico.",
    "education.uimp.skills": "Habilidades sociales",

    // Projects Section
    "projects.title": "Proyectos Destacados",
    "projects.blog.title": "El Nieto de Pascual",
    "projects.blog.description":
      "Blog personal donde comparto conocimientos sobre desarrollo backend y tecnologías Python.",
    "projects.portfolio.title": "Portfolio Retro NES",
    "projects.portfolio.description":
      "Portfolio con estética retro inspirada en la consola NES, desarrollado con tecnologías web modernas.",

    // Skills Section
    "skills.title": "Tecnologías",
    "skills.backend": "Backend",
    "skills.databases": "Bases de Datos",
    "skills.tools": "Herramientas",

    // Contact Section
    "contact.title": "Contacto",
    "contact.description": "Estoy siempre abierto a nuevas oportunidades y colaboraciones. ¡Hablemos!",
    "contact.email": "Enviar Email",

    // Footer
    "footer.rights": "Todos los derechos reservados.",
    "footer.built": "Construido con",
  },
  en: {
    // Navigation
    "nav.about": "About",
    "nav.experience": "Experience",
    "nav.education": "Education",
    "nav.projects": "Projects",
    "nav.contact": "Contact",

    // Hero Section
    "hero.title": "Transforming Ideas into Efficient Code",
    "hero.subtitle": "Backend Python Developer | Passion for Innovation",
    "hero.description":
      "Specialized in creating robust and scalable APIs with over 2 years of experience in the Python ecosystem.",
    "hero.cta": "Explore My Projects",
    "hero.contact": "Contact Me",
    "hero.downloadCV": "Download CV",

    // About Section
    "about.title": "About Me",
    "about.description":
      "As a backend developer specialized in the Python stack with 2+ years of experience, I am passionate about building robust and scalable logic that powers applications. My focus is on data traceability, process optimization, and efficient API design.",
    "about.location": "Málaga, Spain",

    // Experience Section
    "experience.title": "Experience",
    "experience.disofic.title": "Backend Developer",
    "experience.disofic.company": "DisOfic",
    "experience.disofic.period": "Sept 2023 - Present · 2 years",
    "experience.disofic.description1":
      "Real-time integration API development: Led the design and implementation of a FastAPI to synchronize over 50 WordPress sites with Odoo CRM. This solution automated stock and price queries for over 12,000 products and order management, improving operational efficiency.",
    "experience.disofic.description2":
      "Process optimization with Python scripts: Created scripts and scheduled tasks in Python for massive synchronization of clients and articles, replacing manual processes that took days and reducing execution time to just two hours.",
    "experience.disofic.description3":
      "Improved shopping experience and reduced incidents: Implemented an API for real-time price and stock queries on product pages. This eliminated inventory discrepancies, resulting in increased sales volume and a 50% reduction in order-related incidents.",
    "experience.disofic.description4":
      "Asynchronous architecture implementation: Developed a worker system with Celery, Redis and RabbitMQ for massive background data synchronization between Odoo and WordPress Multisite, ensuring platform coherence and performance.",
    "experience.disofic.description5":
      "Advanced database management: Worked regularly with MySQL, PostgreSQL and Oracle (12), performing table creation, query optimization, updates and backup management tasks, ensuring data integrity across the entire infrastructure.",

    "experience.internship.title": "Application Developer",
    "experience.internship.company": "DisOfic - Internship Contract",
    "experience.internship.period": "Jun 2023 - Sept 2023 · 4 months",
    "experience.internship.description":
      "Led the development of a completely new application for warehouse management and merchandise input/output. My colleagues and I built a desktop application in C# which we presented that improves both functionality, speed and simplicity compared to the current Oracle Forms they had.",
    "experience.internship.skills": "Application architecture",

    // Education Section
    "education.title": "Education",

    "education.daw.title": "Higher Degree in Web Application Development (DAW)",
    "education.daw.institution": "Junta de Andalucía",
    "education.daw.period": "Sept 2025 - Jun 2027",
    "education.daw.description":
      "About to start the Higher Degree in Web Application Development to expand my knowledge in frontend and fullstack technologies.",
    "education.daw.upcoming": "Coming Soon",

    "education.cesur.title": "Professional Certificate - Computer Systems Programming",
    "education.cesur.institution": "Cesur",
    "education.cesur.period": "Feb 2023 - Jun 2023",
    "education.cesur.description":
      "Specialization in application development with focus on object-oriented programming and database management.",

    "education.uma.title": "Degree in Computer Engineering",
    "education.uma.institution": "University of Málaga",
    "education.uma.period": "Sept 2017 - Sept 2021",
    "education.uma.description":
      "Solid foundation in programming fundamentals, data structures, algorithms and software development.",
    "education.uma.skills": "Social skills",
    "education.uma.problem_solving": "Problem solving",

    "education.uimp.title": "English Language Immersion Course",
    "education.uimp.institution": "Universidad Internacional Menéndez Pelayo",
    "education.uimp.period": "Jul 2019 - Jul 2019",
    "education.uimp.description": "Intensive English course to improve language skills in academic environment.",
    "education.uimp.skills": "Social skills",

    // Projects Section
    "projects.title": "Featured Projects",
    "projects.blog.title": "El Nieto de Pascual",
    "projects.blog.description":
      "Personal blog where I share knowledge about backend development and Python technologies.",
    "projects.portfolio.title": "Retro NES Portfolio",
    "projects.portfolio.description":
      "Portfolio with retro aesthetics inspired by the NES console, developed with modern web technologies.",

    // Skills Section
    "skills.title": "Technologies",
    "skills.backend": "Backend",
    "skills.databases": "Databases",
    "skills.tools": "Tools",

    // Contact Section
    "contact.title": "Contact",
    "contact.description": "I'm always open to new opportunities and collaborations. Let's talk!",
    "contact.email": "Send Email",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.built": "Built with",
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
