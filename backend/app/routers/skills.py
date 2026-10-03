"""Endpoint ``GET /api/skills``."""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.core.config import settings
from app.data import cv
from app.schemas import Lang, SkillsResponse

router = APIRouter(prefix=settings.api_prefix, tags=["skills"])


@router.get("/skills", response_model=SkillsResponse, summary="Tecnologías y habilidades")
def get_skills(
    lang: Lang = Query(default=Lang.es, description="Idioma de la respuesta: es | en"),
) -> SkillsResponse:
    """Devuelve las habilidades agrupadas por categoría."""
    return cv.build_skills(lang)
