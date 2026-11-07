from fastapi import APIRouter, HTTPException
from routers.general_data import db_inmuebles
from routers.risk_analysis import db_riesgos
from routers.inventory import db_equipos, db_brigadistas
from routers.calendars import db_eventos

router = APIRouter(prefix="/inmuebles/{inmueble_id}/export", tags=["Export"])

@router.get("/")
def export_memoria_descriptiva(inmueble_id: int):
    # Retrieve data
    inmueble = next((i for i in db_inmuebles if i.id == inmueble_id), None)
    if not inmueble:
        raise HTTPException(status_code=404, detail="Inmueble no encontrado")

    riesgos = [r for r in db_riesgos if r.inmueble_id == inmueble_id]
    equipos = [e for e in db_equipos if e.inmueble_id == inmueble_id]
    brigadas = [b for b in db_brigadistas if b.inmueble_id == inmueble_id]
    eventos = [e for e in db_eventos if e.inmueble_id == inmueble_id]

    # Structure the descriptive memory
    memoria_descriptiva = {
        "titulo": f"Programa Interno de Protección Civil - {inmueble.nombre}",
        "datos_generales": {
            "nombre": inmueble.nombre,
            "municipio": inmueble.municipio,
            "giro_comercial": inmueble.giro_comercial,
            "poblacion_fixa": inmueble.poblacion_fixa,
            "poblacion_flotante": inmueble.poblacion_flotante,
            "afluencia_total": inmueble.poblacion_fixa + inmueble.poblacion_flotante,
            "nivel_riesgo_pipc": inmueble.riesgo_calculado
        },
        "analisis_riesgos": [
            {
                "tipo": r.tipo,
                "categoria": r.categoria,
                "descripcion": r.descripcion,
                "probabilidad": r.probabilidad,
                "impacto": r.impacto,
                "puntaje_riesgo": r.puntaje
            } for r in riesgos
        ],
        "inventario_equipos": [
            {
                "tipo": e.tipo,
                "especificacion": e.especificacion,
                "ubicacion": e.ubicacion,
                "cantidad": e.cantidad
            } for e in equipos
        ],
        "brigadas_emergencia": [
            {
                "nombre": b.nombre,
                "brigada": b.brigada,
                "capacitado": "Sí" if b.capacitado else "No"
            } for b in brigadas
        ],
        "calendario_actividades": [
            {
                "tipo_evento": ev.tipo_evento,
                "descripcion": ev.descripcion,
                "fecha_programada": ev.fecha_programada,
                "estado": ev.estado
            } for ev in eventos
        ]
    }

    return memoria_descriptiva
