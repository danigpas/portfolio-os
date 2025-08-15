"use client"

import { useEffect } from "react"

export function PWAServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("[v0] SW registered: ", registration)
        })
        .catch((registrationError) => {
          console.log("[v0] SW registration failed: ", registrationError)
        })
    }
  }, [])

  return null
}
