"""Modelos Pydantic v2 de petición y respuesta de la API."""

from __future__ import annotations

from datetime import datetime
from enum import StrEnum

from pydantic import BaseModel, EmailStr, Field, field_validator


class Lang(StrEnum):
    """Idiomas soportados por la API."""

    es = "es"
    en = "en"


# ---------------------------------------------------------------------------
# About
# ---------------------------------------------------------------------------
class SocialLink(BaseModel):
    label: str
    url: str


class StatItem(BaseModel):
    label: str
    value: str


class AboutResponse(BaseModel):
    name: str
    role: str
    location: str
    summary: str
    email: EmailStr
    years_of_experience: float
    currently_learning: str
    stats: list[StatItem]
    links: list[SocialLink]


# ---------------------------------------------------------------------------
# Experience
# ---------------------------------------------------------------------------
class ExperienceItem(BaseModel):
    id: str
    company: str
    role: str
    location: str
    period: str
    start: str
    end: str | None = None
    current: bool
    employment_type: str
    description: list[str]
    technologies: list[str]
    achievements: list[str]


class ExperienceResponse(BaseModel):
    total: int
    items: list[ExperienceItem]


# ---------------------------------------------------------------------------
# Education
# ---------------------------------------------------------------------------
class EducationItem(BaseModel):
    id: str
    institution: str
    degree: str
    period: str
    status: str
    description: str
    skills: list[str] = Field(default_factory=list)


class EducationResponse(BaseModel):
    total: int
    items: list[EducationItem]


# ---------------------------------------------------------------------------
# Projects
# ---------------------------------------------------------------------------
class ProjectItem(BaseModel):
    id: str
    name: str
    project_type: str
    description: str
    technologies: list[str]
    status: str
    url: str | None = None
    repository: str | None = None
    featured: bool = False


class ProjectsResponse(BaseModel):
    total: int
    items: list[ProjectItem]


# ---------------------------------------------------------------------------
# Skills
# ---------------------------------------------------------------------------
class SkillCategory(BaseModel):
    id: str
    name: str
    items: list[str]


class SkillsResponse(BaseModel):
    total: int
    categories: list[SkillCategory]


# ---------------------------------------------------------------------------
# Contact
# ---------------------------------------------------------------------------
class ContactRequest(BaseModel):
    """Payload de contacto con validación estricta y honeypot anti-spam."""

    name: str = Field(min_length=2, max_length=100, examples=["Ana García"])
    email: EmailStr = Field(examples=["ana@example.com"])
    message: str = Field(
        min_length=10,
        max_length=2000,
        examples=["Hola, me gustaría hablar sobre un proyecto."],
    )
    website: str | None = Field(
        default=None,
        max_length=200,
        description="Campo trampa anti-spam: debe quedar vacío.",
    )

    @field_validator("name", "message", mode="before")
    @classmethod
    def _strip_text(cls, value: object) -> object:
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("name", "message")
    @classmethod
    def _not_blank(cls, value: str) -> str:
        if not value:
            raise ValueError("no puede estar vacío")
        return value


class ContactAccepted(BaseModel):
    status: str
    message: str
    reference: str
    received_at: datetime


# ---------------------------------------------------------------------------
# Health
# ---------------------------------------------------------------------------
class HealthResponse(BaseModel):
    status: str
    service: str
    version: str
    timestamp: datetime


__all__ = [
    "AboutResponse",
    "ContactAccepted",
    "ContactRequest",
    "EducationItem",
    "EducationResponse",
    "ExperienceItem",
    "ExperienceResponse",
    "HealthResponse",
    "Lang",
    "ProjectItem",
    "ProjectsResponse",
    "SkillCategory",
    "SkillsResponse",
    "SocialLink",
    "StatItem",
]
