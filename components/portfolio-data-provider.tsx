"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react"
import { useLanguage } from "@/components/language-provider"
import { getCvData, type CVData } from "@/lib/cv-data"
import { checkBackendHealth, fetchPortfolioData, type DataSource } from "@/lib/api"

interface PortfolioDataContextValue {
  /** Datos del portfolio (API si responde; locales como fallback). */
  cv: CVData
  /** Origen del último conjunto de datos cargado. */
  source: DataSource
  /** true mientras se consulta la API por primera vez. */
  loading: boolean
  /** Mensaje de error de la API (si la hubo). */
  error: string | null
  /** null mientras no se sabe; true/false tras el primer health check. */
  backendOnline: boolean | null
  /** Fuerza una recarga (útil para reintentar tras un error). */
  refresh: () => void
}

const noop = () => {}

const PortfolioDataContext = createContext<PortfolioDataContextValue | null>(null)

const HEALTH_POLL_MS = 30000

/**
 * Provee los datos del portfolio a todo el escritorio. Consulta la API FastAPI
 * (T1) y degrada a `lib/cv-data.ts` si no responde (offline-first).
 */
export function PortfolioDataProvider({ children }: { children: ReactNode }) {
  const { language } = useLanguage()
  const [cv, setCv] = useState<CVData>(() => getCvData(language))
  const [source, setSource] = useState<DataSource>("local")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null)
  const [reloadToken, setReloadToken] = useState(0)

  const refresh = useCallback(() => setReloadToken((token) => token + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchPortfolioData(language)
      .then((result) => {
        if (cancelled) return
        setCv(result.cv)
        setSource(result.source)
        setError(result.error)
        setBackendOnline(result.apiReachable)
      })
      .catch((cause: unknown) => {
        if (cancelled) return
        setCv(getCvData(language))
        setSource("local")
        setError(cause instanceof Error ? cause.message : "Error desconocido")
        setBackendOnline(false)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [language, reloadToken])

  // Sondeo periódico del estado del backend para el indicador de la waybar.
  useEffect(() => {
    let cancelled = false
    const ping = async () => {
      const health = await checkBackendHealth()
      if (!cancelled) setBackendOnline(health !== null)
    }
    void ping()
    const timer = window.setInterval(ping, HEALTH_POLL_MS)
    return () => {
      cancelled = true
      window.clearInterval(timer)
    }
  }, [reloadToken])

  const value = useMemo<PortfolioDataContextValue>(
    () => ({ cv, source, loading, error, backendOnline, refresh }),
    [cv, source, loading, error, backendOnline, refresh],
  )

  return <PortfolioDataContext.Provider value={value}>{children}</PortfolioDataContext.Provider>
}

/**
 * Acceso a los datos del portfolio. Fuera del provider (p. ej. SSR de la
 * landing) devuelve los datos locales, de modo que el render nunca falla.
 */
export function usePortfolioData(): PortfolioDataContextValue {
  const context = useContext(PortfolioDataContext)
  const { language } = useLanguage()
  const fallback = useRef<PortfolioDataContextValue | null>(null)
  if (!context && !fallback.current) {
    fallback.current = {
      cv: getCvData(language),
      source: "local",
      loading: false,
      error: null,
      backendOnline: null,
      refresh: noop,
    }
  }
  return context ?? (fallback.current as PortfolioDataContextValue)
}

/** Atajo: sólo los datos tipados del CV. */
export function useCvData(): CVData {
  return usePortfolioData().cv
}
