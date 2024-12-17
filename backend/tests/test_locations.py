import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db
from app.schemas.location import LocationCreate

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

def test_create_location(client):
    location_data = {
        "name": "Test Location",
        "address": "123 Test St",
        "latitude": 40.7128,
        "longitude": -74.0060
    }
    response = client.post("/locations/", json=location_data)
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == location_data["name"]
    assert data["address"] == location_data["address"]
    assert data["latitude"] == location_data["latitude"]
    assert data["longitude"] == location_data["longitude"]

def test_get_all_locations(client):
    response = client.get("/locations/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_create_duplicate_location(client):
    location_data = {
        "name": "Duplicate Location",
        "address": "123 Duplicate St",
        "latitude": 40.7128,
        "longitude": -74.0060
    }
    client.post("/locations/", json=location_data)
    response = client.post("/locations/", json=location_data)
    assert response.status_code == 400
    assert response.json()["detail"] == "Location already exists"

def test_get_location(client):
    location_data = {
        "name": "Specific Location",
        "address": "123 Specific St",
        "latitude": 40.7128,
        "longitude": -74.0060
    }
    response = client.post("/locations/", json=location_data)
    location_id = response.json()["id"]
    response = client.get(f"/locations/{location_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == location_data["name"]
    assert data["address"] == location_data["address"]
    assert data["latitude"] == location_data["latitude"]
    assert data["longitude"] == location_data["longitude"]

def test_get_nonexistent_location(client):
    response = client.get("/locations/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Location not found"