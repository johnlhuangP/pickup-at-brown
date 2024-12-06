from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import sessions
from app.models import *  # This will import all models

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(sessions.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Pickup at Brown API"}