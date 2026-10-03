# Portfolio API — Backend FastAPI

API REST del portfolio de **Daniel González Pascual**. Materializa el concepto
"Portfolio API": expone los datos del CV en español e inglés, gestiona el
formulario de contacto y sirve el PDF del currículum.

- **Stack:** Python 3.11+, FastAPI, Pydantic v2, Uvicorn, slowapi.
- **Datos:** centralizados en `app/data/cv.py` (única fuente de verdad, ES/EN).
- **Tests:** `pytest` para todos los endpoints.
- **Calidad:** `ruff` configurado en `pyproject.toml`.

> Este directorio es autónomo. No modifica `app/`, `components/` ni el resto del
> frontend de Next.js.

## Endpoints

| Método | Ruta              | Descripción                                                        |
| ------ | ----------------- | ------------------------------------------------------------------ |
| GET    | `/api/health`     | Estado del servicio (versión + timestamp).                         |
| GET    | `/api/about`      | Perfil, resumen, estadísticas y enlaces.                           |
| GET    | `/api/experience` | Experiencia profesional ordenada de más reciente a más antigua.    |
| GET    | `/api/education`  | Formación académica y cursos.                                      |
| GET    | `/api/projects`   | Proyectos destacados y su stack.                                   |
| GET    | `/api/skills`     | Habilidades agrupadas por categoría.                               |
| POST   | `/api/contact`    | Formulario de contacto validado + rate limit. Responde `202`.      |
| GET    | `/api/cv`         | Descarga el CV en PDF (`Content-Disposition: attachment`).         |

Todos los endpoints `GET` de datos aceptan el query param `?lang=es|en`
(por defecto `es`). Un idioma no soportado devuelve `422`.

Documentación interactiva: `/docs` (Swagger UI) y `/redoc`.

## Requisitos

- Python 3.11 o superior.
- (Opcional) Docker, si no quieres instalar Python en el host.

## Puesta en marcha con venv

Desde el directorio `backend/`:

```bash
# 1. Crear el entorno virtual
python -m venv .venv

# 2. Activarlo
# Windows (PowerShell):  .venv\Scripts\Activate.ps1
# Windows (git-bash):    source .venv/Scripts/activate
# Linux / macOS:         source .venv/bin/activate

# 3. Instalar dependencias (incluye herramientas de desarrollo)
pip install -e ".[dev]"
```

## Ejecutar el servidor

```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Comprueba que arranca:

```bash
curl http://localhost:8000/api/health
```

## Variables de entorno

Son todas opcionales; los valores por defecto están en `app/core/config.py`.
Copia `.env.example` a `.env` para sobrescribirlas.

| Variable              | Por defecto                                                                 | Descripción                                                       |
| --------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `ENVIRONMENT`         | `development`                                                               | Entorno de ejecución.                                             |
| `LOG_LEVEL`           | `INFO`                                                                      | Nivel de logging (salida JSON).                                   |
| `CORS_ORIGINS`        | `https://danigpascual.dev,https://www.danigpascual.dev,http://localhost:3000` | Orígenes permitidos, separados por comas.                         |
| `CONTACT_RATE_LIMIT`  | `5/minute`                                                                  | Límite de slowapi para `POST /api/contact`.                       |
| `CV_PDF_PATH`         | `<repo>/public/cv-daniel-gonzalez-pascual.pdf`                              | Ruta al PDF. Absoluta o relativa a `backend/`.                    |

No hay secretos en el código: cualquier credencial futura debe ir por entorno.

## Tests

```bash
pytest
```

Los tests cubren todos los endpoints, la validación estricta de contacto
(incluido el `422`), el rate limit (`429`), CORS y la descarga del CV. Para el
PDF se usa el fixture `tests/fixtures/sample.pdf`; si no se define
`CV_PDF_PATH`, `/api/cv` sirve el PDF real del repositorio y devuelve `404`
cuando el archivo no existe.

### Tests con Docker (sin Python en el host)

```bash
docker run --rm -v "/ruta/al/backend:/app" -w /app python:3.12 \
  sh -c "pip install -q -e . && pytest -q"
```

## Lint y formato

```bash
ruff check .
ruff format --check .
```

## Estructura

```
backend/
├── app/
│   ├── main.py              # create_app() + instancia ASGI `app`
│   ├── core/
│   │   ├── config.py        # Settings (pydantic-settings)
│   │   ├── logging.py       # logging estructurado JSON
│   │   └── rate_limit.py    # Limiter de slowapi
│   ├── data/
│   │   └── cv.py            # ÚNICA fuente de datos del CV (ES/EN)
│   ├── routers/             # about, experience, education, projects, skills,
│   │   ...                  # contact, cv, health
│   └── schemas/             # modelos Pydantic v2
├── tests/                   # pytest (todos los endpoints)
├── pyproject.toml
└── .env.example
```

## Notas

- El rate limit se aplica por IP y es en memoria; para producción con varias
  réplicas conviene usar un backend compartido (Redis) en slowapi.
- `POST /api/contact` no envía correos: registra el mensaje con logging
  estructurado y responde `202 Accepted` con una referencia.
