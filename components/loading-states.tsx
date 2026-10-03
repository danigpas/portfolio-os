"use client"

import type React from "react"

import { useState } from "react"

interface LoadingStateProps {
  type?: "skeleton" | "spinner" | "pulse" | "wave" | "dots"
  size?: "sm" | "md" | "lg"
  text?: string
  className?: string
}

export function LoadingState({ type = "skeleton", size = "md", text, className = "" }: LoadingStateProps) {
  const getThemeClasses = () => "text-[var(--omarchy-accent)] border-[var(--omarchy-border)]"

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4"
      case "lg":
        return "w-8 h-8"
      default:
        return "w-6 h-6"
    }
  }

  if (type === "skeleton") {
    return (
      <div className={`animate-pulse space-y-4 ${className}`}>
        <div className="h-4 bg-[var(--omarchy-surface-alt)] rounded w-3/4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-[var(--omarchy-surface-alt)] rounded"></div>
          <div className="h-4 bg-[var(--omarchy-surface-alt)] rounded w-5/6"></div>
        </div>
      </div>
    )
  }

  if (type === "spinner") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div
          className={`${getSizeClasses()} border-2 border-[var(--omarchy-border)] border-t-current rounded-full animate-spin ${getThemeClasses()}`}
        ></div>
        {text && <span className={`ml-2 ${getThemeClasses()}`}>{text}</span>}
      </div>
    )
  }

  if (type === "pulse") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className={`${getSizeClasses()} rounded-full animate-pulse ${getThemeClasses()} bg-current`}></div>
        {text && <span className={`ml-2 ${getThemeClasses()}`}>{text}</span>}
      </div>
    )
  }

  if (type === "wave") {
    return (
      <div className={`flex items-center justify-center space-x-1 ${className}`}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={`w-2 h-6 rounded-full animate-pulse ${getThemeClasses()} bg-current`}
            style={{ animationDelay: `${i * 0.2}s` }}
          ></div>
        ))}
        {text && <span className={`ml-2 ${getThemeClasses()}`}>{text}</span>}
      </div>
    )
  }

  if (type === "dots") {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="flex space-x-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full animate-bounce ${getThemeClasses()} bg-current`}
              style={{ animationDelay: `${i * 0.1}s` }}
            ></div>
          ))}
        </div>
        {text && <span className={`ml-2 ${getThemeClasses()}`}>{text}</span>}
      </div>
    )
  }

  return null
}

export function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="bg-[var(--omarchy-surface-alt)] h-48 rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-[var(--omarchy-surface-alt)] rounded w-3/4"></div>
        <div className="h-4 bg-[var(--omarchy-surface-alt)] rounded w-1/2"></div>
      </div>
    </div>
  )
}

export function SkeletonList({ items = 3 }: { items?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-[var(--omarchy-surface-alt)] h-10 w-10"></div>
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-[var(--omarchy-surface-alt)] rounded w-3/4"></div>
            <div className="h-4 bg-[var(--omarchy-surface-alt)] rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  )
}

export function LoadingOverlay({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) {
  if (!isLoading) return <>{children}</>

  return (
    <div className="relative">
      <div className="opacity-50 pointer-events-none">{children}</div>
      <div className="absolute inset-0 flex items-center justify-center bg-[var(--omarchy-bg)]/80 backdrop-blur-sm">
        <LoadingState type="spinner" size="lg" text="Cargando..." />
      </div>
    </div>
  )
}

interface ProgressiveLoadingProps {
  steps: string[]
  currentStep: number
  className?: string
}

export function ProgressiveLoading({ steps, currentStep, className = "" }: ProgressiveLoadingProps) {
  const getThemeClasses = () => "text-[var(--omarchy-accent)] bg-[var(--omarchy-accent)]"

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Progreso de carga</span>
        <span className="text-sm text-[var(--omarchy-muted)]">
          {currentStep + 1} / {steps.length}
        </span>
      </div>

      <div className="w-full bg-[var(--omarchy-surface-alt)] rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-500 ${getThemeClasses()}`}
          style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      <div className="space-y-2">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div
              className={`w-4 h-4 rounded-full flex items-center justify-center ${
                index <= currentStep
                  ? `${getThemeClasses()} text-[var(--omarchy-bg)]`
                  : "bg-[var(--omarchy-surface-alt)] text-[var(--omarchy-muted)]"
              }`}
            >
              {index < currentStep ? "✓" : index === currentStep ? "..." : index + 1}
            </div>
            <span
              className={`text-sm ${
                index <= currentStep ? getThemeClasses() : "text-[var(--omarchy-muted)]"
              }`}
            >
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function useLoadingStates() {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState("")
  const [progress, setProgress] = useState(0)

  const startLoading = (text = "Cargando...") => {
    setIsLoading(true)
    setLoadingText(text)
    setProgress(0)
  }

  const updateProgress = (value: number, text?: string) => {
    setProgress(value)
    if (text) setLoadingText(text)
  }

  const stopLoading = () => {
    setIsLoading(false)
    setLoadingText("")
    setProgress(0)
  }

  return {
    isLoading,
    loadingText,
    progress,
    startLoading,
    updateProgress,
    stopLoading,
  }
}
