from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import sessions, users, sports, locations, friends
from app.models import *

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Public routes (if any) would go here
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Protected routes
app.include_router(friends.router)
app.include_router(locations.router)
app.include_router(users.router)
app.include_router(sessions.router)
app.include_router(sports.router)


@app.get("/")
async def root():
    return {"message": "Welcome to Pickup at Brown API"}