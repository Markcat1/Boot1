from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to PIPC Management API"}

def test_create_inmueble_valid():
    response = client.post(
        "/inmuebles/",
        json={
            "nombre": "Torre ZMG",
            "municipio": "Guadalajara",
            "giro_comercial": "Oficinas",
            "poblacion_fixa": 100,
            "poblacion_flotante": 200
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert data["nombre"] == "Torre ZMG"
    assert data["municipio"] == "Guadalajara"
    assert data["riesgo_calculado"] == "Alto" # 300 total afluencia

def test_create_inmueble_invalid_municipio():
    response = client.post(
        "/inmuebles/",
        json={
            "nombre": "Otro Inmueble",
            "municipio": "Monterrey",
            "giro_comercial": "Comercio",
            "poblacion_fixa": 10,
            "poblacion_flotante": 10
        }
    )
    assert response.status_code == 400
    assert "no pertenece a la ZMG" in response.json()["detail"]
