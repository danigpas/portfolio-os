"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { gsap } from "gsap"
import { Minus, Square, Copy, X, Layers, Search } from "lucide-react"

/* -------------------------------------------------------------------------- */
/* Tipos                                                                       */
/* -------------------------------------------------------------------------- */

export interface WindowBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface ManagedWindowState {
  id: string
  title: string
  minimized: boolean
  maximized: boolean
  bounds: WindowBounds
  restoreBounds: WindowBounds | null
  zIndex: number
}

interface PersistedWindow {
  bounds: WindowBounds
  maximized: boolean
}

interface OpenWindowOptions {
  title?: string
  bounds?: WindowBounds
}

interface WindowManagerContextValue {
  windows: Record<string, ManagedWindowState>
  order: string[]
  activeId: string | null
  openWindow: (id: string, options?: OpenWindowOptions) => void
  closeWindow: (id: string) => void
  closeAllWindows: () => void
  minimizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  toggleMaximize: (id: string) => void
  focusWindow: (id: string) => void
  setWindowBounds: (id: string, bounds: WindowBounds) => void
  cycleWindows: (direction?: 1 | -1) => void
  isOpen: (id: string) => boolean
}

const WindowManagerContext = createContext<WindowManagerContextValue | undefined>(undefined)

export function useWindows() {
  const context = useContext(WindowManagerContext)
  if (!context) {
    throw new Error("useWindows debe usarse dentro de <WindowManagerProvider>")
  }
  return context
}

/* -------------------------------------------------------------------------- */
/* Utilidades                                                                  */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "omarchy-wm:v1"
const MIN_WIDTH = 320
const MIN_HEIGHT = 200
const TOP_INSET = 40
const BOTTOM_INSET = 96

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

function getViewport(): { width: number; height: number } {
  if (typeof window === "undefined") return { width: 1280, height: 800 }
  return { width: window.innerWidth, height: window.innerHeight }
}

function defaultBounds(id: string, viewport: { width: number; height: number }): WindowBounds {
  const isTerminal = id === "terminal"
  const width = Math.min(isTerminal ? 720 : 1080, Math.max(MIN_WIDTH, viewport.width - 80))
  const height = Math.min(isTerminal ? 460 : 720, Math.max(MIN_HEIGHT, viewport.height - 160))
  return {
    x: Math.round((viewport.width - width) / 2),
    y: TOP_INSET + 24,
    width,
    height,
  }
}

function maxBoundsFor(viewport: { width: number; height: number }): WindowBounds {
  return {
    x: 8,
    y: TOP_INSET,
    width: Math.max(MIN_WIDTH, viewport.width - 16),
    height: Math.max(MIN_HEIGHT, viewport.height - TOP_INSET - (BOTTOM_INSET - TOP_INSET) - 8),
  }
}

/* -------------------------------------------------------------------------- */
/* Provider                                                                    */
/* -------------------------------------------------------------------------- */

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<Record<string, ManagedWindowState>>({})
  const [order, setOrder] = useState<string[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const zRef = useRef(20)
  const savedRef = useRef<Record<string, PersistedWindow>>({})
  const loadedRef = useRef(false)

  // Restaurar geometría guardada en la sesión.
  useEffect(() => {
    try {
      const raw = window.sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, PersistedWindow>
        if (parsed && typeof parsed === "object") savedRef.current = parsed
      }
    } catch {
      savedRef.current = {}
    }
    loadedRef.current = true
  }, [])

  // Persistir posición/tamaño por sesión.
  useEffect(() => {
    if (!loadedRef.current) return
    const payload: Record<string, PersistedWindow> = { ...savedRef.current }
    for (const windowState of Object.values(windows)) {
      payload[windowState.id] = { bounds: windowState.bounds, maximized: windowState.maximized }
    }
    savedRef.current = payload
    try {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
    } catch {
      /* sessionStorage no disponible */
    }
  }, [windows])

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const current = prev[id]
      if (!current) return prev
      return { ...prev, [id]: { ...current, minimized: false, zIndex: ++zRef.current } }
    })
    setActiveId(id)
  }, [])

  const openWindow = useCallback((id: string, options?: OpenWindowOptions) => {
    const viewport = getViewport()
    setWindows((prev) => {
      const current = prev[id]
      if (current) {
        return { ...prev, [id]: { ...current, minimized: false, zIndex: ++zRef.current } }
      }
      const saved = savedRef.current[id]
      const bounds = options?.bounds ?? saved?.bounds ?? defaultBounds(id, viewport)
      const maximized = saved?.maximized ?? false
      return {
        ...prev,
        [id]: {
          id,
          title: options?.title ?? id,
          minimized: false,
          maximized,
          bounds,
          restoreBounds: maximized ? (saved?.bounds ?? defaultBounds(id, viewport)) : null,
          zIndex: ++zRef.current,
        },
      }
    })
    setOrder((prev) => (prev.includes(id) ? prev : [...prev, id]))
    setActiveId(id)
  }, [])

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      if (!prev[id]) return prev
      const next = { ...prev }
      delete next[id]
      return next
    })
    setOrder((prev) => prev.filter((windowId) => windowId !== id))
    setActiveId((currentActive) => {
      if (currentActive !== id) return currentActive
      return null
    })
  }, [])

  const closeAllWindows = useCallback(() => {
    setWindows({})
    setOrder([])
    setActiveId(null)
  }, [])

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) => {
      const current = prev[id]
      if (!current) return prev
      return { ...prev, [id]: { ...current, minimized: true } }
    })
    setActiveId((currentActive) => (currentActive === id ? null : currentActive))
  }, [])

  const restoreWindow = useCallback(
    (id: string) => {
      focusWindow(id)
    },
    [focusWindow],
  )

  const toggleMaximize = useCallback((id: string) => {
    setWindows((prev) => {
      const current = prev[id]
      if (!current) return prev
      if (current.maximized) {
        return {
          ...prev,
          [id]: {
            ...current,
            maximized: false,
            bounds: current.restoreBounds ?? current.bounds,
            restoreBounds: null,
            zIndex: ++zRef.current,
          },
        }
      }
      return {
        ...prev,
        [id]: { ...current, maximized: true, restoreBounds: current.bounds, zIndex: ++zRef.current },
      }
    })
    setActiveId(id)
  }, [])

  const setWindowBounds = useCallback((id: string, bounds: WindowBounds) => {
    setWindows((prev) => {
      const current = prev[id]
      if (!current) return prev
      return { ...prev, [id]: { ...current, bounds } }
    })
  }, [])

  const windowValues = useMemo(() => Object.values(windows), [windows])

  const cycleWindows = useCallback(
    (direction: 1 | -1 = 1) => {
      const list = order.map((id) => windows[id]).filter(Boolean)
      if (list.length === 0) return
      const currentIndex = list.findIndex((windowState) => windowState.id === activeId)
      const nextIndex = (currentIndex + direction + list.length) % list.length
      focusWindow(list[nextIndex].id)
    },
    [order, windows, activeId, focusWindow],
  )

  // Si la ventana activa desaparece, pasa el foco a la de mayor z-index.
  useEffect(() => {
    if (activeId && !windows[activeId]) {
      const top = windowValues.filter((windowState) => !windowState.minimized).sort((a, b) => b.zIndex - a.zIndex)[0]
      setActiveId(top ? top.id : null)
    }
  }, [windows, activeId, windowValues])

  const value = useMemo<WindowManagerContextValue>(
    () => ({
      windows,
      order,
      activeId,
      openWindow,
      closeWindow,
      closeAllWindows,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      focusWindow,
      setWindowBounds,
      cycleWindows,
      isOpen: (id: string) => Boolean(windows[id]),
    }),
    [
      windows,
      order,
      activeId,
      openWindow,
      closeWindow,
      closeAllWindows,
      minimizeWindow,
      restoreWindow,
      toggleMaximize,
      focusWindow,
      setWindowBounds,
      cycleWindows,
    ],
  )

  return <WindowManagerContext.Provider value={value}>{children}</WindowManagerContext.Provider>
}

/* -------------------------------------------------------------------------- */
/* Vista de ventana gestionada                                                 */
/* -------------------------------------------------------------------------- */

interface ManagedWindowProps {
  id: string
  title: string
  icon?: ReactNode
  children: ReactNode
}

const CONTROL_BUTTON =
  "inline-flex h-6 w-6 items-center justify-center rounded-sm border border-[var(--omarchy-border,#2a2a2e)] text-[var(--omarchy-muted,#8b8b93)] transition-colors hover:border-[var(--omarchy-accent,#7aa2f7)] hover:text-[var(--omarchy-fg,#e6e6e6)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--omarchy-accent,#7aa2f7)]"

const RESIZE_HANDLES: Array<{ dir: string; className: string }> = [
  { dir: "n", className: "left-2 right-2 top-0 h-1.5 cursor-ns-resize" },
  { dir: "s", className: "left-2 right-2 bottom-0 h-1.5 cursor-ns-resize" },
  { dir: "w", className: "top-2 bottom-2 left-0 w-1.5 cursor-ew-resize" },
  { dir: "e", className: "top-2 bottom-2 right-0 w-1.5 cursor-ew-resize" },
  { dir: "nw", className: "top-0 left-0 h-3 w-3 cursor-nwse-resize" },
  { dir: "ne", className: "top-0 right-0 h-3 w-3 cursor-nesw-resize" },
  { dir: "sw", className: "bottom-0 left-0 h-3 w-3 cursor-nesw-resize" },
  { dir: "se", className: "bottom-0 right-0 h-3 w-3 cursor-nwse-resize" },
]

export function ManagedWindow({ id, title, icon, children }: ManagedWindowProps) {
  const {
    windows,
    activeId,
    closeWindow,
    minimizeWindow,
    toggleMaximize,
    focusWindow,
    setWindowBounds,
  } = useWindows()
  const state = windows[id]
  const isOpen = Boolean(state)

  const frameRef = useRef<HTMLDivElement>(null)
  const [viewport, setViewport] = useState(getViewport)
  const wasOpenRef = useRef(false)
  const prevMaximizedRef = useRef(false)
  const fromBoundsRef = useRef<WindowBounds | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; origin: WindowBounds } | null>(null)
  const resizeRef = useRef<{ dir: string; startX: number; startY: number; origin: WindowBounds } | null>(null)

  useEffect(() => {
    const handleResize = () => setViewport(getViewport())
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Animaciones de apertura/restauración con GSAP.
  useEffect(() => {
    const element = frameRef.current
    if (!isOpen) {
      wasOpenRef.current = false
      return
    }
    if (!element) return
    if (!wasOpenRef.current) {
      wasOpenRef.current = true
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          element,
          { opacity: 0, scale: 0.96, y: 14 },
          { opacity: 1, scale: 1, y: 0, duration: 0.24, ease: "power2.out" },
        )
      }
      return
    }
    if (state && !state.minimized && !prefersReducedMotion()) {
      gsap.fromTo(
        element,
        { opacity: 0, scale: 0.94, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.2, ease: "power2.out" },
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, state?.minimized])

  // Animación GSAP de maximizar/restaurar.
  useLayoutEffect(() => {
    const element = frameRef.current
    if (!element || !state) return
    if (prevMaximizedRef.current !== state.maximized) {
      const from = fromBoundsRef.current ?? state.bounds
      const to = state.maximized ? maxBoundsFor(viewport) : state.bounds
      prevMaximizedRef.current = state.maximized
      fromBoundsRef.current = null
      if (!prefersReducedMotion()) {
        gsap.fromTo(
          element,
          { left: from.x, top: from.y, width: from.width, height: from.height },
          { left: to.x, top: to.y, width: to.width, height: to.height, duration: 0.24, ease: "power2.inOut" },
        )
      }
    }
  }, [state, viewport])

  const handleClose = useCallback(() => {
    const element = frameRef.current
    if (!element || prefersReducedMotion()) {
      closeWindow(id)
      return
    }
    gsap.to(element, {
      opacity: 0,
      scale: 0.94,
      duration: 0.16,
      ease: "power2.in",
      onComplete: () => closeWindow(id),
    })
  }, [closeWindow, id])

  const handleMinimize = useCallback(() => {
    const element = frameRef.current
    if (!element || prefersReducedMotion()) {
      minimizeWindow(id)
      return
    }
    gsap.to(element, {
      opacity: 0,
      scale: 0.9,
      y: 28,
      duration: 0.18,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(element, { clearProps: "y,scale,opacity" })
        minimizeWindow(id)
      },
    })
  }, [minimizeWindow, id])

  const handleMaximize = useCallback(() => {
    if (!state) return
    fromBoundsRef.current = state.maximized ? maxBoundsFor(viewport) : state.bounds
    toggleMaximize(id)
  }, [state, toggleMaximize, id, viewport])

  /* ----------------------------- Drag & Drop ----------------------------- */

  const onHeaderPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!state || state.maximized) return
    if ((event.target as HTMLElement).closest("button")) return
    focusWindow(id)
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { startX: event.clientX, startY: event.clientY, origin: state.bounds }
  }

  const onHeaderPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag) return
    const { width: vw, height: vh } = getViewport()
    setWindowBounds(id, {
      ...drag.origin,
      x: clamp(drag.origin.x + event.clientX - drag.startX, -drag.origin.width + 96, vw - 96),
      y: clamp(drag.origin.y + event.clientY - drag.startY, TOP_INSET, vh - 48),
    })
  }

  const endDrag = (event: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  /* ------------------------------- Resize -------------------------------- */

  const makeResizeHandler = (dir: string) => (event: React.PointerEvent<HTMLDivElement>) => {
    if (!state || state.maximized) return
    event.stopPropagation()
    focusWindow(id)
    event.currentTarget.setPointerCapture(event.pointerId)
    resizeRef.current = { dir, startX: event.clientX, startY: event.clientY, origin: state.bounds }
  }

  const onResizeMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const resize = resizeRef.current
    if (!resize) return
    const dx = event.clientX - resize.startX
    const dy = event.clientY - resize.startY
    const { x: ox, y: oy, width: ow, height: oh } = resize.origin
    let x = ox
    let y = oy
    let width = ow
    let height = oh
    if (resize.dir.includes("e")) width = Math.max(MIN_WIDTH, ow + dx)
    if (resize.dir.includes("s")) height = Math.max(MIN_HEIGHT, oh + dy)
    if (resize.dir.includes("w")) {
      width = Math.max(MIN_WIDTH, ow - dx)
      x = ox + (ow - width)
    }
    if (resize.dir.includes("n")) {
      height = Math.max(MIN_HEIGHT, oh - dy)
      y = oy + (oh - height)
    }
    setWindowBounds(id, { x, y, width, height })
  }

  const endResize = (event: React.PointerEvent<HTMLDivElement>) => {
    resizeRef.current = null
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
  }

  const onHeaderKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault()
      handleClose()
      return
    }
    if (!event.altKey || !state || state.maximized) return
    const step = event.shiftKey ? 16 : 8
    const bounds = state.bounds
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        if (event.shiftKey) setWindowBounds(id, { ...bounds, width: Math.max(MIN_WIDTH, bounds.width - step) })
        else setWindowBounds(id, { ...bounds, x: bounds.x - step })
        break
      case "ArrowRight":
        event.preventDefault()
        if (event.shiftKey) setWindowBounds(id, { ...bounds, width: bounds.width + step })
        else setWindowBounds(id, { ...bounds, x: bounds.x + step })
        break
      case "ArrowUp":
        event.preventDefault()
        if (event.shiftKey) setWindowBounds(id, { ...bounds, height: Math.max(MIN_HEIGHT, bounds.height - step) })
        else setWindowBounds(id, { ...bounds, y: bounds.y - step })
        break
      case "ArrowDown":
        event.preventDefault()
        if (event.shiftKey) setWindowBounds(id, { ...bounds, height: bounds.height + step })
        else setWindowBounds(id, { ...bounds, y: bounds.y + step })
        break
      default:
        break
    }
  }

  if (!state) return null

  const isActive = activeId === id
  const resolvedBounds = state.maximized ? maxBoundsFor(viewport) : state.bounds

  return (
    <div
      ref={frameRef}
      role="dialog"
      aria-label={`Ventana ${title}`}
      aria-modal={false}
      data-window-id={id}
      className="absolute flex flex-col overflow-hidden rounded-sm border bg-[var(--omarchy-surface,#0d0d10)] text-[var(--omarchy-fg,#e6e6e6)] shadow-[0_20px_60px_rgba(0,0,0,0.55)] font-[family-name:var(--font-jetbrains-mono),ui-monospace,monospace]"
      style={{
        left: resolvedBounds.x,
        top: resolvedBounds.y,
        width: resolvedBounds.width,
        height: resolvedBounds.height,
        zIndex: state.zIndex,
        display: state.minimized ? "none" : undefined,
        borderColor: isActive ? "var(--omarchy-accent,#7aa2f7)" : "var(--omarchy-border,#2a2a2e)",
      }}
      onPointerDown={() => focusWindow(id)}
    >
      {/* Header arrastrable */}
      <div
        role="button"
        tabIndex={0}
        aria-label={`${title}. Usa Alt+flechas para mover y Alt+Shift+flechas para redimensionar. Escape cierra.`}
        onPointerDown={onHeaderPointerDown}
        onPointerMove={onHeaderPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onHeaderKeyDown}
        className={`flex h-9 shrink-0 cursor-grab select-none items-center justify-between gap-2 border-b bg-[var(--omarchy-surface-alt,#141419)] px-2 active:cursor-grabbing focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--omarchy-accent,#7aa2f7)] ${
          isActive ? "border-[var(--omarchy-accent,#7aa2f7)]" : "border-[var(--omarchy-border,#2a2a2e)]"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          {icon ? <span className="shrink-0 text-[var(--omarchy-accent,#7aa2f7)]">{icon}</span> : null}
          <span className="truncate text-xs font-medium tracking-wide">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={CONTROL_BUTTON}
            onClick={handleMinimize}
            aria-label={`Minimizar ${title}`}
            title="Minimizar"
          >
            <Minus className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className={CONTROL_BUTTON}
            onClick={handleMaximize}
            aria-label={state.maximized ? `Restaurar ${title}` : `Maximizar ${title}`}
            title={state.maximized ? "Restaurar" : "Maximizar"}
          >
            {state.maximized ? (
              <Copy className="h-3 w-3" aria-hidden="true" />
            ) : (
              <Square className="h-3 w-3" aria-hidden="true" />
            )}
          </button>
          <button
            type="button"
            className={`${CONTROL_BUTTON} hover:border-red-500 hover:text-red-400`}
            onClick={handleClose}
            aria-label={`Cerrar ${title}`}
            title="Cerrar"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Contenido */}
      <div className="min-h-0 flex-1 overflow-hidden">{children}</div>

      {/* Asas de redimensionado (ratón) */}
      {!state.maximized
        ? RESIZE_HANDLES.map((handle) => (
            <div
              key={handle.dir}
              aria-hidden="true"
              data-resize-dir={handle.dir}
              onPointerDown={makeResizeHandler(handle.dir)}
              onPointerMove={onResizeMove}
              onPointerUp={endResize}
              onPointerCancel={endResize}
              className={`absolute ${handle.className}`}
            />
          ))
        : null}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Taskbar                                                                     */
/* -------------------------------------------------------------------------- */

function WindowTaskbar({ onOpenLauncher }: { onOpenLauncher?: () => void }) {
  const { order, windows, activeId, focusWindow, minimizeWindow, restoreWindow } = useWindows()
  const items = order.map((id) => windows[id]).filter(Boolean)

  return (
    <div
      role="toolbar"
      aria-label="Ventanas abiertas y lanzador"
      className="pointer-events-auto absolute bottom-5 left-4 z-[110] flex max-w-[70vw] items-center gap-1 overflow-x-auto rounded-sm border border-[var(--omarchy-border,#2a2a2e)] bg-[var(--omarchy-surface,#0d0d10)]/95 px-2 py-1 font-[family-name:var(--font-jetbrains-mono),ui-monospace,monospace] backdrop-blur-sm"
    >
      <button
        type="button"
        onClick={onOpenLauncher}
        aria-label="Abrir lanzador de comandos (Ctrl+K)"
        title="Lanzador (Ctrl+K)"
        className="flex items-center gap-1 rounded-sm border border-[var(--omarchy-border,#2a2a2e)] px-2 py-1 text-[11px] uppercase tracking-widest text-[var(--omarchy-muted,#a0a0a8)] transition-colors hover:border-[var(--omarchy-accent,#7aa2f7)] hover:text-[var(--omarchy-accent,#7aa2f7)] focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--omarchy-accent,#7aa2f7)]"
      >
        <Search className="h-3 w-3" aria-hidden="true" />
        ctrl+k
      </button>
      {items.length > 0 ? (
        <span className="mx-1 flex items-center gap-1 px-1 text-[10px] uppercase tracking-widest text-[var(--omarchy-muted,#8b8b93)]">
          <Layers className="h-3 w-3" aria-hidden="true" />
          wm
        </span>
      ) : null}
      {items.map((item) => {
        const isActive = activeId === item.id && !item.minimized
        return (
          <div key={item.id} className="flex items-center">
            <button
              type="button"
              onClick={() => (item.minimized ? restoreWindow(item.id) : isActive ? minimizeWindow(item.id) : focusWindow(item.id))}
              aria-label={`${item.minimized ? "Restaurar" : isActive ? "Minimizar" : "Enfocar"} ${item.title}`}
              aria-pressed={isActive}
              className={`max-w-[180px] truncate rounded-sm border px-2 py-1 text-[11px] transition-colors focus-visible:outline focus-visible:outline-1 focus-visible:outline-[var(--omarchy-accent,#7aa2f7)] ${
                isActive
                  ? "border-[var(--omarchy-accent,#7aa2f7)] text-[var(--omarchy-accent,#7aa2f7)]"
                  : "border-[var(--omarchy-border,#2a2a2e)] text-[var(--omarchy-muted,#a0a0a8)] hover:text-[var(--omarchy-fg,#e6e6e6)]"
              }`}
            >
              {item.minimized ? "· " : ""}
              {item.title}
            </button>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Alt-Tab switcher                                                            */
/* -------------------------------------------------------------------------- */

export function AltTabSwitcher() {
  const { order, windows, activeId, focusWindow, restoreWindow } = useWindows()
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const openRef = useRef(false)
  const indexRef = useRef(0)
  const list = useMemo(() => order.map((id) => windows[id]).filter(Boolean), [order, windows])

  useEffect(() => {
    indexRef.current = index
  }, [index])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey && event.key === "Tab" && !event.ctrlKey && !event.metaKey) {
        if (list.length < 1) return
        event.preventDefault()
        event.stopPropagation()
        if (!openRef.current) {
          openRef.current = true
          setOpen(true)
          const currentIndex = list.findIndex((item) => item.id === activeId)
          const next = currentIndex === -1 ? 0 : (currentIndex + (event.shiftKey ? -1 : 1) + list.length) % list.length
          setIndex(next)
        } else {
          setIndex((current) => (current + (event.shiftKey ? -1 : 1) + list.length) % list.length)
        }
        return
      }
      if (event.key === "Escape" && openRef.current) {
        event.preventDefault()
        openRef.current = false
        setOpen(false)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.key === "Alt" && openRef.current) {
        const chosen = list[indexRef.current]
        openRef.current = false
        setOpen(false)
        if (chosen) {
          restoreWindow(chosen.id)
          focusWindow(chosen.id)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown, true)
    window.addEventListener("keyup", handleKeyUp, true)
    return () => {
      window.removeEventListener("keydown", handleKeyDown, true)
      window.removeEventListener("keyup", handleKeyUp, true)
    }
  }, [list, activeId, focusWindow, restoreWindow])

  if (!open || list.length === 0) return null

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[200] flex items-center justify-center bg-black/40"
      role="presentation"
    >
      <div
        role="listbox"
        aria-label="Cambiar de ventana (Alt+Tab)"
        className="pointer-events-auto max-w-[80vw] rounded-sm border border-[var(--omarchy-border,#2a2a2e)] bg-[var(--omarchy-surface,#0d0d10)] p-3 font-[family-name:var(--font-jetbrains-mono),ui-monospace,monospace] shadow-2xl"
      >
        <p className="mb-2 text-[10px] uppercase tracking-widest text-[var(--omarchy-muted,#8b8b93)]">
          alt + tab · {list[index]?.title}
        </p>
        <div className="flex items-center gap-2">
          {list.map((item, itemIndex) => (
            <div
              key={item.id}
              role="option"
              aria-selected={itemIndex === index}
              className={`flex h-20 w-32 flex-col justify-between rounded-sm border p-2 text-xs ${
                itemIndex === index
                  ? "border-[var(--omarchy-accent,#7aa2f7)] bg-[var(--omarchy-accent,#7aa2f7)]/10 text-[var(--omarchy-accent,#7aa2f7)]"
                  : "border-[var(--omarchy-border,#2a2a2e)] text-[var(--omarchy-muted,#a0a0a8)]"
              }`}
            >
              <span className="truncate">{item.title}</span>
              <span className="text-[10px] opacity-70">{item.minimized ? "minimizada" : "abierta"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Capa de ventanas (taskbar + alt-tab)                                        */
/* -------------------------------------------------------------------------- */

export function WindowLayer({ children, onOpenLauncher }: { children: ReactNode; onOpenLauncher?: () => void }) {
  return (
    <>
      {children}
      <WindowTaskbar onOpenLauncher={onOpenLauncher} />
      <AltTabSwitcher />
    </>
  )
}
