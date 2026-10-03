"""Tests del endpoint ``GET /api/cv``."""

from __future__ import annotations

from pathlib import Path

from fastapi.testclient import TestClient

from app.core.config import settings
from tests.conftest import SAMPLE_PDF


def test_download_cv_serves_pdf_attachment(client: TestClient, monkeypatch) -> None:
    monkeypatch.setattr(settings, "cv_pdf_path", str(SAMPLE_PDF))

    response = client.get("/api/cv")

    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert response.headers["content-disposition"].startswith("attachment")
    assert response.content == SAMPLE_PDF.read_bytes()


def test_download_cv_returns_404_when_missing(
    client: TestClient, monkeypatch, tmp_path: Path
) -> None:
    monkeypatch.setattr(settings, "cv_pdf_path", str(tmp_path / "no-existe.pdf"))

    response = client.get("/api/cv")

    assert response.status_code == 404
