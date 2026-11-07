from fastapi import APIRouter, HTTPException
from typing import List
from models import Equipo, EquipoBase, Brigadista, BrigadistaBase

router = APIRouter(prefix="/inmuebles/{inmueble_id}/inventario", tags=["Inventario"])

db_equipos = []
db_brigadistas = []
current_equipo_id = 1
current_brigadista_id = 1

@router.post("/equipos", response_model=Equipo)
def add_equipo(inmueble_id: int, equipo: EquipoBase):
    global current_equipo_id
    new_equipo = Equipo(
        id=current_equipo_id,
        inmueble_id=inmueble_id,
        tipo=equipo.tipo,
        especificacion=equipo.especificacion,
        ubicacion=equipo.ubicacion,
        cantidad=equipo.cantidad
    )
    db_equipos.append(new_equipo)
    current_equipo_id += 1
    return new_equipo

@router.get("/equipos", response_model=List[Equipo])
def get_equipos(inmueble_id: int):
    return [e for e in db_equipos if e.inmueble_id == inmueble_id]

@router.post("/brigadas", response_model=Brigadista)
def add_brigadista(inmueble_id: int, brigadista: BrigadistaBase):
    global current_brigadista_id
    new_brigadista = Brigadista(
        id=current_brigadista_id,
        inmueble_id=inmueble_id,
        nombre=brigadista.nombre,
        brigada=brigadista.brigada,
        capacitado=brigadista.capacitado
    )
    db_brigadistas.append(new_brigadista)
    current_brigadista_id += 1
    return new_brigadista

@router.get("/brigadas", response_model=List[Brigadista])
def get_brigadistas(inmueble_id: int):
    return [b for b in db_brigadistas if b.inmueble_id == inmueble_id]
