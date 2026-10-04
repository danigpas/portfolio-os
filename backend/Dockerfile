# Contexto de build: la RAIZ del repo (ver docker-compose.yml).
# Necesita backend/ y public/cv-daniel-gonzalez-pascual.pdf.

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1

WORKDIR /app

# Dependencias primero (mejor cacheo de capas)
COPY backend/pyproject.toml ./
COPY backend/README.md ./
RUN pip install -e .

# Código de la aplicación
COPY backend/app ./app

# El config.py resuelve el PDF como <raiz>/public/cv-daniel-gonzalez-pascual.pdf
# (BACKEND_DIR=/app -> REPO_ROOT=/ -> /public/...). Debe existir en la imagen.
COPY public/cv-daniel-gonzalez-pascual.pdf /public/cv-daniel-gonzalez-pascual.pdf

# Usuario no root
RUN useradd --create-home deploy && chown -R deploy:deploy /app /public
USER deploy

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD python -c "import urllib.request; urllib.request.urlopen('http://127.0.0.1:8000/api/health', timeout=4)" || exit 1

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
