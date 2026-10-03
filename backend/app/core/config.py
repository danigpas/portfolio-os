"""Configuración de la aplicación a partir de variables de entorno."""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/app/core/config.py -> parents[2] == backend/
BACKEND_DIR = Path(__file__).resolve().parents[2]
REPO_ROOT = BACKEND_DIR.parent
DEFAULT_CV_PDF = REPO_ROOT / "public" / "cv-daniel-gonzalez-pascual.pdf"


class Settings(BaseSettings):
    """Ajustes de la API. Se leen del entorno o de un archivo ``.env``."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    app_name: str = "Portfolio API"
    app_version: str = "0.1.0"
    environment: str = "development"
    api_prefix: str = "/api"
    log_level: str = "INFO"
    contact_rate_limit: str = "5/minute"
    cors_origins: str = (
        "https://danigpascual.dev,https://www.danigpascual.dev,http://localhost:3000"
    )
    cv_pdf_path: str | None = None

    @property
    def cors_origins_list(self) -> list[str]:
        """Devuelve los orígenes CORS como lista, sin entradas vacías."""
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]

    @property
    def cv_pdf(self) -> Path:
        """Ruta absoluta al PDF del CV, resuelta a partir del entorno."""
        if self.cv_pdf_path:
            path = Path(self.cv_pdf_path)
            return path if path.is_absolute() else (BACKEND_DIR / path).resolve()
        return DEFAULT_CV_PDF

    @property
    def cv_filename(self) -> str:
        """Nombre de archivo que se enviará en ``Content-Disposition``."""
        return self.cv_pdf.name or "cv-daniel-gonzalez-pascual.pdf"


@lru_cache
def get_settings() -> Settings:
    """Devuelve la configuración (cacheada) de la aplicación."""
    return Settings()


settings = get_settings()
