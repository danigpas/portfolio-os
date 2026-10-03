/**
 * lib/api.ts
 *
 * Cliente tipado de la API FastAPI del portfolio (T1) para el frontend (T5).
 *
 * - Lee la URL base de `NEXT_PUBLIC_API_URL` (por defecto `http://localhost:8000`).
 * - Todas las llamadas tienen un timeout de {@link API_TIMEOUT_MS}.
 * - Si la API no responde, el frontend degrada a los datos locales de
 *   `lib/cv-data.ts` (offline-first): nunca se rompe la experiencia.
 */

import {
  getCvData,
  type CVData,
  type ContactInfo,
  type EducationItem,
  type ExperienceItem,
  type Language,
  type ProjectItem,
  type SkillGroup,
} from "@/lib/cv-data"

/** URL base de la API. Debe apuntar al backend FastAPI (sin barra final). */
export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/+$/, "")

/** Timeout por defecto (3s) antes de considerar la API caída. */
export const API_TIMEOUT_MS = 3000

export type DataSource = "api" | "local"

export interface BackendHealth {
  status: string
  service: string
  version: string
  timestamp: string
}

export interface PortfolioData {
  cv: CVData
  source: DataSource
  /** true si al menos un endpoint devolvió datos reales. */
  apiReachable: boolean
  /** Mensaje del último error, para depuración/UI. */
  error: string | null
}

// ---------------------------------------------------------------------------
// Tipos crudos de la API (coinciden con backend/app/schemas/__init__.py)
// ---------------------------------------------------------------------------
interface RawSocialLink {
  label: string
  url: string
}

interface RawStatItem {
  label: string
  value: string
}

interface RawAbout {
  name: string
  role: string
  location: string
  summary: string
  email: string
  years_of_experience: number
  currently_learning: string
  stats: RawStatItem[]
  links: RawSocialLink[]
}

interface RawExperience {
  id: string
  company: string
  role: string
  location: string
  period: string
  start: string
  end: string | null
  current: boolean
  employment_type: string
  description: string[]
  technologies: string[]
  achievements: string[]
}

interface RawEducation {
  id: string
  institution: string
  degree: string
  period: string
  status: string
  description: string
  skills: string[]
}

interface RawProject {
  id: string
  name: string
  project_type: string
  description: string
  technologies: string[]
  status: string
  url: string | null
  repository: string | null
  featured: boolean
}

interface RawSkillCategory {
  id: string
  name: string
  items: string[]
}

interface RawExperienceResponse {
  total: number
  items: RawExperience[]
}

interface RawEducationResponse {
  total: number
  items: RawEducation[]
}

interface RawProjectsResponse {
  total: number
  items: RawProject[]
}

interface RawSkillsResponse {
  total: number
  categories: RawSkillCategory[]
}

// ---------------------------------------------------------------------------
// Fetch con timeout
// ---------------------------------------------------------------------------
async function request<T>(path: string, init?: RequestInit, timeoutMs: number = API_TIMEOUT_MS): Promise<T> {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...init,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        ...init?.headers,
      },
    })
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} en ${path}`)
    }
    return (await response.json()) as T
  } finally {
    clearTimeout(timer)
  }
}

/** Comprueba si el backend responde. Devuelve `null` si está caído. */
export async function checkBackendHealth(timeoutMs: number = API_TIMEOUT_MS): Promise<BackendHealth | null> {
  try {
    return await request<BackendHealth>("/api/health", undefined, timeoutMs)
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Mapeo API -> CVData (merge sobre los datos locales)
// ---------------------------------------------------------------------------
function formatYears(years: number, language: Language): string {
  const rounded = Number.isInteger(years) ? String(years) : years.toFixed(1)
  return language === "es" ? `${rounded}+ años` : `${rounded}+ years`
}

function mapContact(raw: RawAbout, base: ContactInfo): ContactInfo {
  const findLink = (label: string) => raw.links.find((link) => link.label.toLowerCase() === label)?.url
  return {
    ...base,
    email: raw.email || base.email,
    location: raw.location || base.location,
    github: findLink("github") ?? base.github,
    linkedin: findLink("linkedin") ?? base.linkedin,
  }
}

function mapAbout(raw: RawAbout, base: CVData, language: Language): CVData["about"] {
  return {
    ...base.about,
    name: raw.name || base.about.name,
    role: raw.role || base.about.role,
    summary: raw.summary || base.about.summary,
    location: raw.location || base.about.location,
    yearsOfExperience: formatYears(raw.years_of_experience, language),
    bullets: raw.stats.length > 0 ? raw.stats.map((stat) => `${stat.label}: ${stat.value}`) : base.about.bullets,
  }
}

function mapExperience(items: RawExperience[], _base: ExperienceItem[]): ExperienceItem[] {
  return items.map((item) => ({
    id: item.id,
    company: item.company,
    role: item.role,
    location: item.location,
    period: item.period,
    start: item.start,
    end: item.end,
    current: item.current,
    type: item.employment_type,
    summary: item.description.join(" "),
    highlights: item.achievements.length > 0 ? item.achievements : item.description,
    stack: item.technologies,
  }))
}

function mapEducation(items: RawEducation[], base: EducationItem[]): EducationItem[] {
  const byId = new Map(base.map((item) => [item.id, item]))
  return items.map((item) => ({
    id: item.id,
    title: item.degree,
    institution: item.institution,
    location: byId.get(item.id)?.location ?? "",
    period: item.period,
    status: item.status,
    description: item.description,
    tags: item.skills,
  }))
}

function mapProjects(items: RawProject[], base: ProjectItem[]): ProjectItem[] {
  const byId = new Map(base.map((item) => [item.id, item]))
  return items.map((item) => {
    const previous = byId.get(item.id)
    return {
      id: item.id,
      name: item.name,
      description: item.description,
      stack: item.technologies,
      url: item.url ?? undefined,
      repo: item.repository ?? undefined,
      image: previous?.image,
      featured: item.featured,
      type: item.project_type,
      status: item.status,
    }
  })
}

function mapSkills(categories: RawSkillCategory[]): SkillGroup[] {
  return categories.map((category) => ({
    category: category.name,
    items: category.items,
  }))
}

function isFulfilled<T>(result: PromiseSettledResult<T>): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled"
}

/**
 * Descarga los datos del portfolio desde la API y los fusiona con los locales.
 * Si la API no responde (o devuelve error), devuelve los datos locales.
 */
export async function fetchPortfolioData(language: Language): Promise<PortfolioData> {
  const local = getCvData(language)
  const lang = `?lang=${language}`

  const [about, experience, education, projects, skills] = await Promise.allSettled([
    request<RawAbout>(`/api/about${lang}`),
    request<RawExperienceResponse>(`/api/experience${lang}`),
    request<RawEducationResponse>(`/api/education${lang}`),
    request<RawProjectsResponse>(`/api/projects${lang}`),
    request<RawSkillsResponse>(`/api/skills${lang}`),
  ])

  const apiReachable = [about, experience, education, projects, skills].some(
    (result) => result.status === "fulfilled",
  )
  if (!apiReachable) {
    return { cv: local, source: "local", apiReachable: false, error: "La API no responde" }
  }

  const cv: CVData = {
    ...local,
    about: isFulfilled(about) ? mapAbout(about.value, local, language) : local.about,
    experience: isFulfilled(experience) ? mapExperience(experience.value.items, local.experience) : local.experience,
    education: isFulfilled(education) ? mapEducation(education.value.items, local.education) : local.education,
    projects: isFulfilled(projects) ? mapProjects(projects.value.items, local.projects) : local.projects,
    skills: isFulfilled(skills) ? mapSkills(skills.value.categories) : local.skills,
  }

  if (isFulfilled(about)) {
    cv.contact = mapContact(about.value, local.contact)
  }

  return { cv, source: "api", apiReachable: true, error: null }
}

// ---------------------------------------------------------------------------
// Contacto
// ---------------------------------------------------------------------------
export interface ContactPayload {
  name: string
  email: string
  message: string
  /** Honeypot anti-spam: debe ir vacío. */
  website?: string
}

export interface ContactReceipt {
  status: string
  message: string
  reference: string
  received_at: string
}

/** Envía el formulario de contacto a `POST /api/contact`. Lanza si falla. */
export async function sendContact(payload: ContactPayload): Promise<ContactReceipt> {
  const response = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(API_TIMEOUT_MS * 2),
  })

  const data = (await response.json().catch(() => null)) as
    | ContactReceipt
    | { detail?: unknown }
    | null

  if (!response.ok) {
    const detail = data && "detail" in data ? data.detail : null
    throw new Error(typeof detail === "string" ? detail : `No se pudo enviar el mensaje (HTTP ${response.status})`)
  }

  return data as ContactReceipt
}

// ---------------------------------------------------------------------------
// Descarga del CV
// ---------------------------------------------------------------------------
function triggerDownload(href: string, filename: string) {
  if (typeof document === "undefined") return
  const link = document.createElement("a")
  link.href = href
  link.download = filename
  link.rel = "noopener"
  link.click()
}

/**
 * Descarga el CV intentando primero `GET /api/cv`; si el backend está caído o
 * devuelve error, usa el PDF estático como fallback.
 */
export async function downloadCv(
  fallbackPath: string,
  filename = "CV-Daniel-Gonzalez-Pascual.pdf",
): Promise<DataSource> {
  try {
    const response = await fetch(`${API_URL}/api/cv`, {
      signal: AbortSignal.timeout(API_TIMEOUT_MS * 2),
    })
    if (response.ok) {
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      triggerDownload(url, filename)
      setTimeout(() => URL.revokeObjectURL(url), 10000)
      return "api"
    }
  } catch {
    // Fallback silencioso al PDF estático.
  }
  triggerDownload(fallbackPath, filename)
  return "local"
}

// ---------------------------------------------------------------------------
// Endpoints GET para la app tipo Postman
// ---------------------------------------------------------------------------
const GET_ENDPOINTS: Record<string, (language: Language) => string> = {
  "/about": (language) => `/api/about?lang=${language}`,
  "/experience": (language) => `/api/experience?lang=${language}`,
  "/education": (language) => `/api/education?lang=${language}`,
  "/projects": (language) => `/api/projects?lang=${language}`,
  "/skills": (language) => `/api/skills?lang=${language}`,
}

export interface EndpointResult {
  path: string
  status: number
  responseTime: string
  data: unknown
  source: DataSource
}

/**
 * Consulta un endpoint GET de la API para la app tipo Postman. Si no existe en
 * la API o falla, devuelve `fallback` marcado como `local`.
 */
export async function fetchEndpointData(
  endpointPath: string,
  language: Language,
  fallback: unknown,
): Promise<EndpointResult> {
  const builder = GET_ENDPOINTS[endpointPath]
  if (!builder) {
    return { path: endpointPath, status: 200, responseTime: "local", data: fallback, source: "local" }
  }
  const started = typeof performance !== "undefined" ? performance.now() : Date.now()
  try {
    const data = await request<unknown>(builder(language))
    const elapsed = (typeof performance !== "undefined" ? performance.now() : Date.now()) - started
    return {
      path: endpointPath,
      status: 200,
      responseTime: `${Math.round(elapsed)}ms`,
      data,
      source: "api",
    }
  } catch {
    return { path: endpointPath, status: 200, responseTime: "fallback", data: fallback, source: "local" }
  }
}
