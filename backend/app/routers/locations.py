from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.location import Location
from typing import List
from app.schemas.location import LocationResponse, LocationCreate
import app.crud.location as crud

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

@router.post("/", response_model=LocationResponse)
def create_location(
    location: LocationCreate,
    db: Session = Depends(get_db)
):
    """Create a new location"""
    db_location = crud.create_location(db, location)
    return db_location
