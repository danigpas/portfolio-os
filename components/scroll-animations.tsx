"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"

interface ScrollAnimationProps {
  children: React.ReactNode
  animation?: "fadeIn" | "slideUp" | "slideLeft" | "slideRight" | "scaleIn" | "rotateIn"
  delay?: number
  duration?: number
  threshold?: number
  className?: string
}

export function ScrollAnimation({
  children,
  animation = "fadeIn",
  delay = 0,
  duration = 600,
  threshold = 0.1,
  className = "",
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true)
          }, delay)
        }
      },
      { threshold },
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current)
      }
    }
  }, [delay, threshold])

  const getAnimationClasses = () => {
    const baseClasses = `transition-all duration-${duration}`

    if (!isVisible) {
      switch (animation) {
        case "fadeIn":
          return `${baseClasses} opacity-0`
        case "slideUp":
          return `${baseClasses} opacity-0 translate-y-8`
        case "slideLeft":
          return `${baseClasses} opacity-0 translate-x-8`
        case "slideRight":
          return `${baseClasses} opacity-0 -translate-x-8`
        case "scaleIn":
          return `${baseClasses} opacity-0 scale-95`
        case "rotateIn":
          return `${baseClasses} opacity-0 rotate-3 scale-95`
        default:
          return `${baseClasses} opacity-0`
      }
    }

    return `${baseClasses} opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0`
  }

  return (
    <div ref={elementRef} className={`${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  )
}

export function ParallaxElement({
  children,
  speed = 0.5,
  className = "",
}: {
  children: React.ReactNode
  speed?: number
  className?: string
}) {
  const [offsetY, setOffsetY] = useState(0)
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const rect = elementRef.current.getBoundingClientRect()
        const scrolled = window.pageYOffset
        const rate = scrolled * -speed
        setOffsetY(rate)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [speed])

  return (
    <div
      ref={elementRef}
      className={className}
      style={{
        transform: `translateY(${offsetY}px)`,
      }}
    >
      {children}
    </div>
  )
}

export function StaggeredAnimation({
  children,
  staggerDelay = 100,
  className = "",
}: {
  children: React.ReactNode[]
  staggerDelay?: number
  className?: string
}) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <ScrollAnimation key={index} animation="slideUp" delay={index * staggerDelay} className="mb-4">
          {child}
        </ScrollAnimation>
      ))}
    </div>
  )
}

export function FloatingElement({
  children,
  intensity = 10,
  speed = 2000,
  className = "",
}: {
  children: React.ReactNode
  intensity?: number
  speed?: number
  className?: string
}) {
  return (
    <div
      className={`animate-bounce ${className}`}
      style={{
        animationDuration: `${speed}ms`,
        animationTimingFunction: "ease-in-out",
        animationIterationCount: "infinite",
        animationDirection: "alternate",
      }}
    >
      {children}
    </div>
  )
}
