"""Tests del endpoint ``GET /api/skills``."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_skills_spanish(client: TestClient) -> None:
    response = client.get("/api/skills", params={"lang": "es"})

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == len(body["categories"]) == 4

    backend = body["categories"][0]
    assert backend["name"] == "Backend"
    assert "Python" in backend["items"]
    assert "FastAPI" in backend["items"]


def test_skills_english(client: TestClient) -> None:
    response = client.get("/api/skills", params={"lang": "en"})

    assert response.status_code == 200
    categories = response.json()["categories"]
    assert categories[0]["name"] == "Backend"
    assert categories[1]["name"] == "Databases"
