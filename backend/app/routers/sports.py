from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app.crud import sport as crud_sport
from app.schemas.sport import SportCreate, SportResponse

router = APIRouter(
    prefix="/sports",
    tags=["sports"]
)

@router.post("/", response_model=SportResponse)
def create_sport(sport_name: str, db: Session = Depends(get_db)):
    db_sport = crud_sport.get_sport_from_name(db, sport_name)
    if db_sport:
        raise HTTPException(status_code=400, detail="Sport already exists")
    return crud_sport.create_sport(db, sport_name)

@router.get("/", response_model=List[SportResponse])
def get_all_sports(db: Session = Depends(get_db)):
    return crud_sport.get_sports(db)

@router.get("/{sport_id}", response_model=SportResponse)
def get_sport(sport_id: int, db: Session = Depends(get_db)):
    db_sport = crud_sport.get_sport(db, sport_id)
    if not db_sport:
        raise HTTPException(status_code=404, detail="Sport not found")
    return db_sport 