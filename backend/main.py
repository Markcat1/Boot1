from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import os

app = FastAPI(
    title="SafeZMG & Resilience Core API",
    description="Backend API for B2B PIPC Management and B2C Risk Zones in ZMG.",
    version="1.0.0"
)

# Important: allow_credentials=False when allow_origins includes '*'
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class RiskZone(BaseModel):
    id: str
    name: str
    risk_type: str
    polygon_geojson: dict

class PipcLog(BaseModel):
    facility_id: str
    log_type: str
    status: str

# Mock Auth Dependency (To be replaced with actual JWT verification and python-jose)
def get_current_user_role(token: str = "mock_token"):
    # In a real scenario, this would decode the JWT and extract the user's role and tenant_id
    # 'CITIZEN', 'ADMIN', 'CONSULTANT', 'THIRD_PARTY'
    return "CONSULTANT"

# Endpoints
@app.get("/")
async def root():
    return {"message": "Welcome to SafeZMG & Resilience Core API"}

@app.post("/auth/login", response_model=Token)
async def login(user: UserLogin):
    # Mock login
    if user.email == "test@test.com" and user.password == "test":
        return {"access_token": "mock_jwt_token", "token_type": "bearer"}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/b2c/risk-zones", response_model=List[RiskZone])
async def get_risk_zones():
    """
    Returns risk zones for ZMG.
    This data is public and critical for the offline-first B2C module.
    """
    return [
        {
            "id": "1",
            "name": "Zona de Inundación Plaza del Sol",
            "risk_type": "FLOOD",
            "polygon_geojson": {"type": "Polygon", "coordinates": []}
        }
    ]

@app.post("/b2b/pipc/logs", status_code=status.HTTP_201_CREATED)
async def create_pipc_log(log: PipcLog, role: str = Depends(get_current_user_role)):
    """
    Creates a new PIPC log for a facility.

    Regulatory Logic (ZMG & Jalisco State):
    As per local mitigation norms, all PIPC logs MUST be strictly a control and prevention measure.
    The system does NOT issue automatic official dictates. Final validation and signature
    is reserved exclusively for 'Terceros Acreditados' (Certified Third Parties) registered
    with the Municipal Civil Protection Coordination.
    """
    # RBAC logic
    if role not in ["CONSULTANT", "THIRD_PARTY", "ADMIN"]:
        raise HTTPException(status_code=403, detail="Not authorized to create PIPC logs")

    # In a real implementation:
    # 1. Extract tenant_id from user's token.
    # 2. Set current setting for RLS: `await session.execute("SET app.current_tenant_id = :tenant_id", {"tenant_id": tenant_id})`
    # 3. Insert log.

    return {"message": "PIPC log created successfully. Pending official validation by Tercero Acreditado."}

@app.put("/b2b/pipc/logs/{log_id}/validate")
async def validate_pipc_log(log_id: str, role: str = Depends(get_current_user_role)):
    """
    Validates a PIPC log. Reserved exclusively for Terceros Acreditados.
    """
    if role != "THIRD_PARTY":
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Validation is reserved exclusively for Terceros Acreditados registered with PC ZMG."
        )
    return {"message": f"Log {log_id} officially validated."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)