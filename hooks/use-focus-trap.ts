"use client"

import { useEffect, type RefObject } from "react"

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ")

function getFocusable(node: HTMLElement): HTMLElement[] {
  return Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (el) => el.offsetParent !== null || el === document.activeElement,
  )
}

/**
 * Atrapa el foco dentro de un contenedor mientras `active` sea true.
 * Uso típico: modales (rofi, apagado). Devuelve el foco al elemento anterior al cerrar.
 */
export function useFocusTrap(ref: RefObject<HTMLElement | null>, active: boolean) {
  useEffect(() => {
    if (!active) return
    const node = ref.current
    if (!node) return

    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const focusables = getFocusable(node)
    ;(focusables[0] ?? node).focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return
      const items = getFocusable(node)
      if (items.length === 0) {
        event.preventDefault()
        return
      }
      const first = items[0]
      const last = items[items.length - 1]
      const current = document.activeElement
      if (event.shiftKey && current === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && current === last) {
        event.preventDefault()
        first.focus()
      }
    }

    node.addEventListener("keydown", handleKeyDown)
    return () => {
      node.removeEventListener("keydown", handleKeyDown)
      previouslyFocused?.focus?.()
    }
  }, [ref, active])
}
