from fastapi.testclient import TestClient
  # Esta importación fallará al principio, ¡es normal!
from app.main import app
from app.core.config import API_V1_STR

client = TestClient(app)

def test_read_about_data():
    response = client.get(f'{API_V1_STR}/about')

    #Comprobamos que la respuesta del endpoint es exitosa
    assert response.status_code == 200
    #comprobamos que el json resultante es una lista de resultados
    assert isinstance(response.json(),list) 
    #comprobamos que por lo menos hay un resultado
    assert len(response.json()) > 0
    #Por ultimo comprobamos que el nombre del primer resultado sea correcto
    assert response.json()[0]['name'] == 'Daniel González Pascual'
