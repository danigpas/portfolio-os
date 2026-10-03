"""Fixtures compartidas de la suite de tests."""

from __future__ import annotations

from collections.abc import Iterator
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.core.rate_limit import limiter
from app.main import app

FIXTURES_DIR = Path(__file__).parent / "fixtures"
SAMPLE_PDF = FIXTURES_DIR / "sample.pdf"

VALID_CONTACT: dict[str, str] = {
    "name": "Ana García",
    "email": "ana@example.com",
    "message": "Hola, me gustaría hablar sobre un proyecto de backend.",
}


@pytest.fixture()
def client() -> Iterator[TestClient]:
    """Cliente HTTP de test contra la app real."""
    with TestClient(app) as test_client:
        yield test_client


@pytest.fixture(autouse=True)
def _reset_rate_limiter() -> Iterator[None]:
    """Aísla el estado del rate limiter entre tests."""
    limiter.reset()
    yield
    limiter.reset()
