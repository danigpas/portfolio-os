
import { NextRequest, NextResponse } from 'next/server';

// Expresión regular para detectar dispositivos móviles
const MOBILE_REGEX = /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i;

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get('user-agent') || '';

  // Comprueba si la URL ya es para un recurso estático de la versión móvil para evitar bucles
  if (request.nextUrl.pathname.startsWith('/mobile')) {
    return NextResponse.next();
  }

  // Si el User-Agent es de un móvil, muestra la versión móvil
  if (MOBILE_REGEX.test(userAgent)) {
    // Reescribe la URL para servir el index.html de la carpeta /public/mobile
    // El usuario seguirá viendo la URL original (ej: 'yourdomain.com/') en su navegador
    return NextResponse.rewrite(new URL('/mobile/index.html', request.url));
  }

  // Si no es un móvil, continúa con la web de escritorio normal
  return NextResponse.next();
}

// Configuración para que el middleware solo se ejecute en las rutas principales
// y no en las de la API, _next/static, _next/image, favicon.ico, etc.
export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|sw.js).*)',
  ],
};
