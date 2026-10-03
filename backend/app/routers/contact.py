"""Endpoint ``POST /api/contact`` con validación estricta y rate limiting."""

from __future__ import annotations

import logging
import uuid
from datetime import UTC, datetime

from fastapi import APIRouter, Request, status

from app.core.config import settings
from app.core.rate_limit import limiter
from app.schemas import ContactAccepted, ContactRequest

router = APIRouter(prefix=settings.api_prefix, tags=["contact"])
logger = logging.getLogger(__name__)

_ACCEPTED_MESSAGE = "Mensaje recibido. Gracias por escribir; te responderé lo antes posible."


@router.post(
    "/contact",
    response_model=ContactAccepted,
    status_code=status.HTTP_202_ACCEPTED,
    summary="Enviar un mensaje de contacto",
)
@limiter.limit(settings.contact_rate_limit)
def send_contact(request: Request, payload: ContactRequest) -> ContactAccepted:
    """Valida el mensaje, lo registra y responde 202 sin envío externo real."""
    reference = uuid.uuid4().hex[:12]
    log_context = {
        "reference": reference,
        "contact_name": payload.name,
        "contact_email": payload.email,
        "client_ip": request.client.host if request.client else None,
    }

    if payload.website:
        # Honeypot: el formulario fue rellenado por un bot. Respondemos igual
        # para no dar pistas, pero no procesamos el mensaje.
        logger.warning("contact_honeypot_triggered", extra=log_context)
    else:
        logger.info("contact_received", extra=log_context)

    return ContactAccepted(
        status="accepted",
        message=_ACCEPTED_MESSAGE,
        reference=reference,
        received_at=datetime.now(UTC),
    )
