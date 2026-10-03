"""Endpoint ``GET /api/projects``."""

from __future__ import annotations

from fastapi import APIRouter, Query

from app.core.config import settings
from app.data import cv
from app.schemas import Lang, ProjectsResponse

router = APIRouter(prefix=settings.api_prefix, tags=["projects"])


@router.get("/projects", response_model=ProjectsResponse, summary="Proyectos destacados")
def get_projects(
    lang: Lang = Query(default=Lang.es, description="Idioma de la respuesta: es | en"),
) -> ProjectsResponse:
    """Devuelve los proyectos del portfolio con su stack tecnológico."""
    return cv.build_projects(lang)
