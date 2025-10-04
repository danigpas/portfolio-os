from fastapi import FastAPI
from app.core.config import API_V1_STR
from app.routers import projects, about

app = FastAPI(
    title = "Portfolio OS API",
    description = "Backend para el portfolio de Daniel Gonzalez",
    version= "0.1.0"
)

app.include_router(projects.router, prefix=API_V1_STR,tags=["projects"])
app.include_router(about.router, prefix=API_V1_STR,tags=["about"])

@app.get('/')
def read_root():
    """
    Endpoint principal que devuelve un mensaje de bienvenida
    """
    return {"message":"Hola, soy la API de tu portfolio!"}

