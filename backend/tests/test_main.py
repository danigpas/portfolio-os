from fastapi.testclient import TestClient
  # Esta importación fallará al principio, ¡es normal!
from app.main import app

client = TestClient(app)

def test_read_root():
      """Test para el endpoint raíz '/'."""
      response = client.get("/")
      assert response.status_code == 200
      assert response.json() == {"message": "Hola, soy la API de tu portfolio!"}