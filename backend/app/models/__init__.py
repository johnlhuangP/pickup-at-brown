from app.models.user import User
from app.models.sport import Sport
from app.models.sport_preference import SportPreference
from app.models.session import Session
from app.models.session_participant import SessionParticipant
from app.models.chat_message import ChatMessage
from app.models.activity import Activity
from app.models.friendship import Friendship
from app.models.location import Location
from app.models.location_blocked_time import BlockedTime
#from app.models.location_occupancy import LocationOccupancy

# This ensures all models are registered with SQLAlchemy
__all__ = [
    "User",
    "Sport",
    "SportPreference",
    "Session",
    "SessionParticipant",
    "ChatMessage",
    "Activity",
    "Friendship",
    "Location",
    "BlockedTime"
]
 