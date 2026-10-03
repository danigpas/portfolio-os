"""Tests del endpoint ``GET /api/experience``."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_experience_contains_real_timeline(client: TestClient) -> None:
    response = client.get("/api/experience", params={"lang": "es"})

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 3

    items = body["items"]
    current = items[0]
    assert current["company"] == "Inforyde"
    assert current["current"] is True
    assert current["end"] is None
    assert current["start"] == "2026-03"
    assert "Madrid" in current["location"]

    disofic = next(item for item in items if item["id"] == "disofic-backend")
    assert disofic["start"] == "2023-09"
    assert disofic["end"] == "2026-03"
    assert disofic["current"] is False
    assert "FastAPI" in disofic["technologies"]
    assert disofic["achievements"]


def test_experience_english(client: TestClient) -> None:
    response = client.get("/api/experience", params={"lang": "en"})

    assert response.status_code == 200
    current = response.json()["items"][0]
    assert current["role"] == "Semi-Senior Python Developer"
    assert current["location"] == "Madrid, Spain"


def test_experience_invalid_language(client: TestClient) -> None:
    assert client.get("/api/experience", params={"lang": "de"}).status_code == 422
