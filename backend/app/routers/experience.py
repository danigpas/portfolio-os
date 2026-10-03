"""Endpoint ``GET /api/experience``."""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.core.config import settings
from app.data import cv
from app.schemas import ExperienceResponse, Lang

router = APIRouter(prefix=settings.api_prefix, tags=["experience"])


@router.get(
    "/experience",
    response_model=ExperienceResponse,
    summary="Experiencia profesional",
)
def get_experience(
    lang: Lang = Query(default=Lang.es, description="Idioma de la respuesta: es | en"),
) -> ExperienceResponse:
    """Devuelve la trayectoria profesional, de más reciente a más antigua."""
    return cv.build_experience(lang)
