"use client"

import { useState, useEffect } from "react"
import {
  X,
  Minimize2,
  Maximize2,
  Play,
  User,
  Briefcase,
  GraduationCap,
  Code,
  Mail,
  Download,
  Eye,
  Settings,
  BookOpen,
  MessageSquare,
  FileText,
  Presentation,
  Award,
  BarChart3,
  Calendar,
  Smartphone,
} from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useTheme } from "@/components/theme-system"
import { AboutSection } from "@/components/about-section"
import { ExperienceSection } from "@/components/experience-section"
import { EducationSection } from "@/components/education-section"
import { ProjectsSection } from "@/components/projects-section"
import { ContactSection } from "@/components/contact-section"
import { TechnicalBlog } from "@/components/technical-blog"
import { Testimonials } from "@/components/testimonials"
import { CaseStudies } from "@/components/case-studies"
import { Certifications } from "@/components/certifications"
import { AnalyticsDashboard } from "@/components/analytics-dashboard"
import { AvailabilityCalendar } from "@/components/availability-calendar"
import { PWAFeatures } from "@/components/pwa-installer"
import { PresentationMode } from "@/components/presentation-mode"
import { LoadingOverlay } from "@/components/loading-states"
import { ApiMetrics } from "@/components/api-metrics"
import { DeveloperMode } from "@/components/developer-mode"

interface PostmanAppProps {
  onMinimize?: () => void
  onMaximize?: () => void
  onClose?: () => void
  initialSection?: string
}

export function PostmanApp({ onMinimize, onMaximize, onClose, initialSection = "GET /about" }: PostmanAppProps) {
  const { t, language } = useLanguage()
  const { theme, getAppClasses } = useTheme()
  const [activeEndpoint, setActiveEndpoint] = useState(initialSection)
  const [isMaximized, setIsMaximized] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [showDeveloperMode, setShowDeveloperMode] = useState(false)
  const [showPresentationMode, setShowPresentationMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (initialSection) {
      setActiveEndpoint(initialSection)
      setShowPreview(false) // Reset preview cuando cambia desde dock
    }
  }, [initialSection])

  const endpoints = [
    { method: "GET", path: "/about", name: "Sobre mí", icon: User, color: "text-green-500" },
    { method: "GET", path: "/experience", name: "Experiencia", icon: Briefcase, color: "text-blue-500" },
    { method: "GET", path: "/education", name: "Educación", icon: GraduationCap, color: "text-purple-500" },
    { method: "GET", path: "/projects", name: "Proyectos", icon: Code, color: "text-orange-500" },
    { method: "GET", path: "/certifications", name: "Certificaciones", icon: Award, color: "text-yellow-500" },
    { method: "GET", path: "/blog", name: "Blog Técnico", icon: BookOpen, color: "text-indigo-500" },
    { method: "GET", path: "/testimonials", name: "Testimonios", icon: MessageSquare, color: "text-pink-500" },
    { method: "GET", path: "/case-studies", name: "Case Studies", icon: FileText, color: "text-teal-500" },
    { method: "GET", path: "/analytics", name: "Analytics", icon: BarChart3, color: "text-cyan-500" },
    { method: "GET", path: "/availability", name: "Disponibilidad", icon: Calendar, color: "text-emerald-500" },
    { method: "GET", path: "/pwa", name: "PWA Features", icon: Smartphone, color: "text-violet-500" },
    { method: "POST", path: "/contact", name: "Contacto", icon: Mail, color: "text-red-500" },
  ]

  const handleEndpointClick = (endpoint: string) => {
    setIsLoading(true)
    setActiveEndpoint(endpoint)
    setShowPreview(false)

    // Simulate API loading
    setTimeout(() => {
      setIsLoading(false)
    }, 800)
  }

  const renderPreviewComponent = () => {
    const components = {
      "GET /about": <AboutSection />,
      "GET /experience": <ExperienceSection />,
      "GET /education": <EducationSection />,
      "GET /projects": <ProjectsSection />,
      "GET /certifications": <Certifications />,
      "GET /blog": <TechnicalBlog />,
      "GET /testimonials": <Testimonials />,
      "GET /case-studies": <CaseStudies />,
      "GET /analytics": <AnalyticsDashboard />,
      "GET /availability": <AvailabilityCalendar />,
      "GET /pwa": <PWAFeatures />,
      "POST /contact": <ContactSection />,
    }

    return (
      components[activeEndpoint as keyof typeof components] || (
        <div className="p-8 text-center text-gray-500">Componente no encontrado</div>
      )
    )
  }

  const getEndpointData = (endpoint: string) => {
    const endpointData = {
      "GET /about": {
        status: 200,
        responseTime: "45ms",
        data: {
          name: "Daniel González Pascual",
          role: "Desarrollador Backend Python",
          location: "Málaga, España",
          description:
            language === "es"
              ? "Desarrollador backend especializado en Python con experiencia en FastAPI, Django y arquitecturas escalables. Apasionado por crear soluciones eficientes y robustas."
              : "Backend developer specialized in Python with experience in FastAPI, Django and scalable architectures. Passionate about creating efficient and robust solutions.",
          skills: ["Python", "FastAPI", "Django", "PostgreSQL", "Redis", "Docker", "AWS"],
          yearsOfExperience: 2.3,
          currentlyLearning: "Desarrollo de Aplicaciones Web (DAW)",
        },
      },
      "GET /analytics": {
        status: 200,
        responseTime: "78ms",
        data: {
          totalViews: 12547,
          uniqueVisitors: 8932,
          averageTime: "3:42",
          bounceRate: 32.5,
          realTimeUsers: 23,
          conversionRate: 4.2,
          topPages: [
            { page: "/about", views: 4521, percentage: 36 },
            { page: "/projects", views: 3876, percentage: 31 },
            { page: "/experience", views: 2234, percentage: 18 },
          ],
          deviceTypes: [
            { type: "Desktop", percentage: 58 },
            { type: "Mobile", percentage: 35 },
            { type: "Tablet", percentage: 7 },
          ],
        },
      },
      "GET /availability": {
        status: 200,
        responseTime: "34ms",
        data: {
          currentStatus: "available",
          nextAvailableSlot: "2024-01-16T09:00:00Z",
          totalSlotsThisWeek: 15,
          availableSlotsThisWeek: 8,
          contactMethods: [
            { type: "email", available: true, responseTime: "< 24 horas" },
            { type: "linkedin", available: true, responseTime: "< 12 horas" },
            { type: "whatsapp", available: true, responseTime: "< 2 horas" },
          ],
          upcomingSlots: [
            { date: "2024-01-16", time: "09:00", type: "consultation", duration: 30 },
            { date: "2024-01-16", time: "15:00", type: "interview", duration: 60 },
          ],
        },
      },
      "GET /pwa": {
        status: 200,
        responseTime: "23ms",
        data: {
          isInstallable: true,
          isInstalled: false,
          features: [
            { name: "Offline Support", available: true },
            { name: "Push Notifications", available: true },
            { name: "Background Sync", available: true },
            { name: "Native App Experience", available: true },
          ],
          manifest: {
            name: "Daniel González Pascual - Portfolio",
            shortName: "Daniel Portfolio",
            startUrl: "/",
            display: "standalone",
            themeColor: "#f97316",
          },
        },
      },
      "GET /certifications": {
        status: 200,
        responseTime: "52ms",
        data: {
          totalCertifications: 5,
          verifiedCertifications: 5,
          expertLevel: 2,
          categories: ["Programming", "Web Development", "Cloud Computing", "DevOps", "Database"],
          certifications: [
            {
              id: "python-advanced",
              name: "Python Advanced Programming",
              issuer: "Python Institute",
              level: "Advanced",
              verified: true,
              skills: ["Python", "OOP", "Advanced Concepts", "Data Structures"],
            },
            {
              id: "fastapi-expert",
              name: "FastAPI Expert Developer",
              issuer: "FastAPI Academy",
              level: "Expert",
              verified: true,
              skills: ["FastAPI", "Async Programming", "API Design", "Performance"],
            },
          ],
        },
      },
      "GET /experience": {
        status: 200,
        responseTime: "38ms",
        data: [
          {
            company: "DisOfic",
            position: "Desarrollador Backend",
            duration: "Sept 2023 - Actualidad (2 años 3 meses)",
            type: "Jornada completa",
            description:
              "Desarrollo de API de integración en tiempo real con FastAPI para sincronizar +50 sitios WordPress con CRM Odoo. Optimización de procesos con Python, mejora de experiencia de compra, implementación de arquitectura asíncrona con Celery, Redis y RabbitMQ.",
            technologies: ["Python", "FastAPI", "MySQL", "PostgreSQL", "Redis", "Celery", "RabbitMQ"],
            achievements: [
              "Automatización de consulta de stock y precios de +12,000 productos",
              "Reducción del 50% en incidencias relacionadas con pedidos",
              "Implementación de sistema de workers para sincronización masiva",
            ],
          },
          {
            company: "DisOfic",
            position: "Desarrollador de Aplicaciones",
            duration: "Jun 2023 - Sept 2023 (4 meses)",
            type: "Contrato de prácticas",
            description:
              "Desarrollo de aplicación para gestión de almacén y entrada/salida de mercancía. Aplicación de escritorio en C# con Oracle Forms.",
            technologies: ["C#", "Oracle Forms", "Arquitectura de aplicación"],
            achievements: ["Mejora en funcionalidad y velocidad de la aplicación existente"],
          },
        ],
      },
      "GET /education": {
        status: 200,
        responseTime: "42ms",
        data: [
          {
            institution: "Junta de Andalucía",
            degree: "Técnico Superior en Desarrollo de Aplicaciones Web (DAW)",
            period: "Sept 2025 - Jun 2027",
            status: "En curso",
            description: "Formación avanzada en desarrollo web full-stack",
          },
          {
            institution: "Cesur",
            degree: "Certificado de Profesionalidad - Programación de Sistemas Informáticos",
            period: "Feb 2023 - Jun 2023",
            status: "Completado",
            specialization: "Desarrollo de aplicaciones",
            skills: [
              "HTML",
              "GitHub",
              "Visual Studio",
              "C#",
              "Documentación",
              "Habilidades sociales",
              "MySQL",
              "Resolución de problemas",
              ".NET Framework",
            ],
          },
          {
            institution: "Universidad de Málaga",
            degree: "Grado en Ingeniería Informática",
            period: "Sept 2017 - Sept 2021",
            status: "Completado",
            skills: ["Documentación", "Habilidades sociales", "Resolución de problemas"],
          },
          {
            institution: "Universidad Internacional Menéndez Pelayo",
            degree: "Curso de Inmersión en Lengua Inglesa",
            period: "Jul 2019 - Jul 2019",
            level: "B1",
            skills: ["Habilidades sociales"],
          },
        ],
      },
      "GET /projects": {
        status: 200,
        responseTime: "52ms",
        data: [
          {
            name: "El Nieto de Pascual",
            type: "Blog Personal",
            description:
              language === "es"
                ? "Blog personal sobre desarrollo backend, Python y tecnología. Comparto experiencias, tutoriales y reflexiones sobre el mundo del desarrollo."
                : "Personal blog about backend development, Python and technology. I share experiences, tutorials and reflections about the development world.",
            technologies: ["Python", "Django", "PostgreSQL", "HTML/CSS"],
            status: "Activo",
            url: "https://elnietodepascual.com",
          },
          {
            name: "Portfolio Retro NES",
            type: "Portfolio Personal",
            description:
              language === "es"
                ? "Portfolio con estética retro inspirada en Nintendo NES. Diseño pixel art y animaciones nostálgicas."
                : "Portfolio with retro aesthetic inspired by Nintendo NES. Pixel art design and nostalgic animations.",
            technologies: ["HTML", "CSS", "JavaScript", "Pixel Art"],
            status: "Completado",
            url: "#",
          },
        ],
      },
      "GET /blog": {
        status: 200,
        responseTime: "65ms",
        data: {
          posts: [
            {
              id: "fastapi-optimization",
              title: "Optimización de APIs con FastAPI: Técnicas Avanzadas",
              excerpt:
                "Descubre cómo optimizar el rendimiento de tus APIs FastAPI usando técnicas de caching, conexiones asíncronas y optimización de consultas.",
              publishedAt: "2024-01-15",
              readTime: 8,
              views: 1250,
              likes: 89,
              tags: ["FastAPI", "Python", "Performance", "Caching"],
              category: "Backend",
              featured: true,
            },
            {
              id: "python-async-patterns",
              title: "Patrones Asíncronos en Python: Más Allá de async/await",
              excerpt:
                "Explora patrones avanzados de programación asíncrona en Python, incluyendo context managers asíncronos y generadores.",
              publishedAt: "2024-01-10",
              readTime: 12,
              views: 890,
              likes: 67,
              tags: ["Python", "Async", "Patterns", "Advanced"],
              category: "Python",
              featured: false,
            },
          ],
          totalPosts: 15,
          categories: ["Backend", "Python", "Database", "DevOps"],
          totalViews: 25000,
          totalLikes: 1200,
        },
      },
      "GET /testimonials": {
        status: 200,
        responseTime: "32ms",
        data: [
          {
            id: "1",
            name: "María García",
            position: "CTO",
            company: "DisOfic",
            content:
              "Daniel ha demostrado ser un desarrollador excepcional. Su trabajo en la API de integración ha transformado completamente nuestros procesos.",
            rating: 5,
            linkedinUrl: "#",
          },
          {
            id: "2",
            name: "Carlos Rodríguez",
            position: "Lead Developer",
            company: "TechSolutions",
            content:
              "La capacidad de Daniel para resolver problemas complejos y su dominio de Python y FastAPI son impresionantes.",
            rating: 5,
            linkedinUrl: "#",
          },
        ],
      },
      "GET /case-studies": {
        status: 200,
        responseTime: "48ms",
        data: [
          {
            id: "disofic-api",
            title: "API de Integración en Tiempo Real",
            subtitle: "DisOfic - Sistema de sincronización masiva",
            problem: "Sincronización manual de +50 sitios WordPress con CRM Odoo",
            solution: "API robusta con FastAPI, workers con Celery y Redis",
            results: ["95% reducción de errores", "300% mejora de eficiencia"],
            technologies: ["Python", "FastAPI", "Celery", "Redis", "MySQL"],
            metrics: {
              sitesSync: "50+",
              errorReduction: "95%",
              efficiencyImprovement: "300%",
            },
          },
        ],
      },
      "POST /contact": {
        status: 200,
        responseTime: "28ms",
        data: {
          message: "Endpoint de contacto disponible",
          methods: ["email", "linkedin", "github"],
          email: "daniel@example.com",
          linkedin: "https://linkedin.com/in/daniel-gonzalez-pascual",
          github: "https://github.com/danielgonzalezpascual",
          location: "Málaga, España",
          availability: "Disponible para nuevas oportunidades",
        },
      },
    }

    return endpointData[endpoint as keyof typeof endpointData] || { status: 404, data: { error: "Endpoint not found" } }
  }

  const currentData = getEndpointData(activeEndpoint)

  const handleMinimize = () => {
    if (onMinimize) onMinimize()
  }

  const handleMaximize = () => {
    setIsMaximized(!isMaximized)
    if (onMaximize) onMaximize()
  }

  const handleClose = () => {
    if (onClose) onClose()
  }

  const getWindowClasses = () => {
    switch (theme) {
      case "matrix":
        return "bg-black border-green-500 text-green-400"
      case "vscode":
        return "bg-gray-800 border-gray-600 text-gray-100"
      default:
        return "bg-white border-gray-300 text-gray-900"
    }
  }

  const getHeaderClasses = () => {
    switch (theme) {
      case "matrix":
        return "bg-black border-green-500"
      case "vscode":
        return "bg-gray-700 border-gray-600"
      default:
        return "bg-gray-100 border-gray-300"
    }
  }

  const getSidebarClasses = () => {
    switch (theme) {
      case "matrix":
        return "bg-gray-900 border-green-500"
      case "vscode":
        return "bg-gray-800 border-gray-600"
      default:
        return "bg-gray-50 border-gray-300"
    }
  }

  return (
    <>
      <div
        className={`absolute ${isMaximized ? "inset-8" : "top-16 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl h-[90%]"} rounded-lg shadow-2xl border overflow-hidden transition-all duration-300 ${getWindowClasses()}`}
      >
        {/* Window controls */}
        <div className={`border-b px-4 py-2 flex items-center justify-between ${getHeaderClasses()}`}>
          <div className="flex items-center space-x-2">
            <div className="flex space-x-2">
              <button
                className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                onClick={handleClose}
              ></button>
              <button
                className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-600 transition-colors"
                onClick={handleMinimize}
              ></button>
              <button
                className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-600 transition-colors"
                onClick={handleMaximize}
              ></button>
            </div>
            <span className="ml-4 font-medium">
              {theme === "matrix"
                ? "PORTFOLIO_API.EXE"
                : theme === "vscode"
                  ? "Daniel's API Client"
                  : "Daniel's Portfolio API"}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              className={`p-1 rounded transition-colors ${theme === "matrix" ? "hover:bg-green-900" : theme === "vscode" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
              onClick={() => setShowPresentationMode(true)}
              title="Presentation Mode"
            >
              <Presentation className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded transition-colors ${theme === "matrix" ? "hover:bg-green-900" : theme === "vscode" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
              onClick={() => setShowMetrics(!showMetrics)}
              title="Toggle Metrics"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded transition-colors ${theme === "matrix" ? "hover:bg-green-900" : theme === "vscode" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
              onClick={() => setShowDeveloperMode(!showDeveloperMode)}
              title="Developer Mode"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded transition-colors ${theme === "matrix" ? "hover:bg-green-900" : theme === "vscode" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
              onClick={handleMinimize}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded transition-colors ${theme === "matrix" ? "hover:bg-green-900" : theme === "vscode" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
              onClick={handleMaximize}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              className={`p-1 rounded transition-colors ${theme === "matrix" ? "hover:bg-green-900" : theme === "vscode" ? "hover:bg-gray-600" : "hover:bg-gray-200"}`}
              onClick={handleClose}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className={`w-80 border-r flex flex-col ${getSidebarClasses()}`}>
            <div className="p-4 border-b border-gray-300">
              <h2 className="font-bold text-lg">API Endpoints</h2>
              <p className="text-sm opacity-75">Portfolio Backend API v3.0</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {endpoints.map((endpoint) => {
                const Icon = endpoint.icon
                const isActive = activeEndpoint === `${endpoint.method} ${endpoint.path}`

                return (
                  <div
                    key={`${endpoint.method} ${endpoint.path}`}
                    className={`p-3 border-b cursor-pointer transition-colors ${
                      theme === "matrix"
                        ? `border-green-800 hover:bg-green-900 ${isActive ? "bg-green-900 border-l-4 border-l-green-400" : ""}`
                        : theme === "vscode"
                          ? `border-gray-700 hover:bg-gray-700 ${isActive ? "bg-gray-700 border-l-4 border-l-blue-400" : ""}`
                          : `border-gray-200 hover:bg-gray-100 ${isActive ? "bg-blue-50 border-l-4 border-l-blue-500" : ""}`
                    }`}
                    onClick={() => handleEndpointClick(`${endpoint.method} ${endpoint.path}`)}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded ${
                          endpoint.method === "GET"
                            ? theme === "matrix"
                              ? "bg-green-800 text-green-300"
                              : theme === "vscode"
                                ? "bg-green-700 text-green-300"
                                : "bg-green-100 text-green-800"
                            : endpoint.method === "POST"
                              ? theme === "matrix"
                                ? "bg-green-700 text-green-200"
                                : theme === "vscode"
                                  ? "bg-orange-700 text-orange-300"
                                  : "bg-orange-100 text-orange-800"
                              : theme === "matrix"
                                ? "bg-green-600 text-green-100"
                                : theme === "vscode"
                                  ? "bg-gray-600 text-gray-300"
                                  : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <Icon className={`w-4 h-4 ${endpoint.color}`} />
                    </div>
                    <div className="mt-1">
                      <div className="font-medium">{endpoint.path}</div>
                      <div className="text-sm opacity-75">{endpoint.name}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="p-4 border-t flex-shrink-0">
              <button
                className={`w-full px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105 ${
                  theme === "matrix"
                    ? "bg-green-600 hover:bg-green-500 text-black font-bold shadow-lg hover:shadow-green-500/25"
                    : theme === "vscode"
                      ? "bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg hover:shadow-blue-500/25"
                      : "bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg hover:shadow-orange-500/25"
                }`}
                onClick={() => {
                  const link = document.createElement("a")
                  link.href = "/cv-daniel-gonzalez-pascual.pdf"
                  link.download = "CV-Daniel-Gonzalez-Pascual.pdf"
                  link.click()
                }}
              >
                <Download className="w-4 h-4" />
                <span>Descargar CV</span>
              </button>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col">
            {/* Request bar */}
            <div
              className={`border-b p-4 ${theme === "matrix" ? "border-green-800" : theme === "vscode" ? "border-gray-700" : "border-gray-300"}`}
            >
              <div className="flex items-center space-x-4">
                <select
                  className={`px-3 py-2 border rounded-lg ${
                    theme === "matrix"
                      ? "border-green-600 bg-black text-green-400"
                      : theme === "vscode"
                        ? "border-gray-600 bg-gray-700 text-gray-100"
                        : "border-gray-300 bg-white text-gray-900"
                  }`}
                >
                  <option>{activeEndpoint.split(" ")[0]}</option>
                </select>
                <input
                  type="text"
                  value={`https://daniel-portfolio-api.com${activeEndpoint.split(" ")[1]}`}
                  readOnly
                  className={`flex-1 px-3 py-2 border rounded-lg ${
                    theme === "matrix"
                      ? "border-green-600 bg-gray-900 text-green-400"
                      : theme === "vscode"
                        ? "border-gray-600 bg-gray-800 text-gray-300"
                        : "border-gray-300 bg-gray-50 text-gray-900"
                  }`}
                />
                <button
                  className={`px-6 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors ${
                    theme === "matrix"
                      ? "bg-green-600 hover:bg-green-500 text-black"
                      : theme === "vscode"
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                >
                  <Play className="w-4 h-4" />
                  <span>Send</span>
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors ${
                    theme === "matrix"
                      ? "bg-green-700 hover:bg-green-600 text-green-100"
                      : theme === "vscode"
                        ? "bg-blue-600 hover:bg-blue-500 text-white"
                        : "bg-blue-500 hover:bg-blue-600 text-white"
                  }`}
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </button>
              </div>
              {!showPreview && (
                <div
                  className={`mt-2 text-sm p-2 rounded border-l-4 ${
                    theme === "matrix"
                      ? "bg-green-900 border-green-400 text-green-300"
                      : theme === "vscode"
                        ? "bg-blue-900 border-blue-400 text-blue-300"
                        : "bg-blue-50 border-blue-400 text-blue-700"
                  }`}
                >
                  💡 Haz clic en "Preview" para ver la sección del portfolio renderizada
                </div>
              )}
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Response/Preview */}
              <div className="flex-1 overflow-y-auto">
                <LoadingOverlay isLoading={isLoading}>
                  {showPreview ? (
                    <div
                      className={`h-full ${theme === "matrix" ? "bg-gray-900" : theme === "vscode" ? "bg-gray-800" : "bg-gray-50"}`}
                    >
                      <div
                        className={`p-4 border-b ${theme === "matrix" ? "bg-black border-green-800" : theme === "vscode" ? "bg-gray-700 border-gray-600" : "bg-white border-gray-200"}`}
                      >
                        <h3 className="font-semibold">Vista Previa - {activeEndpoint}</h3>
                        <p className="text-sm opacity-75">Renderizado del componente del portfolio</p>
                      </div>
                      <div className="p-4">{renderPreviewComponent()}</div>
                    </div>
                  ) : (
                    // Respuesta JSON original
                    <div className="p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <span className="text-sm opacity-75">Status:</span>
                          <span
                            className={`px-2 py-1 rounded text-sm font-medium ${
                              currentData.status === 200
                                ? theme === "matrix"
                                  ? "bg-green-800 text-green-300"
                                  : theme === "vscode"
                                    ? "bg-green-700 text-green-300"
                                    : "bg-green-100 text-green-800"
                                : theme === "matrix"
                                  ? "bg-red-800 text-red-300"
                                  : theme === "vscode"
                                    ? "bg-red-700 text-red-300"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {currentData.status} {currentData.status === 200 ? "OK" : "Error"}
                          </span>
                          <span className="text-sm opacity-75">Time: {currentData.responseTime}</span>
                        </div>
                      </div>

                      <div
                        className={`rounded-lg p-4 overflow-x-auto ${
                          theme === "matrix"
                            ? "bg-black border border-green-600"
                            : theme === "vscode"
                              ? "bg-gray-900 border border-gray-600"
                              : "bg-gray-900"
                        }`}
                      >
                        <pre
                          className={`text-sm font-mono whitespace-pre-wrap ${
                            theme === "matrix"
                              ? "text-green-400"
                              : theme === "vscode"
                                ? "text-green-300"
                                : "text-green-400"
                          }`}
                        >
                          {JSON.stringify(currentData.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </LoadingOverlay>
              </div>

              {/* Metrics Panel */}
              {showMetrics && (
                <div className="w-80 border-l overflow-y-auto">
                  <ApiMetrics activeEndpoint={activeEndpoint} />
                </div>
              )}
            </div>
          </div>

          {/* Developer Mode Panel */}
          {showDeveloperMode && (
            <DeveloperMode activeEndpoint={activeEndpoint} onClose={() => setShowDeveloperMode(false)} />
          )}
        </div>
      </div>

      {/* Presentation Mode */}
      {showPresentationMode && (
        <PresentationMode isOpen={showPresentationMode} onClose={() => setShowPresentationMode(false)} />
      )}
    </>
  )
}
