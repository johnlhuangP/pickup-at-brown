from sqlalchemy.orm import Session
from app.models.location import Location as LocationModel
from app.schemas.location_timeblock import TimeBlockCreate, TimeBlockUpdate, TimeBlockResponse
from app.schemas.location import LocationCreate, LocationUpdate, LocationResponse
from app.models.location_blocked_time import BlockedTime as TimeBlockModel
from app.util.LocationEvent import LocationEvent
import datetime
from typing import List, Dict


def get_location(db: Session, location_id: int):  # Changed from session_id
    return db.query(LocationModel).filter(LocationModel.id == location_id).first()

def get_locations(db: Session, skip: int = 0, limit: int = 100):
    query = db.query(LocationModel)  # Changed from SessionModel
    return query.offset(skip).limit(limit).all()

def create_location(db: Session, location: LocationCreate):
    db_location = LocationModel(name = location.name)
    db.add(db_location)
    db.commit()
    db.refresh(db_location)
    return db_location  # Changed from db_session

def update_location(db: Session, location_id: int, location: LocationUpdate):
    db_location = get_location(db, location_id)  # Changed from get_session
    if not db_location:
        return None
    
    for var, value in location.dict(exclude_unset=True).items():
        setattr(db_location, var, value)
    
    db.commit()
    db.refresh(db_location)
    return db_location

def delete_location(db: Session, location_id: int):
    db_location = get_location(db, location_id)
    if not db_location:
        return False
    
    # Query and delete all time blocks associated with the location
    time_blocks_for_location = db.query(TimeBlockModel).filter(TimeBlockModel.location_id == location_id).all()
    for time_block in time_blocks_for_location:
        db.delete(time_block)
    
    db.delete(db_location)
    db.commit()
    return True


def create_time_block(
    db: Session, 
    location_id: int, 
    time_block: TimeBlockCreate
):
    # Check for conflicts with existing blocks
    existing_blocks = db.query(TimeBlockModel).filter(
        TimeBlockModel.location_id == location_id,
        TimeBlockModel.start_time < time_block.end_time,
        TimeBlockModel.end_time > time_block.start_time
    ).all()
    
    if existing_blocks:
        raise HTTPException(
            status_code=400, 
            detail="Time block conflicts with existing blocks"
        )
    
    db_time_block = TimeBlockModel(
        location_id=location_id,
        **time_block.dict()
    )
    db.add(db_time_block)
    db.commit()
    db.refresh(db_time_block)
    return db_time_block

def get_time_blocks(
    db: Session, 
    location_id: int, 
    start_time: datetime = None, 
    end_time: datetime = None
):
    query = db.query(TimeBlockModel).filter(
        TimeBlockModel.location_id == location_id
    )
    
    if start_time:
        query = query.filter(TimeBlockModel.end_time > start_time)
    
    if end_time:
        query = query.filter(TimeBlockModel.start_time < end_time)
    
    return query.all()

def delete_time_block(
    db: Session, 
    location_id: int, 
    block_id: int
):
    db_time_block = db.query(TimeBlockModel).filter(
        TimeBlockModel.id == block_id,
        TimeBlockModel.location_id == location_id
    ).first()
    
    if not db_time_block:
        return False
    
    db.delete(db_time_block)
    db.commit()
    return True

# for web scraping
def import_scraped_events(db: Session, scraped_events: List[LocationEvent], location_mapping: Dict[str, int]):
    """
    Import scraped events into the TimeBlock table
    
    Args:
    - db: Database session
    - scraped_events: List of Event objects from web scraper
    - location_mapping: Dictionary mapping location names to database location IDs
    
    Example location_mapping:
    {
        "OMAC Courts 1": 1,
        "OMAC Courts 2": 2,
        "OMAC Courts 3": 3,
        "OMAC Courts 4": 4,
        "OMAC Track": 5
    }
    """
    # Batch to store new time blocks
    time_blocks_to_add = []
    
    for event in scraped_events:
        try:
            # Look up location ID based on event's location name
            if event.location not in location_mapping:
                print(f"Warning: No location ID found for {event.location}")
                continue
            location_id = location_mapping[event.location]
            
            # Create a new TimeBlock instance
            new_time_block = TimeBlock(
                location_id=location_id,
                start_time=event.start_time,
                end_time=event.end_time,
                source='web_scraper',  # Indicates origin of the block
            )
            
            time_blocks_to_add.append(new_time_block)
        
        except Exception as e:
            print(f"Error processing event: {e}")
    
    # Bulk insert to improve performance
    db.bulk_save_objects(time_blocks_to_add)
    db.commit()
    for block in time_blocks_to_add:
        db.refresh(block)
    # Logging and reporting
    print(f"Import Summary:")
    print(f"Total Events: {len(scraped_events)}")
    print(f"Successful Imports: {successful_imports}")
    print(f"Failed Imports: {failed_imports}")
    
    return {
        "total_events": len(scraped_events),
        "successful_imports": successful_imports,
        "failed_imports": failed_imports
    }
