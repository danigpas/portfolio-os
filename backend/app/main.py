"""Aplicación FastAPI del portfolio (T1)."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.core.config import settings
from app.core.logging import configure_logging
from app.core.rate_limit import limiter
from app.routers import (
    about,
    contact,
    cv,
    education,
    experience,
    health,
    projects,
    skills,
)


def create_app() -> FastAPI:
    """Crea y configura la aplicación FastAPI."""
    configure_logging(settings.log_level)

    application = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        description=(
            "API del portfolio de Daniel González Pascual. Expone los datos del CV "
            "en español e inglés, el formulario de contacto y la descarga del CV."
        ),
        docs_url="/docs",
        redoc_url="/redoc",
        openapi_url="/openapi.json",
    )

    # Rate limiting (slowapi)
    application.state.limiter = limiter
    application.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # CORS: solo dominios propios, configurables por variable de entorno.
    application.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "OPTIONS"],
        allow_headers=["*"],
    )

    for module in (
        health,
        about,
        experience,
        education,
        projects,
        skills,
        contact,
        cv,
    ):
        application.include_router(module.router)

    @application.get("/", tags=["meta"], summary="Información del servicio")
    def read_root() -> dict[str, str]:
        return {
            "service": settings.app_name,
            "version": settings.app_version,
            "environment": settings.environment,
            "docs": "/docs",
            "health": f"{settings.api_prefix}/health",
        }

    return application


app = create_app()
