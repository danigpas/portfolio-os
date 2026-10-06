import { NextResponse, type NextRequest } from "next/server"

/**
 * Enrutado por dominio:
 * - cv.danigpascual.dev  → /cv (página CV en línea, sin escritorio)
 * - danigpascual.dev     → / (boot directo al escritorio Omarchy)
 */
export function middleware(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase()
  if (host.startsWith("cv.") || host.startsWith("www.cv.")) {
    return NextResponse.rewrite(new URL("/cv", request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/|api/|favicon.ico|cv-daniel-gonzalez-pascual.pdf).*)"],
}
