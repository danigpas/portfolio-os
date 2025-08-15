"use client"

import type React from "react"

import { useState } from "react"
import { useTheme } from "@/components/theme-system"

interface HoverCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  tiltIntensity?: number
}

export function HoverCard({ children, className = "", glowColor, tiltIntensity = 5 }: HoverCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { theme } = useTheme()

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePosition({ x, y })
  }

  const getGlowColor = () => {
    if (glowColor) return glowColor
    switch (theme) {
      case "matrix":
        return "rgba(34, 197, 94, 0.3)"
      case "vscode":
        return "rgba(59, 130, 246, 0.3)"
      default:
        return "rgba(249, 115, 22, 0.3)"
    }
  }

  const getTiltStyle = () => {
    if (!isHovered) return {}

    const rect = { width: 300, height: 200 } // Approximate card dimensions
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = ((mousePosition.y - centerY) / centerY) * -tiltIntensity
    const rotateY = ((mousePosition.x - centerX) / centerX) * tiltIntensity

    return {
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
    }
  }

  return (
    <div
      className={`relative transition-all duration-300 ease-out cursor-pointer ${className}`}
      style={{
        ...getTiltStyle(),
        boxShadow: isHovered ? `0 20px 40px ${getGlowColor()}` : "0 4px 6px rgba(0, 0, 0, 0.1)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {children}

      {/* Glow effect */}
      {isHovered && (
        <div
          className="absolute inset-0 rounded-lg opacity-50 blur-xl -z-10"
          style={{
            background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, ${getGlowColor()}, transparent 70%)`,
          }}
        />
      )}
    </div>
  )
}

export function MagneticButton({
  children,
  className = "",
  magnetStrength = 20,
}: {
  children: React.ReactNode
  className?: string
  magnetStrength?: number
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const deltaX = (e.clientX - centerX) * 0.15
    const deltaY = (e.clientY - centerY) * 0.15

    setPosition({ x: deltaX, y: deltaY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
    setIsHovered(false)
  }

  return (
    <button
      className={`relative transition-all duration-300 ease-out ${className}`}
      style={{
        transform: `translate(${position.x}px, ${position.y}px) scale(${isHovered ? 1.05 : 1})`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}
    </button>
  )
}

export function RippleEffect({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [ripples, setRipples] = useState<Array<{ x: number; y: number; id: number }>>([])

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()

    setRipples((prev) => [...prev, { x, y, id }])

    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.id !== id))
    }, 600)
  }

  return (
    <div className={`relative overflow-hidden cursor-pointer ${className}`} onClick={handleClick}>
      {children}

      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="absolute rounded-full bg-white/30 animate-ping"
          style={{
            left: ripple.x - 10,
            top: ripple.y - 10,
            width: 20,
            height: 20,
            animationDuration: "600ms",
          }}
        />
      ))}
    </div>
  )
}

export function GlitchText({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  const [isGlitching, setIsGlitching] = useState(false)

  return (
    <div
      className={`relative inline-block cursor-pointer ${className}`}
      onMouseEnter={() => setIsGlitching(true)}
      onMouseLeave={() => setIsGlitching(false)}
    >
      <span className={`relative z-10 ${isGlitching ? "animate-pulse" : ""}`}>{children}</span>

      {isGlitching && (
        <>
          <span
            className="absolute top-0 left-0 text-red-500 opacity-70 animate-bounce"
            style={{ transform: "translate(-1px, -1px)" }}
          >
            {children}
          </span>
          <span
            className="absolute top-0 left-0 text-blue-500 opacity-70 animate-bounce"
            style={{ transform: "translate(1px, 1px)", animationDelay: "0.1s" }}
          >
            {children}
          </span>
        </>
      )}
    </div>
  )
}

export function MorphingShape({
  className = "",
  color = "bg-orange-500",
}: {
  className?: string
  color?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`w-20 h-20 ${color} rounded-full animate-pulse transition-all duration-1000 hover:rounded-none hover:rotate-45`}
        style={{
          animationDuration: "2s",
        }}
      />
    </div>
  )
}
