"""Tests del endpoint ``GET /api/education``."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_education_spanish(client: TestClient) -> None:
    response = client.get("/api/education", params={"lang": "es"})

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 4

    daw = body["items"][0]
    assert daw["id"] == "daw"
    assert daw["status"] == "En curso"
    assert "Desarrollo de Aplicaciones Web" in daw["degree"]


def test_education_english(client: TestClient) -> None:
    response = client.get("/api/education", params={"lang": "en"})

    assert response.status_code == 200
    assert response.json()["items"][0]["status"] == "In progress"
