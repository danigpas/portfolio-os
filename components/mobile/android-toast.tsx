"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"

interface ToastProps {
  message: string
  duration?: number
  onClose: () => void
}

export default function AndroidToast({ message, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 300) // Wait for animation to complete
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 flex justify-center">
      <Card
        className={`bg-card/95 backdrop-blur-sm border border-border px-4 py-3 shadow-lg transition-all duration-300 ${
          isVisible ? "animate-in slide-in-from-bottom" : "animate-out slide-out-to-bottom"
        }`}
      >
        <p className="text-sm text-foreground text-center">{message}</p>
      </Card>
    </div>
  )
}
