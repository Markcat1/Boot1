from fastapi import APIRouter, HTTPException
from typing import List
from models import Riesgo, RiesgoBase

router = APIRouter(prefix="/inmuebles/{inmueble_id}/riesgos", tags=["Riesgos"])

db_riesgos = []
current_riesgo_id = 1

@router.post("/", response_model=Riesgo)
def create_riesgo(inmueble_id: int, riesgo: RiesgoBase):
    global current_riesgo_id
    new_riesgo = Riesgo(
        id=current_riesgo_id,
        inmueble_id=inmueble_id,
        tipo=riesgo.tipo,
        categoria=riesgo.categoria,
        descripcion=riesgo.descripcion,
        probabilidad=riesgo.probabilidad,
        impacto=riesgo.impacto,
        puntaje=riesgo.nivel_riesgo
    )
    db_riesgos.append(new_riesgo)
    current_riesgo_id += 1
    return new_riesgo

@router.get("/", response_model=List[Riesgo])
def get_riesgos(inmueble_id: int):
    return [r for r in db_riesgos if r.inmueble_id == inmueble_id]
