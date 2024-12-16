from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import users, sports, sessions, locations, chat_messages, websockets

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers
app.include_router(users.router)
app.include_router(sports.router)
app.include_router(sessions.router)
app.include_router(locations.router)
app.include_router(chat_messages.router)
app.include_router(websockets.router)

@app.get("/")
async def root():
    return {"message": "Welcome to Pickup@Brown API"}