from fastapi import APIRouter, HTTPException
from typing import List
from models import EventoCalendario, EventoCalendarioBase

router = APIRouter(prefix="/inmuebles/{inmueble_id}/calendario", tags=["Calendario"])

db_eventos = []
current_evento_id = 1

@router.post("/", response_model=EventoCalendario)
def add_evento(inmueble_id: int, evento: EventoCalendarioBase):
    global current_evento_id
    new_evento = EventoCalendario(
        id=current_evento_id,
        inmueble_id=inmueble_id,
        tipo_evento=evento.tipo_evento,
        descripcion=evento.descripcion,
        fecha_programada=evento.fecha_programada,
        estado=evento.estado
    )
    db_eventos.append(new_evento)
    current_evento_id += 1
    return new_evento

@router.get("/", response_model=List[EventoCalendario])
def get_eventos(inmueble_id: int):
    return [e for e in db_eventos if e.inmueble_id == inmueble_id]
