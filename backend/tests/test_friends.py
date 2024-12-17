import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.schemas.friendship import FriendshipCreate, FriendshipUpdate
from app.models.friendship import Friendship as FriendshipModel

SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base.metadata.create_all(bind=engine)

@pytest.fixture(scope="module")
def client():
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as c:
        yield c

@pytest.fixture(scope="module")
def test_db():
    db = TestingSessionLocal()
    yield db
    db.close()

def test_send_friend_request(client, test_db):
    response = client.post("/friendships/", json={"user_id": 1, "friend_id": 2})
    assert response.status_code == 200
    assert response.json()["user_id"] == 1
    assert response.json()["friend_id"] == 2
    assert response.json()["status"] == "pending"

def test_update_friendship_status(client, test_db):
    # First, send a friend request
    client.post("/friendships/", json={"user_id": 1, "friend_id": 2})
    # Update the status
    response = client.put("/friendships/1", json={"status": "accepted"})
    assert response.status_code == 200
    assert response.json()["status"] == "accepted"

def test_list_friendships(client, test_db):
    # Send a friend request
    client.post("/friendships/", json={"user_id": 1, "friend_id": 2})
    # List friendships
    response = client.get("/friendships/?user_id=1")
    assert response.status_code == 200
    assert len(response.json()) > 0

def test_delete_friend(client, test_db):
    # Send a friend request and accept it
    client.post("/friendships/", json={"user_id": 1, "friend_id": 2})
    client.put("/friendships/1", json={"status": "accepted"})
    # Delete the friendship
    response = client.delete("/friendships/2?user_id=1")
    assert response.status_code == 200
    assert response.json()["message"] == "Friendship deleted successfully."

def test_send_duplicate_friend_request(client, test_db):
    client.post("/friendships/", json={"user_id": 1, "friend_id": 2})
    response = client.post("/friendships/", json={"user_id": 1, "friend_id": 2})
    assert response.status_code == 400
    assert "Friend request already sent." in response.json()["detail"]

def test_update_nonexistent_friendship_status(client, test_db):
    response = client.put("/friendships/999", json={"status": "accepted"})
    assert response.status_code == 404
    assert "Friendship request not found." in response.json()["detail"]

def test_delete_nonexistent_friendship(client, test_db):
    response = client.delete("/friendships/999?user_id=1")
    assert response.status_code == 404
    assert "Friendship not found." in response.json()["detail"]

def test_list_friendships_with_status(client, test_db):
    client.post("/friendships/", json={"user_id": 1, "friend_id": 2})
    client.put("/friendships/1", json={"status": "accepted"})
    response = client.get("/friendships/?user_id=1&status=accepted")
    assert response.status_code == 200
    assert len(response.json()) > 0
    assert response.json()[0]["status"] == "accepted"

def test_list_friendships_with_pagination(client, test_db):
    client.post("/friendships/", json={"user_id": 1, "friend_id": 2})
    response = client.get("/friendships/?user_id=1&skip=0&limit=1")
    assert response.status_code == 200
    assert len(response.json()) == 1
