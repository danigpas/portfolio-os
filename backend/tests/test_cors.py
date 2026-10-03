"""Tests de CORS: solo los dominios propios están permitidos."""

from __future__ import annotations

from fastapi.testclient import TestClient


def test_cors_allows_own_domain(client: TestClient) -> None:
    response = client.get(
        "/api/health",
        headers={"Origin": "https://danigpascual.dev"},
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "https://danigpascual.dev"


def test_cors_allows_localhost_dev(client: TestClient) -> None:
    response = client.get(
        "/api/health",
        headers={"Origin": "http://localhost:3000"},
    )

    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"


def test_cors_blocks_unknown_origin(client: TestClient) -> None:
    response = client.get(
        "/api/health",
        headers={"Origin": "https://evil.example.com"},
    )

    assert "access-control-allow-origin" not in response.headers
