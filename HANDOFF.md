# HANDOFF — T1 Backend FastAPI

Worktree: `C:/Users/danig/orca/workspaces/portfolio-os/t1-backend`
Rama actual: `feature/t1-backend-fastapi`
Ticket: DAN-90 (Linear, proyecto PorfoliOS) · Worker task `task_053cd5dd19b8` · Dispatch `ctx_9dd26cecf7e9`

## Objetivo

Construir el backend FastAPI del portfolio en `backend/` según la spec de DAN-90:
exponer los datos del CV como API con `/api/about`, `/api/experience`,
`/api/education`, `/api/projects`, `/api/skills` (ES/EN vía `?lang=`),
`POST /api/contact` (validación Pydantic v2 estricta + rate limit + 202),
`GET /api/cv` (PDF en `Content-Disposition: attachment`) y `GET /api/health`.
Datos centralizados en un único módulo, `pytest` verde, `ruff` limpio y README
del backend. Solo se toca `backend/`; sin PR ni merge por parte del builder.

## Estado actual

- Backend completo creado y validado. Commit: `b2ac926 feat(t1): backend FastAPI con API del portfolio`.
- Resultados de validación (ejecutados con Docker `python:3.12`, no hay Python en el host):
  - `pytest -q` → **30 passed**.
  - `ruff check .` → limpio. `ruff format --check .` → 30 ficheros OK.
  - Smoke `uvicorn app:app` → arranca y `GET /api/health` → 200.
- La rama fue **pusheada a origin** y **ya está integrada en `origin/develop`**
  (`b2ac926` es ancestro de `origin/develop`; `backend/` aparece en develop).
- Working tree **limpio**: no hay cambios sin commitear en esta rama.
- `worker_done` enviado al coordinador con `--outcome succeeded`.
- El ticket DAN-90 NO se cambió de estado (lo mueve el coordinador); se
  documentó progreso con 2 comentarios (plan inicial + cierre).

## Decisiones tomadas (y por qué)

- **Rama base `origin/develop`** (así lo pedía la tarea). Al empezar, develop no
  traía el PDF del CV ni los docs `harness/`; se resolvió como se explica en
  Trampas.
- **Datos en `backend/app/data/cv.py` como única fuente de verdad**, con textos
  localizados `{"es": ..., "en": ...}` y helpers `build_*` que devuelven modelos
  Pydantic. Los routers no llevan datos hardcodeados.
- **`app/__init__.py` re-exporta `app`** de `app.main` para poder arrancar con
  `uvicorn app:app` (acceptance del ticket).
- **slowapi** para rate limit (opción sugerida por la spec) en lugar de un
  limiter casero: estándar y probado. Límite configurable por env.
- **`pytest` y `httpx` en dependencias core** (no solo extras): `TestClient` de
  FastAPI necesita `httpx`, y así el comando de validación del entorno
  (`pip install -e . && pytest -q`) funciona sin extras. `ruff` queda en `dev`.
- **`/api/cv` con ruta configurable** (`CV_PDF_PATH`), por defecto
  `<repo>/public/cv-daniel-gonzalez-pascual.pdf`, y **404 si el archivo no
  existe**. Así el endpoint respeta la convención de ownership (no añado el PDF
  fuera de `backend/`) y los tests usan un fixture propio.
- **Contact: honeypot `website`** + logging estructurado JSON (formatters
  propios, sin dependencias) y `202` con referencia. No hay envío externo real.

## Ficheros clave

```
backend/
├── pyproject.toml            # deps, build (setuptools), pytest y ruff config
├── README.md                 # venv, env vars, cómo testear (incl. ruta Docker)
├── .env.example              # CORS_ORIGINS, CONTACT_RATE_LIMIT, CV_PDF_PATH...
├── .gitignore                # re-incluye .env.example, ignora caches/egg-info
├── app/
│   ├── __init__.py           # `from app.main import app` -> uvicorn app:app
│   ├── main.py               # create_app(): CORS, slowapi handler, routers
│   ├── core/config.py        # Settings (pydantic-settings) + rutas BACKEND/REPO
│   ├── core/logging.py       # JsonFormatter + configure_logging
│   ├── core/rate_limit.py    # Limiter slowapi compartido
│   ├── data/cv.py            # ÚNICA fuente de datos CV (ES/EN) + build_*()
│   ├── schemas/__init__.py   # Modelos Pydantic v2 (Lang=StrEnum, Contact...)
│   └── routers/              # health, about, experience, education,
│                             # projects, skills, contact, cv
└── tests/                    # conftest + 8 ficheros de test + fixtures/sample.pdf
```

## Cambios sin commitear

Ninguno. `git status` está limpio en `feature/t1-backend-fastapi`.

## Comandos de arranque/test

Windows con git-bash y **sin Python en el host** → validar con Docker
(Docker Desktop corriendo). `MSYS_NO_PATHCONV=1` es obligatorio o git-bash
corrompe `/app` (lo convierte en `C:/Program Files/Git/app`).

```bash
# Tests
cd C:/Users/danig/orca/workspaces/portfolio-os/t1-backend
MSYS_NO_PATHCONV=1 docker run --rm \
  -v "C:/Users/danig/orca/workspaces/portfolio-os/t1-backend/backend:/app" \
  -w /app python:3.12 sh -c "pip install -q -e . && pytest -q"

# Lint + formato
MSYS_NO_PATHCONV=1 docker run --rm \
  -v "C:/Users/danig/orca/workspaces/portfolio-os/t1-backend/backend:/app" \
  -w /app python:3.12 sh -c "pip install -q -e '.[dev]' && ruff check . && ruff format --check ."
```

Con Python local (venv), desde `backend/`:

```bash
python -m venv .venv && source .venv/Scripts/activate   # git-bash
pip install -e ".[dev]"
pytest -q
uvicorn app:app --reload --host 0.0.0.0 --port 8000      # docs en /docs
```

## Trampas y contexto no obvio

- **Docs `harness/` no estaban en develop**: la tarea decía que `builder-guide.md`
  y `plan.md` estaban en develop, pero solo existen en `chore/harness-docs`
  (leídos con `git show origin/chore/harness-docs:harness/...`).
- **PDF del CV**: al empezar, `public/cv-daniel-gonzalez-pascual.pdf` NO estaba en
  develop (solo en `feature/t0-cv-experiencia-fixes`). Por eso los tests de `/api/cv`
  usan `tests/fixtures/sample.pdf`. **Hoy sí está en develop** (y hay un PDF nuevo en
  `cv-latex/`), así que `/api/cv` sirve el real tras un `git pull` de develop.
- **Root `.gitignore` ignora `.env*`**, lo que exclude también `.env.example`. Se
  añadió `backend/.gitignore` con `!.env.example` para versionarlo (hubo que
  verificar que se añadiera).
- **`pytest`/Docker escriben en el worktree montado** (`__pycache__`, `.egg-info`,
  `.pytest_cache`, `.ruff_cache`); están ignorados, pero conviene limpiarlos antes
  de `git add backend/`.
- **Logging `extra` no puede usar claves reservadas** (`name`, `message`, `asctime`,
  etc.): usar `name` como clave lanza `KeyError: Attempt to overwrite 'name'`.
  Se usan `contact_name`, `contact_email`, `client_ip`.
- **Rate limit se evalúa al importar** (`@limiter.limit(settings.contact_rate_limit)`);
  los tests llaman `limiter.reset()` en un fixture `autouse` para aislar el estado,
  porque TestClient siempre usa la misma IP (`testclient`).
- **Warning ruidoso pero inofensivo**: `StarletteDeprecationWarning: ... httpx2` al
  usar `TestClient`. No afecta a los resultados.
- Un `?lang` no soportado devuelve **422** (FastAPI valida el `StrEnum`).

## Próximos 3 pasos

1. **Review del ticket**: confirmar en el PR que `/api/cv` sirve el PDF real ahora
   que `public/cv-daniel-gonzalez-pascual.pdf` está en develop (probar con
   `CV_PDF_PATH` vacío). Mover/validar estado DAN-90 (lo hace el coordinador).
2. **Integración (T5)**: consumir estos endpoints desde el frontend con
   `NEXT_PUBLIC_API_URL`, con fallback a datos locales si el backend no responde,
   y usar `GET /api/cv` en el botón "Descargar CV".
3. **Endurecido antes de producción**: rate limit con backend compartido (Redis)
   en multi-réplica, y decisión sobre un email real de contacto (hoy
   `daniel.gonzalez.pascual@email.com` en `app/data/cv.py`, valor heredado del
   frontend, no un secreto).
