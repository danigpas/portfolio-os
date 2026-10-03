"""Endpoint ``GET /api/cv`` que sirve el PDF del currículum."""

from __future__ import annotations

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import FileResponse

from app.core.config import settings

router = APIRouter(prefix=settings.api_prefix, tags=["cv"])


@router.get(
    "/cv",
    summary="Descargar el CV en PDF",
    response_class=FileResponse,
    responses={
        200: {"content": {"application/pdf": {}}, "description": "PDF del CV"},
        404: {"description": "El PDF no está disponible"},
    },
)
def download_cv() -> FileResponse:
    """Devuelve el PDF del CV como descarga adjunta."""
    pdf_path = settings.cv_pdf
    if not pdf_path.is_file():
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="El CV no está disponible en este momento.",
        )
    return FileResponse(
        path=pdf_path,
        media_type="application/pdf",
        filename=settings.cv_filename,
    )
