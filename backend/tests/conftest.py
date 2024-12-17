import pytest
from datetime import datetime, timedelta
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db

# Test database setup
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
        db.rollback()
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
def test_user(client):
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "supabase_id": "test123",
        "first_name": "Test",
        "last_name": "User",
        "sport_preferences": []
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def test_user2(client):
    user_data = {
        "username": "testuser2",
        "email": "test2@example.com",
        "supabase_id": "test456",
        "first_name": "Test2",
        "last_name": "User2",
        "sport_preferences": []
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def test_user3(client):
    user_data = {
        "username": "testuser3",
        "email": "test3@example.com",
        "supabase_id": "test789",
        "first_name": "Test3",
        "last_name": "User3",
        "sport_preferences": []
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def test_sport(client):
    response = client.post("/sports/?sport_name=Test Sport")
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def test_location(client):
    location_data = {
        "name": "Test Location",
    }
    response = client.post("/locations/", json=location_data)
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def test_session(client, test_user, test_sport, test_location):
    session_data = {
        "title": "Test Session",
        "description": "Test Description",
        "datetime": (datetime.now() + timedelta(days=1)).isoformat(),
        "sport_id": test_sport["id"],
        "location_id": test_location["id"],
        "max_participants": 4
    }
    response = client.post(f"/sessions/?creator_id={test_user['id']}", json=session_data)
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def test_full_session(client, test_user, test_sport, test_location):
    session_data = {
        "title": "Full Session",
        "description": "Test Description",
        "datetime": (datetime.now() + timedelta(days=1)).isoformat(),
        "sport_id": test_sport["id"],
        "location_id": test_location["id"],
        "max_participants": 1  # Only creator can join
    }
    response = client.post(f"/sessions/?creator_id={test_user['id']}", json=session_data)
    assert response.status_code == 200
    return response.json()

@pytest.fixture
def test_multiple_sessions(client, test_user, test_sport, test_location):
    sessions = []
    for i in range(3):
        session_data = {
            "title": f"Test Session {i}",
            "description": f"Test Description {i}",
            "datetime": (datetime.now() + timedelta(days=i+1)).isoformat(),
            "sport_id": test_sport["id"],
            "location_id": test_location["id"],
            "max_participants": 4
        }
        response = client.post(f"/sessions/?creator_id={test_user['id']}", json=session_data)
        assert response.status_code == 200
        sessions.append(response.json())
    return sessions
