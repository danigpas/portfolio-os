"""Endpoint de salud del servicio."""

from __future__ import annotations

from datetime import UTC, datetime

from fastapi import APIRouter

from app.core.config import settings
from app.schemas import HealthResponse

router = APIRouter(prefix=settings.api_prefix, tags=["health"])


@router.get("/health", response_model=HealthResponse, summary="Estado del servicio")
def get_health() -> HealthResponse:
    """Comprueba que la API está viva y devuelve versión y timestamp."""
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        version=settings.app_version,
        timestamp=datetime.now(UTC),
    )
