/**
 * lib/cv-data.ts
 *
 * Única fuente de verdad de los datos del CV en el frontend (ES/EN).
 * Cualquier componente (landing SSR, escritorio, terminal, apps) debe leer de aquí.
 * Tipado estricto: no añadir datos sueltos en los componentes.
 */

export type Language = "es" | "en"

export interface ExperienceItem {
  id: string
  company: string
  role: string
  location: string
  /** Periodo legible para mostrar, ej. "Sept 2023 - Mar 2026 · 2 años 6 meses". */
  period: string
  /** Fecha de inicio legible, ej. "Sept 2023". */
  start: string
  /** Fecha de fin legible o null si es el puesto actual. */
  end: string | null
  current: boolean
  type: string
  summary: string
  highlights: string[]
  stack: string[]
}

export interface EducationItem {
  id: string
  title: string
  institution: string
  location: string
  period: string
  /** Estado opcional ("En curso", "Completado", ...). */
  status?: string
  description: string
  /** Etiquetas/skills mostradas como badges en el escritorio. */
  tags?: string[]
}

export interface ProjectItem {
  id: string
  name: string
  description: string
  stack: string[]
  /** URL pública del proyecto (demo/landing). Sólo si es real. */
  url?: string
  /** URL pública del repositorio. Sólo si es real. */
  repo?: string
  /** Imagen pública para la tarjeta del escritorio. */
  image?: string
  /** Marca el proyecto como destacado en el escritorio. */
  featured?: boolean
  /** Tipo legible ("Blog personal", "Portfolio personal", ...). */
  type?: string
  /** Estado legible ("Activo", "Completado", ...). */
  status?: string
}

export interface SkillGroup {
  category: string
  items: string[]
}

export interface ContactInfo {
  email: string
  location: string
  github: string
  linkedin: string
  website: string
  /** Ruta pública del PDF del CV. */
  cvPath: string
}

export interface AboutInfo {
  name: string
  role: string
  tagline: string
  summary: string
  location: string
  yearsOfExperience: string
  /** Resumen en 3 bullets para la landing SSR. */
  bullets: string[]
}

export interface CVData {
  about: AboutInfo
  experience: ExperienceItem[]
  education: EducationItem[]
  projects: ProjectItem[]
  skills: SkillGroup[]
  contact: ContactInfo
  meta: {
    title: string
    description: string
    keywords: string[]
  }
}

export const DEFAULT_LANGUAGE: Language = "es"

const contact = {
  email: "danigpascual@protonmail.com",
  location: "Málaga, España",
  github: "https://github.com/danielgonzalezpascual",
  linkedin: "https://linkedin.com/in/daniel-gonzalez-pascual",
  website: "https://danigpascual.dev",
  cvPath: "/cv-daniel-gonzalez-pascual.pdf",
} as const

export const cvData: Record<Language, CVData> = {
  es: {
    about: {
      name: "Daniel González Pascual",
      role: "Desarrollador Backend Python",
      tagline: "APIs robustas, datos trazables y procesos que no se caen.",
      summary:
        "Desarrollador backend especializado en el ecosistema Python. Diseño e implemento APIs, integraciones y automatizaciones con foco en la trazabilidad de datos, el rendimiento y la mantenibilidad.",
      location: "Málaga, España",
      yearsOfExperience: "3+ años",
      bullets: [
        "APIs e integraciones en tiempo real con FastAPI para sincronizar +50 sitios WordPress con el CRM Odoo.",
        "Automatización de procesos de datos con Python, Celery, Redis y RabbitMQ: de días a horas.",
        "Experiencia actual en el sector del mercado eléctrico como Desarrollador Python Semi-Senior en Inforyde.",
      ],
    },
    experience: [
      {
        id: "inforyde",
        company: "Inforyde",
        role: "Desarrollador Python Semi-Senior",
        location: "Madrid, España",
        period: "Mar 2026 - Actualidad",
        start: "Mar 2026",
        end: null,
        current: true,
        type: "Jornada completa",
        summary:
          "Desarrollo de aplicaciones y servicios backend en Python en Inforyde, consultora especializada en el mercado eléctrico ubicada en Madrid.",
        highlights: [
          "Análisis, desarrollo y mantenimiento de soluciones para clientes del sector energético.",
          "Trabajo en equipos multidisciplinares con buenas prácticas de desarrollo, testing y control de versiones.",
        ],
        stack: ["Python", "FastAPI", "SQL", "Git"],
      },
      {
        id: "disofic-backend",
        company: "DisOfic",
        role: "Desarrollador Backend",
        location: "Málaga, España",
        period: "Sept 2023 - Mar 2026 · 2 años 6 meses",
        start: "Sept 2023",
        end: "Mar 2026",
        current: false,
        type: "Jornada completa",
        summary:
          "Desarrollo de API de integración en tiempo real con FastAPI para sincronizar +50 sitios WordPress con el CRM Odoo.",
        highlights: [
          "Automaticé la consulta de stock y precios de +12.000 productos y la gestión de pedidos.",
          "Creé scripts y tareas programadas que redujeron procesos manuales de días a 2 horas.",
          "Implementé una arquitectura asíncrona con workers Celery, Redis y RabbitMQ.",
          "Gestión habitual de MySQL, PostgreSQL y Oracle 12 (tablas, consultas, backups).",
        ],
        stack: ["Python", "FastAPI", "Celery", "Redis", "RabbitMQ", "MySQL", "PostgreSQL", "Oracle"],
      },
      {
        id: "disofic-internship",
        company: "DisOfic",
        role: "Desarrollador de Aplicaciones (Prácticas)",
        location: "Málaga, España",
        period: "Jun 2023 - Sept 2023 · 4 meses",
        start: "Jun 2023",
        end: "Sept 2023",
        current: false,
        type: "Contrato de prácticas",
        summary:
          "Desarrollo de una aplicación de escritorio en C# para la gestión de almacén y entrada/salida de mercancía.",
        highlights: [
          "Mejoré funcionalidad, velocidad y sencillez respecto al sistema Oracle Forms existente.",
        ],
        stack: ["C#", ".NET", "Oracle Forms"],
      },
    ],
    education: [
      {
        id: "daw",
        title: "Grado Superior en Desarrollo de Aplicaciones Web (DAW)",
        institution: "Junta de Andalucía",
        location: "Málaga, España",
        period: "Sept 2025 - Jun 2027",
        status: "En curso",
        description:
          "Cursando actualmente el Grado Superior en Desarrollo de Aplicaciones Web para ampliar conocimientos en tecnologías frontend y fullstack.",
        tags: [],
      },
      {
        id: "cesur",
        title: "Certificado de Profesionalidad - Programación de Sistemas Informáticos",
        institution: "Cesur",
        location: "Málaga, España",
        period: "Feb 2023 - Jun 2023",
        status: "Completado",
        description:
          "Especialización en desarrollo de aplicaciones con enfoque en programación orientada a objetos y gestión de bases de datos.",
        tags: ["HTML", "GitHub", "Visual Studio", "C#", "Documentación", "MySQL", ".NET Framework"],
      },
      {
        id: "uma",
        title: "Grado en Ingeniería Informática",
        institution: "Universidad de Málaga",
        location: "Málaga, España",
        period: "Sept 2017 - Sept 2021",
        status: "Completado",
        description:
          "Formación en fundamentos de programación, estructuras de datos, algoritmos y desarrollo de software.",
        tags: ["Documentación", "Habilidades sociales", "Resolución de problemas"],
      },
      {
        id: "uimp",
        title: "Curso de Inmersión en la Lengua Inglesa",
        institution: "Universidad Internacional Menéndez Pelayo",
        location: "Santander, España",
        period: "Jul 2019",
        status: "Completado",
        description: "Curso intensivo de inglés en entorno académico.",
        tags: ["Habilidades sociales", "B1"],
      },
    ],
    projects: [
      {
        id: "portfolio-os",
        name: "Portfolio OS",
        description:
          "Este portfolio: landing SSR con SEO y un escritorio tipo Omarchy navegable, construido con Next.js 15, React 19 y Tailwind v4.",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        url: "https://danigpascual.dev",
        repo: "https://github.com/danielgonzalezpascual",
        image: "/modern-blog-interface.png",
        featured: true,
        type: "Portfolio personal",
        status: "Activo",
      },
      {
        id: "el-nieto-de-pascual",
        name: "El Nieto de Pascual",
        description: "Blog personal donde comparto conocimientos sobre desarrollo backend y tecnologías Python.",
        stack: ["Python", "Markdown", "Web"],
        url: "https://elnietodepascual.com",
        image: "/python-backend-blog.png",
        featured: true,
        type: "Blog personal",
        status: "Activo",
      },
      {
        id: "portfolio-retro-nes",
        name: "Portfolio Retro NES",
        description: "Portfolio con estética retro inspirada en la consola NES, desarrollado con tecnologías web modernas.",
        stack: ["HTML", "CSS", "JavaScript"],
        image: "/retro-nes-portfolio.png",
        featured: false,
        type: "Portfolio personal",
        status: "Completado",
      },
    ],
    skills: [
      { category: "Backend", items: ["Python", "FastAPI", "Django", "Celery", "Redis", "RabbitMQ"] },
      { category: "Bases de datos", items: ["PostgreSQL", "MySQL", "Oracle", "SQL"] },
      { category: "Herramientas", items: ["Docker", "Git", "Linux", "CI/CD"] },
    ],
    contact: { ...contact },
    meta: {
      title: "Daniel González Pascual - Desarrollador Backend Python",
      description:
        "Portfolio de Daniel González Pascual, desarrollador backend Python. APIs con FastAPI, integraciones en tiempo real, automatización de datos y experiencia en el mercado eléctrico.",
      keywords: [
        "Daniel González Pascual",
        "desarrollador backend",
        "Python",
        "FastAPI",
        "portfolio",
        "Málaga",
        "mercado eléctrico",
      ],
    },
  },
  en: {
    about: {
      name: "Daniel González Pascual",
      role: "Backend Python Developer",
      tagline: "Robust APIs, traceable data and processes that stay up.",
      summary:
        "Backend developer specialized in the Python ecosystem. I design and build APIs, integrations and automations focused on data traceability, performance and maintainability.",
      location: "Málaga, Spain",
      yearsOfExperience: "3+ years",
      bullets: [
        "Real-time APIs and integrations with FastAPI syncing 50+ WordPress sites with Odoo CRM.",
        "Data process automation with Python, Celery, Redis and RabbitMQ: from days to hours.",
        "Currently working in the electricity market sector as a Semi-Senior Python Developer at Inforyde.",
      ],
    },
    experience: [
      {
        id: "inforyde",
        company: "Inforyde",
        role: "Semi-Senior Python Developer",
        location: "Madrid, Spain",
        period: "Mar 2026 - Present",
        start: "Mar 2026",
        end: null,
        current: true,
        type: "Full-time",
        summary:
          "Python backend application and service development at Inforyde, a consultancy specialized in the electricity market based in Madrid.",
        highlights: [
          "Analysis, development and maintenance of solutions for energy sector clients.",
          "Working in multidisciplinary teams with good development, testing and version control practices.",
        ],
        stack: ["Python", "FastAPI", "SQL", "Git"],
      },
      {
        id: "disofic-backend",
        company: "DisOfic",
        role: "Backend Developer",
        location: "Málaga, Spain",
        period: "Sept 2023 - Mar 2026 · 2.5 years",
        start: "Sept 2023",
        end: "Mar 2026",
        current: false,
        type: "Full-time",
        summary:
          "Real-time integration API development with FastAPI to synchronize 50+ WordPress sites with Odoo CRM.",
        highlights: [
          "Automated stock and price queries for 12,000+ products and order management.",
          "Built scripts and scheduled tasks that reduced manual processes from days to 2 hours.",
          "Implemented an asynchronous architecture with Celery, Redis and RabbitMQ workers.",
          "Regular work with MySQL, PostgreSQL and Oracle 12 (tables, queries, backups).",
        ],
        stack: ["Python", "FastAPI", "Celery", "Redis", "RabbitMQ", "MySQL", "PostgreSQL", "Oracle"],
      },
      {
        id: "disofic-internship",
        company: "DisOfic",
        role: "Application Developer (Internship)",
        location: "Málaga, Spain",
        period: "Jun 2023 - Sept 2023 · 4 months",
        start: "Jun 2023",
        end: "Sept 2023",
        current: false,
        type: "Internship",
        summary:
          "Developed a C# desktop application for warehouse management and merchandise input/output.",
        highlights: ["Improved functionality, speed and simplicity over the existing Oracle Forms system."],
        stack: ["C#", ".NET", "Oracle Forms"],
      },
    ],
    education: [
      {
        id: "daw",
        title: "Higher Degree in Web Application Development (DAW)",
        institution: "Junta de Andalucía",
        location: "Málaga, Spain",
        period: "Sept 2025 - Jun 2027",
        status: "In progress",
        description:
          "Currently studying the Higher Degree in Web Application Development to expand my knowledge in frontend and fullstack technologies.",
        tags: [],
      },
      {
        id: "cesur",
        title: "Professional Certificate - Computer Systems Programming",
        institution: "Cesur",
        location: "Málaga, Spain",
        period: "Feb 2023 - Jun 2023",
        status: "Completed",
        description:
          "Specialization in application development focused on object-oriented programming and database management.",
        tags: ["HTML", "GitHub", "Visual Studio", "C#", "Documentation", "MySQL", ".NET Framework"],
      },
      {
        id: "uma",
        title: "Degree in Computer Engineering",
        institution: "University of Málaga",
        location: "Málaga, Spain",
        period: "Sept 2017 - Sept 2021",
        status: "Completed",
        description: "Solid foundation in programming fundamentals, data structures, algorithms and software development.",
        tags: ["Documentation", "Social skills", "Problem solving"],
      },
      {
        id: "uimp",
        title: "English Language Immersion Course",
        institution: "Universidad Internacional Menéndez Pelayo",
        location: "Santander, Spain",
        period: "Jul 2019",
        status: "Completed",
        description: "Intensive English course in an academic environment.",
        tags: ["Social skills", "B1"],
      },
    ],
    projects: [
      {
        id: "portfolio-os",
        name: "Portfolio OS",
        description:
          "This portfolio: an SSR landing with SEO and a navigable Omarchy-style desktop, built with Next.js 15, React 19 and Tailwind v4.",
        stack: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
        url: "https://danigpascual.dev",
        repo: "https://github.com/danielgonzalezpascual",
        image: "/modern-blog-interface.png",
        featured: true,
        type: "Personal portfolio",
        status: "Active",
      },
      {
        id: "el-nieto-de-pascual",
        name: "El Nieto de Pascual",
        description: "Personal blog where I share knowledge about backend development and Python technologies.",
        stack: ["Python", "Markdown", "Web"],
        url: "https://elnietodepascual.com",
        image: "/python-backend-blog.png",
        featured: true,
        type: "Personal blog",
        status: "Active",
      },
      {
        id: "portfolio-retro-nes",
        name: "Retro NES Portfolio",
        description: "Portfolio with a retro aesthetic inspired by the NES console, built with modern web technologies.",
        stack: ["HTML", "CSS", "JavaScript"],
        image: "/retro-nes-portfolio.png",
        featured: false,
        type: "Personal portfolio",
        status: "Completed",
      },
    ],
    skills: [
      { category: "Backend", items: ["Python", "FastAPI", "Django", "Celery", "Redis", "RabbitMQ"] },
      { category: "Databases", items: ["PostgreSQL", "MySQL", "Oracle", "SQL"] },
      { category: "Tools", items: ["Docker", "Git", "Linux", "CI/CD"] },
    ],
    contact: { ...contact },
    meta: {
      title: "Daniel González Pascual - Backend Python Developer",
      description:
        "Portfolio of Daniel González Pascual, backend Python developer. FastAPI APIs, real-time integrations, data automation and electricity market experience.",
      keywords: [
        "Daniel González Pascual",
        "backend developer",
        "Python",
        "FastAPI",
        "portfolio",
        "Málaga",
        "electricity market",
      ],
    },
  },
}

export function getCvData(language: Language = DEFAULT_LANGUAGE): CVData {
  return cvData[language] ?? cvData[DEFAULT_LANGUAGE]
}
