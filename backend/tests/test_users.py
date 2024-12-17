import pytest
from datetime import datetime

def test_create_user(client):
    user_data = {
        "username": "newuser",
        "email": "new@example.com",
        "supabase_id": "new123",
        "first_name": "New",
        "last_name": "User"
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == user_data["username"]
    assert data["email"] == user_data["email"]
    assert "id" in data

def test_create_duplicate_username(client, test_user):
    user_data = {
        "username": test_user.username,  # Using existing username
        "email": "different@example.com",
        "supabase_id": "different123",
        "first_name": "Different",
        "last_name": "User"
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 400
    assert "Username already registered" in response.json()["detail"]

def test_get_user_by_id(client, test_user):
    response = client.get(f"/users/{test_user.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_user.username
    assert data["email"] == test_user.email

def test_get_nonexistent_user(client):
    response = client.get("/users/999999")
    assert response.status_code == 404

def test_update_user(client, test_user):
    update_data = {
        "username": test_user.username,
        "first_name": "Updated",
        "last_name": "Name",
        "bio": "New bio",
        "sport_preferences": []
    }
    response = client.put(f"/users/{test_user.id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == "Updated"
    assert data["last_name"] == "Name"
    assert data["bio"] == "New bio"

def test_get_user_by_supabase_id(client, test_user):
    response = client.get(f"/users/supabase/{test_user.supabase_id}")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_user.username
    assert data["supabase_id"] == test_user.supabase_id

def test_update_sport_preferences(client, test_user, test_sport):
    preferences_data = {
        "username": test_user.username,
        "first_name": test_user.first_name,
        "last_name": test_user.last_name,
        "sport_preferences": [
            {
                "sport_name": test_sport.name,
                "skill_level": "advanced",
                "notification_enabled": True
            }
        ]
    }
    response = client.put(f"/users/{test_user.id}", json=preferences_data)
    assert response.status_code == 200
    data = response.json()
    assert len(data["sport_preferences"]) == 1
    assert data["sport_preferences"][0]["sport_name"] == test_sport.name
    assert data["sport_preferences"][0]["skill_level"] == "advanced"

def test_get_user_sessions(client, test_user, test_session):
    response = client.get(f"/users/{test_user.id}/sessions")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["id"] == test_session.id
    assert data[0]["title"] == test_session.title

def test_get_user_session_history(client, test_user, test_session):
    # First create a past session
    past_session_data = {
        "title": "Past Session",
        "description": "Past Description",
        "datetime": datetime.now().isoformat(),  # Current time (will be in past when queried)
        "sport_id": test_session.sport_id,
        "location_id": test_session.location_id,
        "max_participants": 4,
        "creator_id": test_user.id
    }
    client.post("/sessions/", json=past_session_data)

    response = client.get(f"/users/{test_user.id}/session-history")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert any(session["title"] == "Past Session" for session in data)

def test_invalid_user_update(client, test_user):
    invalid_data = {
        "username": "",  # Invalid empty username
        "first_name": test_user.first_name,
        "last_name": test_user.last_name,
        "sport_preferences": []
    }
    response = client.put(f"/users/{test_user.id}", json=invalid_data)
    assert response.status_code == 422  # Validation error 