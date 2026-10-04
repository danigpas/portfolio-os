"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import {
  Briefcase,
  Code,
  Download,
  Github,
  Globe,
  GraduationCap,
  Linkedin,
  Mail,
  Terminal as TerminalIcon,
  User,
} from "lucide-react"
import gsap from "gsap"
import { Waybar } from "@/components/omarchy-waybar"
import { OmarchyWallpaper } from "@/components/omarchy-wallpaper"
import { useCvData } from "@/components/portfolio-data-provider"
import { downloadCv } from "@/lib/api"
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion"

interface UbuntuDesktopProps {
  children: React.ReactNode
  activeSection?: string
  onSectionChange?: (section: string) => void
  onReboot?: () => void
  onSuspend?: () => void
  onShutdown?: () => void
  onOpenTerminal?: () => void
  onOpenPostmanApp?: () => void
  onOpenCvWeb?: () => void
  onCloseTerminal?: () => void
}

const SECTION_ITEMS = [
  { id: "about", endpoint: "GET /about", label: "Sobre mí", icon: User },
  { id: "experience", endpoint: "GET /experience", label: "Experiencia", icon: Briefcase },
  { id: "education", endpoint: "GET /education", label: "Educación", icon: GraduationCap },
  { id: "projects", endpoint: "GET /projects", label: "Proyectos", icon: Code },
  { id: "contact", endpoint: "POST /contact", label: "Contacto", icon: Mail },
] as const

/**
 * Capa visual del escritorio Omarchy.
 * Waybar + wallpaper por tema + micro-interacciones GSAP (dock/iconos).
 */
export function UbuntuDesktop({
  children,
  activeSection = "GET /about",
  onSectionChange,
  onReboot,
  onSuspend,
  onShutdown,
  onOpenTerminal,
  onOpenPostmanApp,
  onOpenCvWeb,
  onCloseTerminal,
}: UbuntuDesktopProps) {
  const reducedMotion = usePrefersReducedMotion()
  const cv = useCvData()
  const dockRefs = useRef<Array<HTMLButtonElement | null>>([])
  const iconRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    if (reducedMotion) return
    const targets = [...dockRefs.current, ...iconRefs.current].filter(Boolean) as HTMLButtonElement[]
    if (targets.length === 0) return
    const tween = gsap.fromTo(
      targets,
      { autoAlpha: 0, y: 14, scale: 0.9 },
      {
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        ease: "back.out(1.7)",
        stagger: 0.045,
      },
    )
    return () => {
      tween.kill()
    }
  }, [reducedMotion])

  const springIn = (el: HTMLElement | null) => {
    if (reducedMotion || !el) return
    gsap.to(el, { scale: 1.14, duration: 0.22, ease: "back.out(2.5)" })
  }
  const springOut = (el: HTMLElement | null) => {
    if (reducedMotion || !el) return
    gsap.to(el, { scale: 1, duration: 0.3, ease: "power2.out" })
  }

  const handleSectionClick = (endpoint: string) => {
    onOpenPostmanApp?.()
    onSectionChange?.(endpoint)
  }

  const handleExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const handleDownloadCV = () => {
    void downloadCv(cv.contact.cvPath)
  }

  const desktopIcons = [
    { id: "cv", icon: Download, label: "CV.pdf", action: handleDownloadCV },
    { id: "cvweb", icon: Globe, label: "CV en línea", action: () => onOpenCvWeb?.() },
    { id: "github", icon: Github, label: "GitHub", action: () => handleExternalLink("https://github.com/danigpas") },
    {
      id: "linkedin",
      icon: Linkedin,
      label: "LinkedIn",
      action: () => handleExternalLink("https://www.linkedin.com/in/daniel-gonz%C3%A1lez-pascual-dev/"),
    },
  ]

  return (
    <div className="fixed inset-0 overflow-hidden bg-[var(--omarchy-bg)] font-mono text-[var(--omarchy-fg)]">
      <OmarchyWallpaper />

      <Waybar
        activeSection={activeSection}
        onSectionChange={handleSectionClick}
        onOpenTerminal={onOpenTerminal}
        onReboot={onReboot}
        onShutdown={onShutdown}
      />

      {/* Desktop icons (utilidades) */}
      <div className="absolute right-4 top-12 z-10 flex flex-col gap-3">
        {desktopIcons.map((item, index) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              type="button"
              ref={(el) => {
                iconRefs.current[index] = el
              }}
              onClick={item.action}
              onMouseEnter={(event) => springIn(event.currentTarget)}
              onMouseLeave={(event) => springOut(event.currentTarget)}
              className="group flex w-16 flex-col items-center gap-1 border border-transparent p-2 text-[var(--omarchy-fg)] hover:border-[var(--omarchy-border)] hover:bg-[var(--omarchy-surface)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--omarchy-accent)]"
            >
              <span className="flex h-10 w-10 items-center justify-center border border-[var(--omarchy-border)] bg-[var(--omarchy-surface)] om-accent-text">
                <Icon className="h-5 w-5" />
              </span>
              <span className="text-[10px] leading-tight">{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* Dock inferior: secciones 1-5 + terminal */}
      <div className="absolute bottom-3 left-1/2 z-40 -translate-x-1/2 border border-[var(--omarchy-border)] bg-[var(--omarchy-bg-alt)] px-2 py-1.5">
        <div className="flex items-end gap-1.5">
          {SECTION_ITEMS.map((item, index) => {
            const Icon = item.icon
            const active = item.endpoint === activeSection
            return (
              <button
                key={item.id}
                type="button"
                ref={(el) => {
                  dockRefs.current[index] = el
                }}
                onClick={() => handleSectionClick(item.endpoint)}
                onMouseEnter={(event) => springIn(event.currentTarget)}
                onMouseLeave={(event) => springOut(event.currentTarget)}
                title={item.label}
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
                className={`group relative flex h-10 w-10 items-center justify-center border transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--omarchy-accent)] ${
                  active
                    ? "border-[var(--omarchy-accent)] bg-[var(--omarchy-accent)] text-[var(--omarchy-bg)]"
                    : "border-[var(--omarchy-border)] bg-[var(--omarchy-surface)] om-accent-text hover:border-[var(--omarchy-accent)]"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="pointer-events-none absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap border border-[var(--omarchy-border)] bg-[var(--omarchy-bg-alt)] px-2 py-0.5 text-[10px] text-[var(--omarchy-fg)] opacity-0 transition-opacity group-hover:opacity-100">
                  {item.label}
                </span>
              </button>
            )
          })}
          <span aria-hidden className="mx-0.5 h-10 w-px self-center bg-[var(--omarchy-border)]" />
          <button
            type="button"
            onClick={onOpenTerminal}
            onMouseEnter={(event) => springIn(event.currentTarget)}
            onMouseLeave={(event) => springOut(event.currentTarget)}
            title="Terminal"
            aria-label="Abrir terminal"
            className="flex h-10 w-10 items-center justify-center border border-[var(--omarchy-border)] bg-[var(--omarchy-surface)] text-[var(--omarchy-success)] hover:border-[var(--omarchy-accent)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--omarchy-accent)]"
          >
            <TerminalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* App window */}
      {children}
    </div>
  )
}
