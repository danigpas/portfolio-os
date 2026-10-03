"""Tests del endpoint ``GET /api/about``."""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient


def test_about_spanish(client: TestClient) -> None:
    response = client.get("/api/about", params={"lang": "es"})

    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "Daniel González Pascual"
    assert body["role"] == "Desarrollador Backend Python"
    assert "Málaga" in body["location"]
    assert body["years_of_experience"] >= 3
    assert len(body["stats"]) == 3
    assert len(body["links"]) == 3


def test_about_english(client: TestClient) -> None:
    response = client.get("/api/about", params={"lang": "en"})

    assert response.status_code == 200
    body = response.json()
    assert body["role"] == "Backend Python Developer"
    assert "Spain" in body["location"]


def test_about_default_is_spanish(client: TestClient) -> None:
    assert client.get("/api/about").json()["role"] == "Desarrollador Backend Python"


def test_about_rejects_unknown_language(client: TestClient) -> None:
    response = client.get("/api/about", params={"lang": "fr"})

    assert response.status_code == 422


@pytest.mark.parametrize("path", ["/api/about", "/api/experience", "/api/education"])
def test_endpoints_share_language_contract(client: TestClient, path: str) -> None:
    assert client.get(path, params={"lang": "es"}).status_code == 200
    assert client.get(path, params={"lang": "en"}).status_code == 200
