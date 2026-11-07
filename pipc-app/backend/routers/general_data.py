from fastapi import APIRouter, HTTPException
from typing import List
from models import Inmueble, InmuebleBase

router = APIRouter(prefix="/inmuebles", tags=["Inmuebles"])

# Mock Database
db_inmuebles = []
current_id = 1

ZMG_MUNICIPIOS = ["Guadalajara", "Zapopan", "Tlaquepaque", "Tonalá", "Tlajomulco", "El Salto", "Ixtlahuacán de los Membrillos", "Juanacatlán", "Zapotlanejo"]

@router.post("/", response_model=Inmueble)
def create_inmueble(inmueble: InmuebleBase):
    global current_id
    if inmueble.municipio not in ZMG_MUNICIPIOS:
         raise HTTPException(status_code=400, detail="El municipio no pertenece a la ZMG.")

    new_inmueble = Inmueble(
        id=current_id,
        nombre=inmueble.nombre,
        municipio=inmueble.municipio,
        giro_comercial=inmueble.giro_comercial,
        poblacion_fixa=inmueble.poblacion_fixa,
        poblacion_flotante=inmueble.poblacion_flotante,
        riesgo_calculado=inmueble.nivel_riesgo
    )
    db_inmuebles.append(new_inmueble)
    current_id += 1
    return new_inmueble

@router.get("/", response_model=List[Inmueble])
def get_inmuebles():
    return db_inmuebles

@router.get("/{inmueble_id}", response_model=Inmueble)
def get_inmueble(inmueble_id: int):
    for inmob in db_inmuebles:
        if inmob.id == inmueble_id:
            return inmob
    raise HTTPException(status_code=404, detail="Inmueble no encontrado")
