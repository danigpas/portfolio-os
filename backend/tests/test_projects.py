from fastapi.testclient import TestClient
  # Esta importación fallará al principio, ¡es normal!
from app.main import app
from app.core.config import API_V1_STR

client = TestClient(app)

def test_projects_list():
    """
    Prueba que el endpoint de proyectos devuelva una lista correcta.
    Sigue el patron Preparar, Actuar, Asegurar
    """
    #1. Preparar
    #Definimos el resultado exacto que esperamos que nos devuelvan, asi estamos obligados a pensar en la estructura de los datos
    expected_data = [
          {
              "id": 1,
              "name": "Portfolio OS",
              "description": "Un sistema operativo de portfolio web hecho con Next.js y FastAPI.",
              "url": "https://github.com/danigpas/portfolio-os",
              "tags": ["Next.js", "FastAPI", "TypeScript", "Python"]
          }
      ]
    #2. Actuar
    #Hacemos la peticion http a la url de nuestro endpoint
    #El cliente hace una llamada a nuestra API en memoria, sin levantar un servidor real
    response = client.get(f"{API_V1_STR}/projects")

    #3. Asegurar
    #Comprobamos que lo que hemos recibido es lo que esperabamos
    #primero aseguramos que el codigo de respuesta es 200
    assert response.status_code == 200

    #Aseguramos que el JSON es igual a la respuesta esperada
    assert response.json() == expected_data