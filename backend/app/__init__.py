"""Paquete de la API FastAPI del portfolio.

Expone la instancia ASGI en el nivel de paquete para poder arrancar con:

    uvicorn app:app --reload
"""

from app.main import app, create_app

__all__ = ["app", "create_app"]
