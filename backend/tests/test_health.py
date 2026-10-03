"""Tests del endpoint ``GET /api/health``."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_health_ok(client: TestClient) -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    body = response.json()
    assert body["status"] == "ok"
    assert body["service"] == "Portfolio API"
    assert body["version"] == "0.1.0"
    assert "timestamp" in body


def test_root_endpoint(client: TestClient) -> None:
    response = client.get("/")

    assert response.status_code == 200
    body = response.json()
    assert body["health"] == "/api/health"
    assert body["docs"] == "/docs"
