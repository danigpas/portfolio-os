"""Datos del CV como única fuente de verdad (ES/EN).

Los routers no contienen datos hardcodeados: todo se construye desde aquí.
Para actualizar el portfolio basta con editar este módulo.
"""

from __future__ import annotations

from app.schemas import (
    AboutResponse,
    EducationItem,
    EducationResponse,
    ExperienceItem,
    ExperienceResponse,
    Lang,
    ProjectItem,
    ProjectsResponse,
    SkillCategory,
    SkillsResponse,
    SocialLink,
    StatItem,
)

# ---------------------------------------------------------------------------
# Perfil
# ---------------------------------------------------------------------------
NAME = "Daniel González Pascual"
EMAIL = "daniel.gonzalez.pascual@email.com"
GITHUB = "https://github.com/danielgonzalezpascual"
LINKEDIN = "https://linkedin.com/in/danielgonzalezpascual"
YEARS_OF_EXPERIENCE = 3.0

ROLE = {
    "es": "Desarrollador Backend Python",
    "en": "Backend Python Developer",
}
LOCATION = {
    "es": "Málaga, España",
    "en": "Málaga, Spain",
}
SUMMARY = {
    "es": (
        "Desarrollador backend especializado en Python con más de 3 años de "
        "experiencia en FastAPI, Django y arquitecturas escalables. Apasionado por "
        "crear soluciones eficientes, trazables y robustas."
    ),
    "en": (
        "Backend developer specialized in Python with over 3 years of experience in "
        "FastAPI, Django and scalable architectures. Passionate about building "
        "efficient, traceable and robust solutions."
    ),
}
CURRENTLY_LEARNING = {
    "es": "Grado Superior en Desarrollo de Aplicaciones Web (DAW) · en curso",
    "en": "Higher Degree in Web Application Development (DAW) · in progress",
}
STATS = [
    (
        {"es": "Años de experiencia", "en": "Years of experience"},
        "3+",
    ),
    (
        {"es": "Sitios integrados", "en": "Integrated sites"},
        "50+",
    ),
    (
        {"es": "Artículos gestionados", "en": "Managed items"},
        "12K+",
    ),
]
LINKS = [
    SocialLink(label="GitHub", url=GITHUB),
    SocialLink(label="LinkedIn", url=LINKEDIN),
    SocialLink(label="Email", url=f"mailto:{EMAIL}"),
]

# ---------------------------------------------------------------------------
# Experiencia (orden: más reciente primero)
# ---------------------------------------------------------------------------
EXPERIENCE: list[dict[str, object]] = [
    {
        "id": "inforyde-python-semi-senior",
        "company": "Inforyde",
        "role": {
            "es": "Desarrollador Python Semi-Senior",
            "en": "Semi-Senior Python Developer",
        },
        "location": {"es": "Madrid, España", "en": "Madrid, Spain"},
        "period": {"es": "Mar 2026 - Actualidad", "en": "Mar 2026 - Present"},
        "start": "2026-03",
        "end": None,
        "current": True,
        "employment_type": {"es": "Jornada completa", "en": "Full-time"},
        "description": {
            "es": [
                "Desarrollo de aplicaciones y servicios backend en Python en "
                "Inforyde, consultora especializada en el mercado eléctrico "
                "ubicada en Madrid.",
                "Participación en el análisis, desarrollo y mantenimiento de "
                "soluciones para clientes del sector energético.",
                "Trabajo en equipos multidisciplinares aplicando buenas prácticas "
                "de desarrollo, testing y control de versiones.",
            ],
            "en": [
                "Backend application and service development in Python at "
                "Inforyde, a consultancy specialized in the electricity market "
                "based in Madrid.",
                "Involved in the analysis, development and maintenance of "
                "solutions for clients in the energy sector.",
                "Working in multidisciplinary teams applying good development, "
                "testing and version control practices.",
            ],
        },
        "technologies": ["Python", "FastAPI", "SQL", "Testing", "Git"],
        "achievements": {
            "es": [
                "Incorporación a proyectos del sector energético",
                "Desarrollo backend con foco en calidad y testing",
            ],
            "en": [
                "Joined energy-sector projects",
                "Backend development focused on quality and testing",
            ],
        },
    },
    {
        "id": "disofic-backend",
        "company": "DisOfic",
        "role": {"es": "Desarrollador de Backend", "en": "Backend Developer"},
        "location": {"es": "Málaga, España", "en": "Málaga, Spain"},
        "period": {"es": "Sept 2023 - Mar 2026", "en": "Sept 2023 - Mar 2026"},
        "start": "2023-09",
        "end": "2026-03",
        "current": False,
        "employment_type": {"es": "Jornada completa", "en": "Full-time"},
        "description": {
            "es": [
                "Desarrollo de API de integración en tiempo real: lideré el diseño "
                "e implementación de una API con FastAPI para sincronizar más de 50 "
                "sitios WordPress con el CRM Odoo, automatizando la consulta de stock "
                "y precios de más de 12.000 productos y la gestión de pedidos.",
                "Optimización de procesos con scripts en Python: creé scripts y "
                "tareas programadas para la sincronización masiva de clientes y "
                "artículos, reduciendo procesos de días a solo dos horas.",
                "Mejora de la experiencia de compra: implementé una API de precios y "
                "stock en tiempo real en las páginas de producto, eliminando "
                "discrepancias de inventario y reduciendo un 50% las incidencias.",
                "Arquitectura asíncrona: desarrollé un sistema de workers con Celery, "
                "Redis y RabbitMQ para la sincronización masiva entre Odoo y WordPress "
                "Multisite.",
                "Gestión avanzada de bases de datos: MySQL, PostgreSQL y Oracle (12), "
                "con optimización de consultas y gestión de backups.",
            ],
            "en": [
                "Real-time integration API development: led the design and "
                "implementation of a FastAPI service syncing over 50 WordPress sites "
                "with Odoo CRM, automating stock and price queries for more than "
                "12,000 products and order management.",
                "Process optimization with Python scripts: built scripts and "
                "scheduled tasks for bulk synchronization of clients and items, "
                "reducing multi-day manual processes to just two hours.",
                "Improved shopping experience: implemented a real-time price and "
                "stock API on product pages, removing inventory discrepancies and "
                "cutting order-related incidents by 50%.",
                "Asynchronous architecture: developed a worker system with Celery, "
                "Redis and RabbitMQ for bulk synchronization between Odoo and "
                "WordPress Multisite.",
                "Advanced database management: MySQL, PostgreSQL and Oracle (12), "
                "including query optimization and backup management.",
            ],
        },
        "technologies": [
            "Python",
            "FastAPI",
            "Celery",
            "Redis",
            "RabbitMQ",
            "MySQL",
            "PostgreSQL",
            "Oracle",
            "Odoo",
            "WordPress",
        ],
        "achievements": {
            "es": [
                "Automatización de stock y precios de +12.000 productos",
                "Reducción del 50% en incidencias de pedidos",
                "Workers asíncronos para sincronización masiva",
            ],
            "en": [
                "Automated stock and price handling for 12,000+ products",
                "50% reduction in order-related incidents",
                "Async workers for large-scale synchronization",
            ],
        },
    },
    {
        "id": "disofic-internship",
        "company": "DisOfic",
        "role": {
            "es": "Desarrollador de Aplicaciones",
            "en": "Application Developer",
        },
        "location": {"es": "Málaga, España", "en": "Málaga, Spain"},
        "period": {"es": "Jun 2023 - Sept 2023", "en": "Jun 2023 - Sept 2023"},
        "start": "2023-06",
        "end": "2023-09",
        "current": False,
        "employment_type": {"es": "Contrato de prácticas", "en": "Internship"},
        "description": {
            "es": [
                "Lideré el desarrollo de una aplicación de escritorio en C# para la "
                "gestión de almacén y el control de entrada/salida de mercancía, "
                "mejorando en funcionalidad y velocidad a la existente en Oracle Forms.",
            ],
            "en": [
                "Led the development of a C# desktop application for warehouse "
                "management and merchandise input/output, improving functionality "
                "and speed over the existing Oracle Forms solution.",
            ],
        },
        "technologies": ["C#", ".NET", "Oracle Forms"],
        "achievements": {
            "es": ["Mejora de funcionalidad y rendimiento de la aplicación previa"],
            "en": ["Improved functionality and performance of the previous app"],
        },
    },
]

# ---------------------------------------------------------------------------
# Educación
# ---------------------------------------------------------------------------
EDUCATION: list[dict[str, object]] = [
    {
        "id": "daw",
        "institution": "Junta de Andalucía",
        "degree": {
            "es": "Grado Superior en Desarrollo de Aplicaciones Web (DAW)",
            "en": "Higher Degree in Web Application Development (DAW)",
        },
        "period": {"es": "Sept 2025 - Jun 2027", "en": "Sept 2025 - Jun 2027"},
        "status": {"es": "En curso", "en": "In progress"},
        "description": {
            "es": (
                "Cursando actualmente el Grado Superior en Desarrollo de "
                "Aplicaciones Web para ampliar mis conocimientos en tecnologías "
                "frontend y fullstack."
            ),
            "en": (
                "Currently studying the Higher Degree in Web Application "
                "Development to expand my knowledge in frontend and fullstack "
                "technologies."
            ),
        },
        "skills": ["JS/TS", "HTML/CSS", "Bases de datos", "Fullstack"],
    },
    {
        "id": "cesur",
        "institution": "Cesur",
        "degree": {
            "es": ("Certificado de Profesionalidad - Programación de Sistemas Informáticos"),
            "en": "Professional Certificate - Computer Systems Programming",
        },
        "period": {"es": "Feb 2023 - Jun 2023", "en": "Feb 2023 - Jun 2023"},
        "status": {"es": "Completado", "en": "Completed"},
        "description": {
            "es": (
                "Especialización en desarrollo de aplicaciones con enfoque en "
                "programación orientada a objetos y gestión de bases de datos."
            ),
            "en": (
                "Specialization in application development focused on "
                "object-oriented programming and database management."
            ),
        },
        "skills": ["C#", ".NET Framework", "MySQL", "Visual Studio", "GitHub"],
    },
    {
        "id": "uma",
        "institution": "Universidad de Málaga",
        "degree": {
            "es": "Grado en Ingeniería Informática",
            "en": "Degree in Computer Engineering",
        },
        "period": {"es": "Sept 2017 - Sept 2021", "en": "Sept 2017 - Sept 2021"},
        "status": {"es": "Completado", "en": "Completed"},
        "description": {
            "es": (
                "Formación sólida en fundamentos de programación, estructuras de "
                "datos, algoritmos y desarrollo de software."
            ),
            "en": (
                "Solid foundation in programming fundamentals, data structures, "
                "algorithms and software development."
            ),
        },
        "skills": ["Algoritmos", "Estructuras de datos", "Resolución de problemas"],
    },
    {
        "id": "uimp",
        "institution": "Universidad Internacional Menéndez Pelayo",
        "degree": {
            "es": "Curso de Inmersión en la Lengua Inglesa (B1)",
            "en": "English Language Immersion Course (B1)",
        },
        "period": {"es": "Jul 2019", "en": "Jul 2019"},
        "status": {"es": "Completado", "en": "Completed"},
        "description": {
            "es": (
                "Curso intensivo de inglés para mejorar las competencias "
                "lingüísticas en entorno académico."
            ),
            "en": (
                "Intensive English course to improve language skills in an academic environment."
            ),
        },
        "skills": ["Inglés B1"],
    },
]

# ---------------------------------------------------------------------------
# Proyectos
# ---------------------------------------------------------------------------
PROJECTS: list[dict[str, object]] = [
    {
        "id": "elnietodepascual",
        "name": "El Nieto de Pascual",
        "project_type": {"es": "Blog personal", "en": "Personal blog"},
        "description": {
            "es": (
                "Blog personal sobre desarrollo backend, Python y tecnología, "
                "donde comparto experiencias, tutoriales y reflexiones."
            ),
            "en": (
                "Personal blog about backend development, Python and technology "
                "where I share experiences, tutorials and reflections."
            ),
        },
        "technologies": ["Python", "Django", "PostgreSQL", "HTML/CSS"],
        "status": {"es": "Activo", "en": "Active"},
        "url": "https://elnietodepascual.com",
        "repository": None,
        "featured": True,
    },
    {
        "id": "portfolio-retro-nes",
        "name": "Portfolio Retro NES",
        "project_type": {"es": "Portfolio personal", "en": "Personal portfolio"},
        "description": {
            "es": (
                "Portfolio con estética retro inspirada en la NES, con diseño "
                "pixel art y animaciones nostálgicas."
            ),
            "en": (
                "Portfolio with a retro aesthetic inspired by the NES, featuring "
                "pixel art design and nostalgic animations."
            ),
        },
        "technologies": ["HTML", "CSS", "JavaScript", "Pixel Art"],
        "status": {"es": "Completado", "en": "Completed"},
        "url": None,
        "repository": "https://github.com/danielgonzalezpascual",
        "featured": True,
    },
    {
        "id": "api-integracion-fastapi",
        "name": "API de Integración FastAPI",
        "project_type": {"es": "Integración empresarial", "en": "Business integration"},
        "description": {
            "es": (
                "Sistema de sincronización en tiempo real entre WordPress y Odoo "
                "CRM, gestionando más de 50 sitios web."
            ),
            "en": (
                "Real-time synchronization system between WordPress and Odoo CRM, "
                "handling more than 50 websites."
            ),
        },
        "technologies": ["FastAPI", "Python", "MySQL", "WordPress", "Odoo"],
        "status": {"es": "Completado", "en": "Completed"},
        "url": None,
        "repository": None,
        "featured": False,
    },
]

# ---------------------------------------------------------------------------
# Habilidades
# ---------------------------------------------------------------------------
SKILLS: list[dict[str, object]] = [
    {
        "id": "backend",
        "name": {"es": "Backend", "en": "Backend"},
        "items": ["Python", "FastAPI", "Django", "Flask", "REST APIs", "Celery"],
    },
    {
        "id": "databases",
        "name": {"es": "Bases de datos", "en": "Databases"},
        "items": ["MySQL", "PostgreSQL", "Oracle", "Redis"],
    },
    {
        "id": "tools",
        "name": {"es": "Herramientas y DevOps", "en": "Tools & DevOps"},
        "items": ["Docker", "Git", "CI/CD", "RabbitMQ", "Odoo", "WordPress"],
    },
    {
        "id": "testing",
        "name": {"es": "Testing y calidad", "en": "Testing & quality"},
        "items": ["pytest", "ruff", "Type hints", "Code review"],
    },
]


# ---------------------------------------------------------------------------
# Constructores localizados
# ---------------------------------------------------------------------------
def _t(value: object, lang: Lang) -> object:
    """Resuelve un valor localizado ``{"es": ..., "en": ...}``."""
    if isinstance(value, dict):
        localized = value.get(lang.value)
        if localized is not None:
            return localized
        return value.get("es")
    return value


def build_about(lang: Lang) -> AboutResponse:
    return AboutResponse(
        name=NAME,
        role=_t(ROLE, lang),
        location=_t(LOCATION, lang),
        summary=_t(SUMMARY, lang),
        email=EMAIL,
        years_of_experience=YEARS_OF_EXPERIENCE,
        currently_learning=_t(CURRENTLY_LEARNING, lang),
        stats=[StatItem(label=_t(label, lang), value=value) for label, value in STATS],
        links=LINKS,
    )


def build_experience(lang: Lang) -> ExperienceResponse:
    items = [
        ExperienceItem(
            id=entry["id"],
            company=entry["company"],
            role=_t(entry["role"], lang),
            location=_t(entry["location"], lang),
            period=_t(entry["period"], lang),
            start=entry["start"],
            end=entry["end"],
            current=entry["current"],
            employment_type=_t(entry["employment_type"], lang),
            description=_t(entry["description"], lang),
            technologies=entry["technologies"],
            achievements=_t(entry["achievements"], lang),
        )
        for entry in EXPERIENCE
    ]
    return ExperienceResponse(total=len(items), items=items)


def build_education(lang: Lang) -> EducationResponse:
    items = [
        EducationItem(
            id=entry["id"],
            institution=entry["institution"],
            degree=_t(entry["degree"], lang),
            period=_t(entry["period"], lang),
            status=_t(entry["status"], lang),
            description=_t(entry["description"], lang),
            skills=entry["skills"],
        )
        for entry in EDUCATION
    ]
    return EducationResponse(total=len(items), items=items)


def build_projects(lang: Lang) -> ProjectsResponse:
    items = [
        ProjectItem(
            id=entry["id"],
            name=entry["name"],
            project_type=_t(entry["project_type"], lang),
            description=_t(entry["description"], lang),
            technologies=entry["technologies"],
            status=_t(entry["status"], lang),
            url=entry["url"],
            repository=entry["repository"],
            featured=entry["featured"],
        )
        for entry in PROJECTS
    ]
    return ProjectsResponse(total=len(items), items=items)


def build_skills(lang: Lang) -> SkillsResponse:
    categories = [
        SkillCategory(id=entry["id"], name=_t(entry["name"], lang), items=entry["items"])
        for entry in SKILLS
    ]
    return SkillsResponse(total=len(categories), categories=categories)
