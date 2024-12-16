from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.location import Location
from typing import List
from app.schemas.location import LocationResponse

router = APIRouter(
    prefix="/locations",
    tags=["locations"]
)

@router.get("/", response_model=List[LocationResponse])
def get_all_locations(
    skip: int = 0, 
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all locations"""
    return db.query(Location).offset(skip).limit(limit).all()