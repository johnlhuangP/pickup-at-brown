import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from datetime import datetime, timedelta

from app.main import app
from app.database import Base, get_db
from app.models.user import User
from app.models.sport import Sport
from app.models.location import Location
from app.models.session import Session
from app.models.sport_preference import SportPreference

# Create test database
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db):
    def override_get_db():
        try:
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture
def test_user(db):
    user = User(
        username="testuser",
        email="test@example.com",
        supabase_id="test123",
        first_name="Test",
        last_name="User"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def test_user2(db):
    user = User(
        username="testuser2",
        email="test2@example.com",
        supabase_id="test456",
        first_name="Test2",
        last_name="User2"
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@pytest.fixture
def test_sport(db):
    sport = Sport(name="Basketball")
    db.add(sport)
    db.commit()
    db.refresh(sport)
    return sport

@pytest.fixture
def test_location(db):
    location = Location(name="OMAC CT1")
    db.add(location)
    db.commit()
    db.refresh(location)
    return location

@pytest.fixture
def test_sport_preference(db, test_user, test_sport):
    preference = SportPreference(
        user_id=test_user.id,
        sport_id=test_sport.id,
        skill_level="intermediate",
        notification_enabled=True
    )
    db.add(preference)
    db.commit()
    db.refresh(preference)
    return preference

@pytest.fixture
def test_session(db, test_user, test_sport, test_location):
    session = Session(
        title="Test Session",
        description="Test Description",
        datetime=datetime.now() + timedelta(days=1),
        sport_id=test_sport.id,
        location_id=test_location.id,
        creator_id=test_user.id,
        max_participants=4
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session

@pytest.fixture
def test_full_session(db, test_user, test_sport, test_location):
    session = Session(
        title="Full Session",
        description="No spots left",
        datetime=datetime.now() + timedelta(days=1),
        sport_id=test_sport.id,
        location_id=test_location.id,
        creator_id=test_user.id,
        max_participants=2
    )
    db.add(session)
    db.commit()
    db.refresh(session)
    return session