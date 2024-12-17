import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

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

def test_create_sport(client):
    response = client.post("/sports/", json={"sport_name": "Basketball"})
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Basketball"

def test_create_existing_sport(client):
    client.post("/sports/", json={"sport_name": "Basketball"})
    response = client.post("/sports/", json={"sport_name": "Basketball"})
    assert response.status_code == 400
    assert response.json()["detail"] == "Sport already exists"

def test_get_all_sports(client):
    client.post("/sports/", json={"sport_name": "Soccer"})
    response = client.get("/sports/")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0

def test_get_sport(client):
    response = client.post("/sports/1", json={"sport_name": "Tennis"})
    sport_id = response.json()["id"]
    response = client.get(f"/sports/{sport_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["name"] == "Tennis"

def test_get_nonexistent_sport(client):
    response = client.get("/sports/9999")
    assert response.status_code == 404
    assert response.json()["detail"] == "Sport not found"