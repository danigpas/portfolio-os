"use client"

import { useState, useEffect } from "react"
import {
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
import { getCvData } from "@/lib/cv-data"
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
  initialSection?: string
}

export function PostmanApp({ initialSection = "GET /about" }: PostmanAppProps) {
  const { language } = useLanguage()
  const [activeEndpoint, setActiveEndpoint] = useState(initialSection)
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
    { method: "GET", path: "/about", name: "Sobre mí", icon: User },
    { method: "GET", path: "/experience", name: "Experiencia", icon: Briefcase },
    { method: "GET", path: "/education", name: "Educación", icon: GraduationCap },
    { method: "GET", path: "/projects", name: "Proyectos", icon: Code },
    { method: "GET", path: "/certifications", name: "Certificaciones", icon: Award },
    { method: "GET", path: "/blog", name: "Blog Técnico", icon: BookOpen },
    { method: "GET", path: "/testimonials", name: "Testimonios", icon: MessageSquare },
    { method: "GET", path: "/case-studies", name: "Case Studies", icon: FileText },
    { method: "GET", path: "/analytics", name: "Analytics", icon: BarChart3 },
    { method: "GET", path: "/availability", name: "Disponibilidad", icon: Calendar },
    { method: "GET", path: "/pwa", name: "PWA Features", icon: Smartphone },
    { method: "POST", path: "/contact", name: "Contacto", icon: Mail },
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
    const cv = getCvData(language)
    const endpointData = {
      "GET /about": {
        status: 200,
        responseTime: "45ms",
        data: {
          name: cv.about.name,
          role: cv.about.role,
          location: cv.contact.location,
          description: cv.about.summary,
          skills: cv.skills.flatMap((group) => group.items),
          yearsOfExperience: cv.about.yearsOfExperience,
          currentlyLearning:
            language === "es" ? "Desarrollo de Aplicaciones Web (DAW)" : "Web Application Development (DAW)",
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
        data: cv.experience.map((job) => ({
          company: job.company,
          position: job.role,
          duration: `${job.period}${job.current ? (language === "es" ? " (actual)" : " (current)") : ""}`,
          location: job.location,
          type: job.type,
          description: [job.summary, ...job.highlights].join(" "),
          technologies: job.stack,
          achievements: job.highlights,
        })),
      },
      "GET /education": {
        status: 200,
        responseTime: "42ms",
        data: cv.education.map((item) => ({
          institution: item.institution,
          degree: item.title,
          period: item.period,
          status: item.status,
          description: item.description,
        })),
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
          email: cv.contact.email,
          linkedin: cv.contact.linkedin,
          github: cv.contact.github,
          location: cv.contact.location,
          availability: "Disponible para nuevas oportunidades",
        },
      },
    }

    return endpointData[endpoint as keyof typeof endpointData] || { status: 404, data: { error: "Endpoint not found" } }
  }

  const currentData = getEndpointData(activeEndpoint)

  const getWindowClasses = () => "om-window"
  const getHeaderClasses = () => "om-panel border-b"
  const getSidebarClasses = () => "om-inset border-r"

  return (
    <>
      <div
        className={`flex h-full min-h-0 flex-col overflow-hidden border font-mono text-sm ${getWindowClasses()}`}
      >
        {/* Toolbar omarchy (los controles de ventana los aporta el window manager) */}
        <div className={`flex items-center justify-between border-b px-4 py-2 ${getHeaderClasses()}`}>
          <span className="font-medium">OMARCHY_API · daniel@portfolio</span>

          <div className="flex items-center gap-1">
            <button
              aria-label="Presentation Mode"
              title="Presentation Mode"
              className="p-1 transition-colors hover:bg-[var(--omarchy-surface-alt)]"
              onClick={() => setShowPresentationMode(true)}
            >
              <Presentation className="h-4 w-4" />
            </button>
            <button
              aria-label="Toggle Metrics"
              title="Toggle Metrics"
              className="p-1 transition-colors hover:bg-[var(--omarchy-surface-alt)]"
              onClick={() => setShowMetrics(!showMetrics)}
            >
              <Settings className="h-4 w-4" />
            </button>
            <button
              aria-label="Developer Mode"
              title="Developer Mode"
              className="p-1 transition-colors hover:bg-[var(--omarchy-surface-alt)]"
              onClick={() => setShowDeveloperMode(!showDeveloperMode)}
            >
              <Code className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Sidebar */}
          <div className={`flex w-80 flex-col border-r ${getSidebarClasses()}`}>
            <div className="border-b border-[var(--omarchy-border)] p-4">
              <h2 className="text-lg font-bold">API Endpoints</h2>
              <p className="om-muted-text text-sm">Portfolio Backend API v3.0</p>
            </div>

            <div className="om-scrollbar flex-1 overflow-y-auto pb-4">
              {endpoints.map((endpoint) => {
                const Icon = endpoint.icon
                const isActive = activeEndpoint === `${endpoint.method} ${endpoint.path}`

                return (
                  <div
                    key={`${endpoint.method} ${endpoint.path}`}
                    className={`cursor-pointer border-b border-[var(--omarchy-border)] p-3 transition-colors ${
                      isActive
                        ? "border-l-4 border-l-[var(--omarchy-accent)] bg-[var(--omarchy-surface-alt)]"
                        : "hover:bg-[var(--omarchy-surface-alt)]"
                    }`}
                    onClick={() => handleEndpointClick(`${endpoint.method} ${endpoint.path}`)}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`border px-2 py-1 text-xs font-bold ${
                          endpoint.method === "GET"
                            ? "border-[var(--omarchy-success)]/40 bg-[var(--omarchy-success)]/15 text-[var(--omarchy-success)]"
                            : "border-[var(--omarchy-warning)]/40 bg-[var(--omarchy-warning)]/15 text-[var(--omarchy-warning)]"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <Icon className="om-accent-text h-4 w-4" />
                    </div>
                    <div className="mt-1">
                      <div className="font-medium">{endpoint.path}</div>
                      <div className="om-muted-text text-sm">{endpoint.name}</div>
                    </div>
                  </div>
                )
              })}

              <div className="mt-4 px-3 py-2">
                <button
                  className="om-accent-bg flex w-full items-center justify-center gap-2 border border-[var(--omarchy-accent)] px-4 py-2 font-bold transition-opacity hover:opacity-90"
                  onClick={() => {
                    const link = document.createElement("a")
                    link.href = "/cv-daniel-gonzalez-pascual.pdf"
                    link.download = "CV-Daniel-Gonzalez-Pascual.pdf"
                    link.click()
                  }}
                >
                  <Download className="h-4 w-4" />
                  <span>Descargar CV</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex min-w-0 flex-1 flex-col">
            {/* Request bar */}
            <div className="border-b border-[var(--omarchy-border)] p-4">
              <div className="flex items-center gap-4">
                <select className="border border-[var(--omarchy-border)] bg-[var(--omarchy-bg-alt)] px-3 py-2 text-[var(--omarchy-fg)]">
                  <option>{activeEndpoint.split(" ")[0]}</option>
                </select>
                <input
                  type="text"
                  value={`https://daniel-portfolio-api.com${activeEndpoint.split(" ")[1]}`}
                  readOnly
                  className="flex-1 border border-[var(--omarchy-border)] bg-[var(--omarchy-bg-alt)] px-3 py-2 text-[var(--omarchy-fg)]"
                />
                <button className="om-accent-bg flex items-center justify-center gap-2 border border-[var(--omarchy-accent)] px-6 py-2 transition-opacity hover:opacity-90">
                  <Play className="h-4 w-4" />
                  <span>Send</span>
                </button>
                <button
                  className="flex items-center gap-2 border border-[var(--omarchy-border)] bg-[var(--omarchy-surface)] px-4 py-2 transition-colors hover:bg-[var(--omarchy-surface-alt)]"
                  onClick={() => setShowPreview(!showPreview)}
                >
                  <Eye className="h-4 w-4" />
                  <span>Preview</span>
                </button>
              </div>
              {!showPreview && (
                <div className="mt-2 border border-[var(--omarchy-border)] border-l-4 border-l-[var(--omarchy-accent)] bg-[var(--omarchy-surface-alt)] p-2 text-sm">
                  💡 Haz clic en "Preview" para ver la sección del portfolio renderizada
                </div>
              )}
            </div>

            <div className="flex flex-1 overflow-hidden">
              {/* Response/Preview */}
              <div className="om-scrollbar flex-1 overflow-y-auto">
                <LoadingOverlay isLoading={isLoading}>
                  {showPreview ? (
                    <div className="h-full bg-[var(--omarchy-bg)]">
                      <div className="border-b border-[var(--omarchy-border)] bg-[var(--omarchy-surface)] p-4">
                        <h3 className="font-semibold">Vista Previa - {activeEndpoint}</h3>
                        <p className="om-muted-text text-sm">Renderizado del componente del portfolio</p>
                      </div>
                      <div className="p-4">{renderPreviewComponent()}</div>
                    </div>
                  ) : (
                    // Respuesta JSON original
                    <div className="p-4">
                      <div className="mb-4 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <span className="om-muted-text text-sm">Status:</span>
                          <span
                            className={`border px-2 py-1 text-sm font-medium ${
                              currentData.status === 200
                                ? "border-[var(--omarchy-success)]/40 bg-[var(--omarchy-success)]/15 text-[var(--omarchy-success)]"
                                : "border-[var(--omarchy-danger)]/40 bg-[var(--omarchy-danger)]/15 text-[var(--omarchy-danger)]"
                            }`}
                          >
                            {currentData.status} {currentData.status === 200 ? "OK" : "Error"}
                          </span>
                          <span className="om-muted-text text-sm">Time: {currentData.responseTime}</span>
                        </div>
                      </div>

                      <div className="overflow-x-auto border border-[var(--omarchy-border)] bg-[var(--omarchy-bg-alt)] p-4">
                        <pre className="whitespace-pre-wrap font-mono text-sm text-[var(--omarchy-success)]">
                          {JSON.stringify(currentData.data, null, 2)}
                        </pre>
                      </div>
                    </div>
                  )}
                </LoadingOverlay>
              </div>

              {/* Metrics Panel */}
              {showMetrics && (
                <div className="w-80 overflow-y-auto border-l border-[var(--omarchy-border)]">
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
