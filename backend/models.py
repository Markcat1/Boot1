from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date
from uuid import UUID

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
    organization_id: Optional[str] = None

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    role: str
    organization_id: Optional[UUID] = None

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    role: str
    organization_id: Optional[UUID] = None

    class Config:
        from_attributes = True

class FacilityCreate(BaseModel):
    name: str
    address: str
    facility_type: str
    # Simplying location as string WKT for prototype
    location_wkt: str

class FacilityResponse(BaseModel):
    id: UUID
    name: str
    address: str
    facility_type: str
    organization_id: UUID

    class Config:
        from_attributes = True

class RiskZoneResponse(BaseModel):
    id: UUID
    name: str
    risk_type: str
    description: Optional[str] = None

    class Config:
        from_attributes = True
