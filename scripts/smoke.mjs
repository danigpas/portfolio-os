#!/usr/bin/env node
/**
 * Smoke test de integración frontend↔backend (T5).
 *
 * Comprueba que la API FastAPI está viva y que responde con la forma esperada
 * en todos los endpoints que consume el escritorio. No necesita dependencias:
 * usa `fetch` nativo (Node 18+).
 *
 * Uso:
 *   npm run smoke
 *   API_URL=http://localhost:8000 node scripts/smoke.mjs
 *
 * Si el backend no está levantado, el script falla con un mensaje claro: es la
 * señal de que el frontend estaría degradando a los datos locales.
 */

const API_URL = (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(
  /\/+$/,
  "",
)

let failures = 0

function check(condition, label, extra = "") {
  const status = condition ? "PASS" : "FAIL"
  if (!condition) failures += 1
  console.log(`[${status}] ${label}${extra ? ` — ${extra}` : ""}`)
}

async function getJson(path) {
  const response = await fetch(`${API_URL}${path}`, { signal: AbortSignal.timeout(5000) })
  const body = await response.json().catch(() => null)
  return { response, body }
}

async function main() {
  console.log(`Smoke test contra ${API_URL}\n`)

  // 1. Health
  try {
    const { response, body } = await getJson("/api/health")
    check(response.ok && body?.status === "ok", "GET /api/health", `${response.status}`)
  } catch (cause) {
    check(false, "GET /api/health", `backend caído: ${cause.message}`)
    console.log("\nEl backend no responde; levanta `uvicorn app.main:app` en backend/ y reintenta.")
    process.exit(1)
  }

  // 2. Endpoints de datos (ES + EN)
  for (const language of ["es", "en"]) {
    const about = await getJson(`/api/about?lang=${language}`)
    check(about.response.ok && typeof about.body?.name === "string", `GET /api/about?lang=${language}`)

    const experience = await getJson(`/api/experience?lang=${language}`)
    check(
      experience.response.ok && Array.isArray(experience.body?.items) && experience.body.items.length > 0,
      `GET /api/experience?lang=${language}`,
    )

    const education = await getJson(`/api/education?lang=${language}`)
    check(education.response.ok && Array.isArray(education.body?.items), `GET /api/education?lang=${language}`)

    const projects = await getJson(`/api/projects?lang=${language}`)
    check(projects.response.ok && Array.isArray(projects.body?.items), `GET /api/projects?lang=${language}`)

    const skills = await getJson(`/api/skills?lang=${language}`)
    check(skills.response.ok && Array.isArray(skills.body?.categories), `GET /api/skills?lang=${language}`)
  }

  // 3. Contacto real
  const contact = await fetch(`${API_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Smoke Test",
      email: "smoke@example.com",
      message: "Mensaje automático del smoke test de integración T5. Ignorar.",
    }),
    signal: AbortSignal.timeout(5000),
  })
  const contactBody = await contact.json().catch(() => null)
  check(contact.status === 202 && Boolean(contactBody?.reference), "POST /api/contact", `${contact.status}`)

  // 4. Descarga de CV
  const cv = await fetch(`${API_URL}/api/cv`, { signal: AbortSignal.timeout(10000) })
  const contentType = cv.headers.get("content-type") ?? ""
  const pdf = new Uint8Array(await cv.arrayBuffer()).slice(0, 4)
  check(
    cv.ok && contentType.includes("application/pdf") && String.fromCharCode(...pdf) === "%PDF",
    "GET /api/cv",
    `${cv.status} ${contentType}`,
  )

  console.log(`\n${failures === 0 ? "✅ Todo OK" : `❌ ${failures} comprobación(es) fallida(s)`}`)
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((cause) => {
  console.error("Smoke test abortado:", cause)
  process.exit(1)
})
