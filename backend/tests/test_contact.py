"""Tests del endpoint ``POST /api/contact``."""

from __future__ import annotations

from fastapi.testclient import TestClient

from tests.conftest import VALID_CONTACT


def test_contact_accepts_valid_payload(client: TestClient) -> None:
    response = client.post("/api/contact", json=VALID_CONTACT)

    assert response.status_code == 202
    body = response.json()
    assert body["status"] == "accepted"
    assert body["reference"]
    assert body["received_at"]


def test_contact_rejects_invalid_email(client: TestClient) -> None:
    payload = {**VALID_CONTACT, "email": "no-es-un-email"}
    assert client.post("/api/contact", json=payload).status_code == 422


def test_contact_rejects_short_message(client: TestClient) -> None:
    payload = {**VALID_CONTACT, "message": "corto"}
    assert client.post("/api/contact", json=payload).status_code == 422


def test_contact_rejects_blank_name(client: TestClient) -> None:
    payload = {**VALID_CONTACT, "name": "   "}
    assert client.post("/api/contact", json=payload).status_code == 422


def test_contact_rejects_missing_fields(client: TestClient) -> None:
    assert client.post("/api/contact", json={"name": "Ana"}).status_code == 422


def test_contact_honeypot_still_accepts(client: TestClient) -> None:
    payload = {**VALID_CONTACT, "website": "https://spam.example.com"}
    assert client.post("/api/contact", json=payload).status_code == 202


def test_contact_rate_limit(client: TestClient) -> None:
    statuses = [client.post("/api/contact", json=VALID_CONTACT).status_code for _ in range(6)]

    assert statuses[:5] == [202] * 5
    assert statuses[5] == 429
