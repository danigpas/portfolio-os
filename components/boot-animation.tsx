"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import gsap from "gsap"

interface BootAnimationProps {
  onComplete: () => void
}

/** Total boot budget in seconds (acceptance: complete boot ≤ 3.5s). */
const BOOT_SECONDS = 2.5

const BOOT_LINES = [
  "[ OK ] Reached target Basic System.",
  "[ OK ] Mounted /dev/portfolio.",
  "[ OK ] Started udev Kernel Device Manager.",
  "[ OK ] Started portfolio-manager.service.",
  "[ OK ] Started daniel-gonzalez-pascual.service.",
  "[ OK ] Started python-fastapi.service.",
  "[ OK ] Started postgresql.service.",
  "[ OK ] Started omarchy-theme.service.",
  "[ OK ] Started waybar.service.",
  "[ OK ] Started NetworkManager.service.",
  "[ OK ] Loaded lib/cv-data.ts (ES/EN).",
  "[ OK ] Activated graphical target.",
  "[ OK ] Started Omarchy Session.",
  "[ OK ] Reached target Graphical Interface.",
]

const BAR_WIDTH = 24

function renderBar(progress: number) {
  const filled = Math.round((progress / 100) * BAR_WIDTH)
  return `${"█".repeat(filled)}${"░".repeat(BAR_WIDTH - filled)}`
}

export function BootAnimation({ onComplete }: BootAnimationProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const linesRef = useRef<Array<HTMLDivElement | null>>([])
  const promptRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline | null>(null)
  const completedRef = useRef(false)
  const [progress, setProgress] = useState(0)

  const finish = useCallback(() => {
    if (completedRef.current) return
    completedRef.current = true
    timelineRef.current?.kill()
    onComplete()
  }, [onComplete])

  useEffect(() => {
    const reducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const lines = linesRef.current.filter(Boolean) as HTMLDivElement[]

    if (reducedMotion) {
      gsap.set(lines, { autoAlpha: 1, x: 0 })
      if (promptRef.current) gsap.set(promptRef.current, { autoAlpha: 1 })
      setProgress(100)
      const fast = window.setTimeout(finish, 350)
      return () => window.clearTimeout(fast)
    }

    const counter = { value: 0 }
    const stagger = (BOOT_SECONDS - 0.4) / BOOT_LINES.length

    const tl = gsap.timeline({ onComplete: finish })

    tl.fromTo(
      lines,
      { autoAlpha: 0, x: -10 },
      {
        autoAlpha: 1,
        x: 0,
        duration: 0.12,
        ease: "none",
        stagger,
      },
      0,
    )

    tl.to(
      counter,
      {
        value: 100,
        duration: BOOT_SECONDS - 0.3,
        ease: "none",
        onUpdate: () => {
          const value = Math.round(counter.value)
          setProgress(value)
        },
      },
      0,
    )

    tl.fromTo(
      promptRef.current,
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0.2 },
      BOOT_SECONDS - 0.45,
    )

    // Pad the timeline so the total is exactly BOOT_SECONDS.
    tl.to({}, { duration: 0.0001 }, BOOT_SECONDS)

    timelineRef.current = tl

    // Safety net: never trap the user if GSAP fails to tick.
    const fallback = window.setTimeout(finish, (BOOT_SECONDS + 0.3) * 1000)

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish()
    }
    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.clearTimeout(fallback)
      window.removeEventListener("keydown", onKeyDown)
      tl.kill()
    }
  }, [finish])

  return (
    <div
      ref={rootRef}
      role="button"
      tabIndex={0}
      aria-label="Arranque de Omarchy. Pulsa Escape o haz clic para saltar."
      onClick={finish}
      onKeyDown={(event) => {
        if (event.key === "Escape" || event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          finish()
        }
      }}
      className="fixed inset-0 z-[200] cursor-pointer overflow-hidden bg-[var(--omarchy-bg)] font-mono text-[var(--omarchy-fg)] outline-none"
    >
      {/* subtle tty backdrop */}
      <div className="om-wallpaper" aria-hidden>
        <div className="om-wallpaper-pattern" />
        <div className="om-wallpaper-scanlines" />
      </div>

      <div className="relative z-10 mx-auto flex h-full w-full max-w-3xl flex-col justify-center px-6 py-10 text-[13px] leading-relaxed sm:text-sm">
        <div className="mb-4 border-b border-[var(--omarchy-border)] pb-2 text-[var(--omarchy-accent)]">
          Omarchy 1.0 · tty1 · boot
        </div>

        <div className="min-h-[16rem] space-y-0.5">
          {BOOT_LINES.map((line, index) => {
            const ok = line.match(/^\[ OK \]/)
            const rest = ok ? line.replace("[ OK ] ", "") : line
            return (
              <div
                key={line}
                ref={(el) => {
                  linesRef.current[index] = el
                }}
                className="whitespace-pre"
                style={{ opacity: 0 }}
              >
                {ok ? (
                  <>
                    <span className="text-[var(--omarchy-success)]">[ OK ]</span> {rest}
                  </>
                ) : (
                  line
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 space-y-1">
          <div className="text-[var(--omarchy-accent)]">
            <span className="om-muted-text">progress </span>[{renderBar(progress)}] {progress}%
          </div>
          <div ref={promptRef} className="text-[var(--omarchy-fg)]" style={{ opacity: 0 }}>
            <span className="text-[var(--omarchy-accent)]">omarchy</span>
            <span className="om-muted-text"> login: </span>daniel
            <span className="ml-1 inline-block animate-pulse text-[var(--omarchy-accent)]">█</span>
          </div>
        </div>

        <p className="mt-10 text-xs text-[var(--omarchy-muted)]">
          Pulsa <kbd className="border border-[var(--omarchy-border)] px-1">ESC</kbd> o haz clic para saltar
        </p>
      </div>
    </div>
  )
}
