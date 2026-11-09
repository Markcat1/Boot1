from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router as api_router

app = FastAPI(
    title="SafeZMG & Resilience Core API",
    description="Backend API for comprehensive risk management and PIPC automation in ZMG",
    version="1.0.0"
)

# Configure CORS based on memory constraint
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False, # Must be False when allow_origins includes '*'
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")

@app.get("/health")
def health_check():
    return {"status": "ok"}
