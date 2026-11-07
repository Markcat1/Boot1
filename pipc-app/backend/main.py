from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import general_data, risk_analysis, inventory, calendars, export

app = FastAPI(title="PIPC Management API", description="API para la gestión de Programas Internos de Protección Civil")

# Configure CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(general_data.router)
app.include_router(risk_analysis.router)
app.include_router(inventory.router)
app.include_router(calendars.router)
app.include_router(export.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to PIPC Management API"}
