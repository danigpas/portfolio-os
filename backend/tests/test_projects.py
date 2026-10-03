"""Tests del endpoint ``GET /api/projects``."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_projects_spanish(client: TestClient) -> None:
    response = client.get("/api/projects", params={"lang": "es"})

    assert response.status_code == 200
    body = response.json()
    assert body["total"] == 3

    blog = body["items"][0]
    assert blog["name"] == "El Nieto de Pascual"
    assert blog["url"] == "https://elnietodepascual.com"
    assert blog["featured"] is True


def test_projects_english(client: TestClient) -> None:
    response = client.get("/api/projects", params={"lang": "en"})

    assert response.status_code == 200
    assert response.json()["items"][0]["status"] == "Active"
