from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List
from models import Token, UserResponse, FacilityCreate, FacilityResponse, RiskZoneResponse

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/v1/auth/token")

# Mock dependency for getting current user tenant for prototype
async def get_current_user_tenant(token: str = Depends(oauth2_scheme)):
    # In a real implementation, this would decode the JWT and return user details
    # including their organization_id. For now, we return a mock UUID.
    return {"user_id": "mock-uuid", "organization_id": "mock-org-uuid", "role": "FacilityManager"}

@router.post("/auth/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    # Mock authentication
    if form_data.username == "admin@safezmg.com" and form_data.password == "admin":
        return {"access_token": "mock_token_admin", "token_type": "bearer"}
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect username or password",
        headers={"WWW-Authenticate": "Bearer"},
    )

@router.get("/facilities", response_model=List[FacilityResponse])
async def get_facilities(current_user: dict = Depends(get_current_user_tenant)):
    # Mock fetching facilities for the tenant
    return [
        {
            "id": "123e4567-e89b-12d3-a456-426614174000",
            "name": "Planta Industrial Centro",
            "address": "Av. Vallarta 123",
            "facility_type": "Industrial",
            "organization_id": current_user["organization_id"]
        }
    ]

@router.post("/facilities", response_model=FacilityResponse)
async def create_facility(facility: FacilityCreate, current_user: dict = Depends(get_current_user_tenant)):
    # Mock creating a facility
    return {
        "id": "123e4567-e89b-12d3-a456-426614174001",
        "name": facility.name,
        "address": facility.address,
        "facility_type": facility.facility_type,
        "organization_id": current_user["organization_id"]
    }

@router.get("/risk-zones", response_model=List[RiskZoneResponse])
async def get_risk_zones():
    # Public B2C endpoint to get risk zones
    return [
        {
            "id": "223e4567-e89b-12d3-a456-426614174000",
            "name": "Zona Inundable El Dean",
            "risk_type": "Flood",
            "description": "Zona con alto riesgo de inundación temporal."
        }
    ]
