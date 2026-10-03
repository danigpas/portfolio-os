# 🚀 Daniel's Interactive Portfolio OS

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)

Portfolio personal con estética **Omarchy** (moderno + cyberpunk + retro): una
landing SSR legible por buscadores y un escritorio navegable tipo sistema
operativo (ventanas reales, waybar, launcher Ctrl+K y terminal), respaldado por
una **API FastAPI** que es la fuente de datos del CV.

## 🏗️ Arquitectura

```
┌──────────────────────────────────────────────────────────────────────┐
│                          Next.js 15 (App Router)                     │
│                                                                      │
│   /  ──► LandingPage (SSR, SEO)        SystemEntry (cliente)         │
│            datos de lib/cv-data.ts        │                          │
│                                         ├── BootAnimation (GSAP ~3s) │
│                                         └── DesktopSession           │
│                                             ├── Waybar (workspaces,  │
│                                             │    red + api status)   │
│                                             ├── Window manager       │
│                                             ├── PostmanApp ──┐       │
│                                             ├── Terminal     │       │
│                                             └── Rofi Ctrl+K  │       │
│                                                              │       │
│   lib/api.ts  ◄── fetch + timeout 3s + fallback a cv-data ───┘       │
└──────────────────────────────┬───────────────────────────────────────┘
                               │ HTTP (NEXT_PUBLIC_API_URL)
                               ▼
┌──────────────────────────────────────────────────────────────────────┐
│                        FastAPI (backend/)                            │
│   /api/health  /api/about  /api/experience  /api/education           │
│   /api/projects  /api/skills  /api/contact  /api/cv                  │
│   Pydantic v2 · CORS · rate-limit · logging JSON                     │
└──────────────────────────────────────────────────────────────────────┘
```

**Offline-first:** si la API no responde en 3s, el frontend usa
`lib/cv-data.ts` (datos locales) y lo indica en la waybar (`api:down`) y en la
app Postman (`LOCAL`). La web nunca se queda en blanco.

## ✨ Características

- **🖥️ Escritorio Omarchy:** waybar con workspaces 1-5 mapeados a secciones,
  ventanas arrastrables/redimensionables, Alt-Tab y estados de energía.
- **👨‍💻 App tipo Postman:** consume la API FastAPI real, con skeletons estilo
  Omarchy, estados de error y badge `API`/`LOCAL` según el origen del dato.
- **⌨️ Terminal y rofi (Ctrl+K):** navegación real por secciones, `cv --download`,
  cambio de tema y `open <app>`.
- **🎨 4 temas:** Tokyo Night (por defecto), Gruvbox, Catppuccin Mocha y Matrix.
- **🚀 Boot estilo TTY (~3s):** líneas tipo systemd con GSAP y skip con ESC/click.
- **🌐 Multi-idioma:** Español e Inglés (la API acepta `?lang=es|en`).
- **📱 Landing SSR + fallback móvil:** contenido indexable y versión lineal en móvil.

## 🛠️ Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TypeScript estricto, Tailwind
  v4, GSAP, Lucide.
- **Backend:** Python 3.11+, FastAPI, Pydantic v2, Uvicorn, slowapi.

## 🚀 Cómo Empezar

### Prerrequisitos

- [Node.js](https://nodejs.org/) 18+ y npm.
- [Python](https://www.python.org/) 3.11+ (o Docker, ver más abajo).

### 1. Frontend

```bash
npm install --legacy-peer-deps
npm run dev
```

Abre [`http://localhost:3000`](http://localhost:3000). Para que el escritorio
consuma la API real, define `NEXT_PUBLIC_API_URL` (por defecto
`http://localhost:8000`):

```bash
cp .env.example .env.local
```

### 2. Backend (API FastAPI)

Desde la raíz del repositorio:

```bash
cd backend

# Entorno virtual (obligatorio en Debian/Ubuntu modernos por PEP 668)
python -m venv .venv

# Activarlo
# Linux / macOS:        source .venv/bin/activate
# Windows (git-bash):   source .venv/Scripts/activate
# Windows (PowerShell): .venv\Scripts\Activate.ps1

pip install -e ".[dev]"

# Arrancar la API
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Comprueba que responde:

```bash
curl http://localhost:8000/api/health
```

Documentación interactiva en [`http://localhost:8000/docs`](http://localhost:8000/docs).
Más detalles en [`backend/README.md`](backend/README.md).

### Backend con Docker (sin Python en el host)

```bash
docker run --rm -p 8000:8000 \
  -v "$(pwd):/repo" -w /repo/backend python:3.12 \
  sh -c "pip install -q -e . && uvicorn app.main:app --host 0.0.0.0 --port 8000"
```

> Se monta la raíz del repositorio en `/repo` para que `GET /api/cv` encuentre
> el PDF en `public/` (la ruta por defecto es relativa a la raíz del repo).

## 🔐 Variables de entorno

| Archivo             | Variable               | Por defecto        | Descripción                                  |
| :------------------ | :--------------------- | :----------------- | :------------------------------------------- |
| `.env.local`        | `NEXT_PUBLIC_API_URL`  | `http://localhost:8000` | URL base de la API que consume el frontend. |
| `backend/.env`      | `CORS_ORIGINS`         | dominios propios + `http://localhost:3000` | Orígenes permitidos (separados por comas). |
| `backend/.env`      | `CONTACT_RATE_LIMIT`   | `5/minute`         | Límite de `POST /api/contact`.               |
| `backend/.env`      | `CV_PDF_PATH`          | `public/cv-daniel-gonzalez-pascual.pdf` | Ruta del PDF servido por `/api/cv`. |

Copia los ejemplos: `cp .env.example .env.local` y
`cp backend/.env.example backend/.env`.

## 🕹️ Uso

### Comandos de la Terminal

| Comando | Descripción |
| :--- | :--- |
| `help` | Muestra una lista de todos los comandos disponibles. |
| `about` / `experience` / `projects` / `education` / `contact` | Abre la sección en la app Postman. |
| `skills` | Enumera mis habilidades técnicas. |
| `cv --download` | Descarga el CV (`GET /api/cv`, con fallback al PDF estático). |
| `theme` / `theme <nombre>` | Lista o cambia el tema del sistema. |
| `open <app>` | Abre una app (`terminal`, `postman`, `about`, ...). |
| `clear` / `whoami` | Limpia la terminal / muestra el usuario. |
| `reboot` / `suspend` / `shutdown` | Control de energía del escritorio. |

### Verificación de la integración

Smoke test automático (backend levantado):

```bash
npm run smoke
```

Comprueba `/api/health`, los endpoints de datos en ES/EN, `POST /api/contact`
(202) y `GET /api/cv` (PDF). Salida esperada: `✅ Todo OK`.

Verificación manual:

```bash
# Con el backend levantado, la app Postman marca "API" y los datos vienen de FastAPI.
curl http://localhost:8000/api/about?lang=es
curl http://localhost:8000/api/health

# Con el backend parado, la web sigue funcionando con datos locales, la app
# Postman marca "LOCAL" y la waybar muestra "api:down".
```

**Flujo E2E manual (boot → sección → contacto):**

1. `npm run dev` con el backend levantado.
2. Abre `http://localhost:3000`, pulsa “Bootear el sistema” (o ESC para saltar el boot).
3. En la waybar debe aparecer `api:up`; abre la app Postman y selecciona
   `GET /about`: el badge debe indicar `API` y el JSON venir de FastAPI.
4. Abre `POST /contact`, rellena nombre/email/mensaje y envía: aparece el
   feedback de éxito con la referencia `202` del backend.
5. Con el backend parado, repite: la app muestra `LOCAL` + aviso y el contacto
   ofrece el email directo como fallback.

## 📦 Despliegue

El frontend está pensado para [Vercel](https://vercel.com/); define
`NEXT_PUBLIC_API_URL` apuntando al backend desplegado. El backend puede
desplegarse en cualquier plataforma que ejecute Uvicorn/ASGI (Fly.io, Railway,
Render, un VPS...). Configura `CORS_ORIGINS` con el dominio del frontend.

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Abre un *issue* para discutir ideas o envía
un *pull request*.

## 📄 Licencia

Distribuido bajo la Licencia MIT.

## 📬 Contacto

Daniel González Pascual — [LinkedIn](https://www.linkedin.com/in/daniel-gonzalez-pascual/) ·
[daniGpascual@protonmail.com](mailto:daniGpascual@protonmail.com)
