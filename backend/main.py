from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
import uvicorn

app = FastAPI(
    title="SafeZMG & Resilience Core API",
    description="Backend API for B2B PIPC Management and B2C Community Alerts in ZMG.",
    version="1.0.0"
)

# --- Schemas ---

class FacilityCreate(BaseModel):
    name: str
    address: str
    facility_type: str
    latitude: float
    longitude: float

class SubscriptionCreate(BaseModel):
    user_id: int
    plan_name: str

class RiskAssessmentResponse(BaseModel):
    facility_name: str
    risk_level: str
    recommendations: list[str]
    # Comentario: Según la Ley de Protección Civil del Estado de Jalisco,
    # dependiento de la cercanía a cuerpos de agua o fallas (ZMG), se exigen
    # diferentes medidas de mitigación en el PIPC.
    regulatory_notes: str

# --- Endpoints ---

@app.get("/")
def read_root():
    return {"message": "Welcome to SafeZMG & Resilience Core API"}

@app.post("/api/v1/facilities", tags=["B2B Management"])
def register_facility(facility: FacilityCreate):
    """
    Registra un nuevo inmueble para la gestión de su PIPC (Programa Interno de Protección Civil).
    """
    # Aquí iría la lógica de guardado en base de datos usando SQLAlchemy/GeoAlchemy2
    return {
        "status": "success",
        "message": f"Facility '{facility.name}' registered successfully.",
        "facility": facility.dict()
    }

@app.get("/api/v1/facilities/{facility_id}/risk", response_model=RiskAssessmentResponse, tags=["B2B Management"])
def calculate_risk(facility_id: int):
    """
    Calcula el nivel de riesgo de un inmueble basado en su ubicación (PostGIS spatial queries)
    y el Atlas de Riesgo de la ZMG.
    """
    # Lógica simulada: Se realizaría una consulta ST_DWithin a la tabla risk_zones
    # para determinar si las coordenadas del facility intersecan o están cerca de un polígono de riesgo.

    # Comentario normativo:
    # Reglamento de Protección Civil y Bomberos del Municipio de Guadalajara:
    # Se debe verificar si el inmueble requiere dictamen de viabilidad debido a su nivel de riesgo (e.g. Alto).

    return RiskAssessmentResponse(
        facility_name="Simulated Facility",
        risk_level="High",
        recommendations=[
            "Revisar plan de evacuación por inundación.",
            "Actualizar bitácora de extintores (NFPA 10)."
        ],
        regulatory_notes="Debido a su ubicación en zona de inundación, el PIPC requiere validación especial municipal en ZMG."
    )

@app.post("/api/v1/subscriptions", tags=["Monetization"])
def process_subscription(subscription: SubscriptionCreate):
    """
    Procesa el alta de una suscripción SaaS B2B para monetización.
    """
    # Integración simulada con pasarela de pago (Stripe/PayPal)
    valid_plans = ["freemium", "pyme", "corporate"]
    if subscription.plan_name not in valid_plans:
        raise HTTPException(status_code=400, detail="Invalid plan name.")

    return {
        "status": "success",
        "message": f"User {subscription.user_id} subscribed to '{subscription.plan_name}' plan.",
        "active_until": "2024-12-31" # Simulado
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
