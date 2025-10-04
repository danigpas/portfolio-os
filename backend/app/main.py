from fastapi import FastAPI

app = FastAPI(
    title = "Portfolio OS API",
    description = "Backend para el portfolio de Daniel Gonzalez",
    version= "0.1.0"
)

@app.get('/')
def read_root():
    """
    Endpoint principal que devuelve un mensaje de bienvenida
    """
    return {"message":"Hola, soy la API de tu portfolio!"}

