from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import location as location_crud
from app.schemas.location import LocationCreate, LocationResponse, LocationUpdate
from typing import List
# imports for availability handling 
from app.database import get_db
from app.crud import location as location_crud
from app.schemas.location import LocationCreate, LocationResponse, LocationUpdate
from app.schemas.time_block import TimeBlockCreate, TimeBlockResponse
#imports for web scraper
from app.scrapers.omac_scraper import get_omac_reservations
from app.util.LocationEvent import LocationEvent

router = APIRouter(
    prefix="/locations",  # Changed prefix to plural
    tags=["locations"]
)

# These endpoints Simply Define all the locations (static - define once)
@router.post("/", response_model=LocationResponse)
def create_location(location: LocationCreate, db: Session = Depends(get_db)):
    return location_crud.create_location(db=db, location=location)

@router.get("/", response_model=List[LocationResponse])
def list_locations(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    locations = location_crud.get_locations(
        db, 
        skip=skip, 
        limit=limit, 
    )
    return locations

@router.get("/{location_id}", response_model=LocationResponse)
def get_location(location_id: int, db: Session = Depends(get_db)):
    db_location = location_crud.get_location(db, location_id=location_id)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location

@router.put("/{location_id}", response_model=LocationResponse)
def update_location(location_id: int, location: LocationUpdate, db: Session = Depends(get_db)):
    db_location = location_crud.update_location(db, location_id=location_id, location=location)
    if db_location is None:
        raise HTTPException(status_code=404, detail="Location not found")
    return db_location

@router.delete("/{location_id}")
def delete_location(location_id: int, db: Session = Depends(get_db)):
    success = location_crud.delete_location(db, location_id=location_id)
    if not success:
        raise HTTPException(status_code=404, detail="Location not found")
    return {"message": "Location deleted successfully"}

# New Time Block Endpoints
@router.post("/{location_id}/blocks", response_model=TimeBlockResponse)
def create_time_block(
    location_id: int, 
    time_block: TimeBlockCreate, 
    db: Session = Depends(get_db)
):
    """
    Create a time block for a specific location
    - Checks for conflicts with existing blocks
    - Ensures block is within location's available times
    """
    # Validate location exists
    db_location = location_crud.get_location(db, location_id)
    if not db_location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    # Add logic to check for time block conflicts
    return location_crud.create_time_block(
        db, 
        location_id=location_id, 
        time_block=time_block
    )

@router.get("/{location_id}/availability", response_model=List[TimeBlockResponse])
def get_location_availability(
    location_id: int, 
    start_time: datetime = None, 
    end_time: datetime = None,
    db: Session = Depends(get_db)
):
    """
    Retrieve availability for a specific location
    - Optional filtering by start/end times
    """
    # Validate location exists
    db_location = location_crud.get_location(db, location_id)
    if not db_location:
        raise HTTPException(status_code=404, detail="Location not found")
    
    return location_crud.get_time_blocks(
        db, 
        location_id=location_id, 
        start_time=start_time, 
        end_time=end_time
    )

@router.delete("/{location_id}/blocks/{block_id}")
def delete_time_block(
    location_id: int, 
    block_id: int, 
    db: Session = Depends(get_db)
):
    """
    Delete a specific time block
    - Ensures block belongs to the specified location
    """
    success = location_crud.delete_time_block(
        db, 
        location_id=location_id, 
        block_id=block_id
    )
    if not success:
        raise HTTPException(status_code=404, detail="Time block not found")
    
    return {"message": "Time block deleted successfully"}

@router.post("/import-availability")
def import_court_availability(
    db: Session = Depends(get_db)
):
    scraped_events = get_omac_reservations()
    
    location_mapping = {
        "OMAC CT1": 1,
        "OMAC CT2": 2,
        "OMAC CT3": 3,
        "OMAC CT4": 4,
        #...
    }
    
    import_result = import_scraped_events(
        db, 
        scraped_events, 
        location_mapping
    )
    
    return import_result