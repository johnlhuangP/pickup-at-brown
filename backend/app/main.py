from fastapi import FastAPI
from app.routers import posts # Import the posts router

app = FastAPI()

# Include the posts router
app.include_router(posts.router)

@app.get("/")
async def root():
    return {"message": "Hello World"}