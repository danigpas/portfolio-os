"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useTheme } from "@/components/theme-system"

export function TypewriterText({
  text,
  speed = 100,
  className = "",
  onComplete,
}: {
  text: string
  speed?: number
  className?: string
  onComplete?: () => void
}) {
  const [displayedText, setDisplayedText] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex])
        setCurrentIndex((prev) => prev + 1)
      }, speed)

      return () => clearTimeout(timer)
    } else if (onComplete) {
      onComplete()
    }
  }, [currentIndex, text, speed, onComplete])

  return (
    <span className={className}>
      {displayedText}
      <span className="animate-pulse">|</span>
    </span>
  )
}

export function CountUpAnimation({
  end,
  duration = 2000,
  className = "",
  prefix = "",
  suffix = "",
}: {
  end: number
  duration?: number
  className?: string
  prefix?: string
  suffix?: string
}) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)

          const startTime = Date.now()
          const startValue = 0

          const animate = () => {
            const now = Date.now()
            const elapsed = now - startTime
            const progress = Math.min(elapsed / duration, 1)

            const easeOutQuart = 1 - Math.pow(1 - progress, 4)
            const currentValue = Math.floor(startValue + (end - startValue) * easeOutQuart)

            setCount(currentValue)

            if (progress < 1) {
              requestAnimationFrame(animate)
            }
          }

          requestAnimationFrame(animate)
        }
      },
      { threshold: 0.5 },
    )

    const element = document.getElementById(`count-${end}`)
    if (element) {
      observer.observe(element)
    }

    return () => {
      if (element) {
        observer.unobserve(element)
      }
    }
  }, [end, duration, isVisible])

  return (
    <span id={`count-${end}`} className={className}>
      {prefix}
      {count}
      {suffix}
    </span>
  )
}

export function ProgressBar({
  progress,
  className = "",
  animated = true,
}: {
  progress: number
  className?: string
  animated?: boolean
}) {
  const { theme } = useTheme()

  const getProgressColor = () => {
    switch (theme) {
      case "matrix":
        return "bg-green-500"
      case "vscode":
        return "bg-blue-500"
      default:
        return "bg-orange-500"
    }
  }

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 overflow-hidden ${className}`}>
      <div
        className={`h-full ${getProgressColor()} transition-all duration-1000 ease-out ${
          animated ? "animate-pulse" : ""
        }`}
        style={{ width: `${Math.min(Math.max(progress, 0), 100)}%` }}
      />
    </div>
  )
}

export function PulsingDot({
  size = "w-3 h-3",
  color = "bg-orange-500",
  className = "",
}: {
  size?: string
  color?: string
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <div className={`${size} ${color} rounded-full animate-ping absolute`} />
      <div className={`${size} ${color} rounded-full relative`} />
    </div>
  )
}

export function WaveAnimation({
  className = "",
  color = "text-orange-500",
}: {
  className?: string
  color?: string
}) {
  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className={`w-1 h-8 ${color.replace("text-", "bg-")} rounded-full animate-pulse`}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: "1s",
          }}
        />
      ))}
    </div>
  )
}

export function RotatingBorder({
  children,
  className = "",
  borderColor = "border-orange-500",
}: {
  children: React.ReactNode
  className?: string
  borderColor?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`absolute inset-0 ${borderColor} border-2 rounded-lg animate-spin`}
        style={{ animationDuration: "3s" }}
      />
      <div className="relative bg-white rounded-lg p-4">{children}</div>
    </div>
  )
}

export function ShimmerEffect({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {children}
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  )
}
