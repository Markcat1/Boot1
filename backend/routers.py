from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

# Models
class FacilityRegister(BaseModel):
    name: str
    description: str
    latitude: float
    longitude: float
    address: str

class SubscriptionRequest(BaseModel):
    user_id: int
    plan_tier: str

class RiskAssessment(BaseModel):
    latitude: float
    longitude: float

# Endpoints
@router.post("/facilities/", tags=["PIPC B2B"])
def register_facility(facility: FacilityRegister):
    # Simulated db insertion logic
    return {
        "status": "success",
        "message": f"Facility '{facility.name}' registered successfully.",
        "facility_id": 123
    }

@router.post("/subscriptions/", tags=["Monetization"])
def process_subscription(subscription: SubscriptionRequest):
    valid_tiers = ["freemium", "pyme", "industrial", "corporativo"]
    if subscription.plan_tier.lower() not in valid_tiers:
        raise HTTPException(status_code=400, detail="Invalid plan tier")

    # Simulated subscription processing
    return {
        "status": "success",
        "message": f"Subscription '{subscription.plan_tier}' activated for user {subscription.user_id}."
    }

@router.post("/risk-level/", tags=["Risk Assessment"])
def calculate_risk_level(assessment: RiskAssessment):
    # Simulated risk calculation, checking PostGIS intersections ideally
    return {
        "risk_level": "High",
        "details": "Located near potential flood zone.",
        "mitigation_required": True
    }
