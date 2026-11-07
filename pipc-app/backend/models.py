from pydantic import BaseModel, Field
from typing import List, Optional

# --- Module 1: General Data ---
class InmuebleBase(BaseModel):
    nombre: str
    municipio: str = Field(..., description="Municipio dentro de la ZMG")
    giro_comercial: str
    poblacion_fixa: int
    poblacion_flotante: int

    @property
    def afluencia_total(self) -> int:
        return self.poblacion_fixa + self.poblacion_flotante

    @property
    def nivel_riesgo(self) -> str:
        # Lógica simplificada basada en afluencia para clasificación de riesgo PIPC
        total = self.afluencia_total
        if total < 50:
            return "Bajo"
        elif total <= 250:
            return "Medio"
        else:
            return "Alto"

class Inmueble(InmuebleBase):
    id: int
    riesgo_calculado: str

# --- Module 2: Risk Analysis ---
class RiesgoBase(BaseModel):
    tipo: str = Field(..., description="'Interno' o 'Externo'")
    categoria: str = Field(..., description="Ej. 'Eléctrico', 'Socio-organizativo'")
    descripcion: str
    probabilidad: int = Field(..., ge=1, le=5)
    impacto: int = Field(..., ge=1, le=5)

    @property
    def nivel_riesgo(self) -> int:
        return self.probabilidad * self.impacto

class Riesgo(RiesgoBase):
    id: int
    inmueble_id: int
    puntaje: int

# --- Module 3: Inventory & Brigades ---
class EquipoBase(BaseModel):
    tipo: str = Field(..., description="Ej. 'Extintor', 'Ruta de evacuación'")
    especificacion: str = Field(..., description="Ej. 'Tipo A, B, C', 'Señal NOM-003'")
    ubicacion: str
    cantidad: int

class Equipo(EquipoBase):
    id: int
    inmueble_id: int

class BrigadistaBase(BaseModel):
    nombre: str
    brigada: str = Field(..., description="Ej. 'Primeros Auxilios', 'Evacuación'")
    capacitado: bool

class Brigadista(BrigadistaBase):
    id: int
    inmueble_id: int

# --- Module 4: Calendars ---
class EventoCalendarioBase(BaseModel):
    tipo_evento: str = Field(..., description="'Simulacro' o 'Mantenimiento'")
    descripcion: str
    fecha_programada: str
    estado: str = "Pendiente"

class EventoCalendario(EventoCalendarioBase):
    id: int
    inmueble_id: int
