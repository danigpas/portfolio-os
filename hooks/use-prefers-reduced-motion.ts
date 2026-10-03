"use client"

import { useEffect, useState } from "react"

/**
 * Returns true when the user asked the OS to reduce motion.
 * Used to skip GSAP tweens on the desktop (hover/entrance micro-interactions).
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(query.matches)
    const listener = () => setReduced(query.matches)
    query.addEventListener("change", listener)
    return () => query.removeEventListener("change", listener)
  }, [])

  return reduced
}
