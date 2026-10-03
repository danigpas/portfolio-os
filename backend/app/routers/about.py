"""Endpoint ``GET /api/about``."""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.core.config import settings
from app.data import cv
from app.schemas import AboutResponse, Lang

router = APIRouter(prefix=settings.api_prefix, tags=["about"])


@router.get("/about", response_model=AboutResponse, summary="Perfil del candidato")
def get_about(
    lang: Lang = Query(default=Lang.es, description="Idioma de la respuesta: es | en"),
) -> AboutResponse:
    """Devuelve el perfil, resumen, estadísticas y enlaces de contacto."""
    return cv.build_about(lang)
