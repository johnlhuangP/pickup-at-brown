from app.database import engine
from app.models.user import User
from app.models.session import Session
from app.models.session_participant import SessionParticipant
from app.models.chat_message import ChatMessage
from app.models.activity import Activity
from app.models.friendship import Friendship
from app.database import Base

def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables() 