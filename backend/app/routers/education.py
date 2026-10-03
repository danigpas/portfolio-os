"""Endpoint ``GET /api/education``."""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.core.config import settings
from app.data import cv
from app.schemas import EducationResponse, Lang

router = APIRouter(prefix=settings.api_prefix, tags=["education"])


@router.get("/education", response_model=EducationResponse, summary="Formación académica")
def get_education(
    lang: Lang = Query(default=Lang.es, description="Idioma de la respuesta: es | en"),
) -> EducationResponse:
    """Devuelve la formación académica y cursos del candidato."""
    return cv.build_education(lang)
