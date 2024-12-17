import pytest
from datetime import datetime, timedelta

def test_create_session(client, test_user, test_sport, test_location):
    session_data = {
        "title": "Test Session",
        "description": "Test Description",
        "datetime": (datetime.now() + timedelta(days=1)).isoformat(),
        "sport_id": test_sport.id,
        "location_id": test_location.id,
        "max_participants": 4,
    }
    response = client.post(f"/sessions/?creator_id={test_user.id}", json=session_data)
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == session_data["title"]
    assert data["sport"]["id"] == test_sport.id
    assert data["current_participants"] == 0

def test_get_session_by_id(client, test_session):
    response = client.get(f"/sessions/{test_session.id}")
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_session.id
    assert data["title"] == test_session.title

def test_get_nonexistent_session(client):
    response = client.get("/sessions/999999")
    assert response.status_code == 404

def test_join_session(client, test_session, test_user2):
    response = client.post(f"/sessions/{test_session.id}/join?user_id={test_user2.id}")
    assert response.status_code == 200
    
    # Verify session details after joining
    session_response = client.get(f"/sessions/{test_session.id}")
    data = session_response.json()
    assert data["current_participants"] == 1

def test_join_full_session(client, test_full_session, test_user2):
    response = client.post(f"/sessions/{test_full_session.id}/join?user_id={test_user2.id}")
    assert response.status_code == 400
    assert "Session is full" in response.json()["detail"]

def test_leave_session(client, test_session, test_user2):
    # First join the session
    client.post(f"/sessions/{test_session.id}/join?user_id={test_user2.id}")
    
    # Then leave the session
    response = client.post(f"/sessions/{test_session.id}/leave?user_id={test_user2.id}")
    assert response.status_code == 200
    
    # Verify session details after leaving
    session_response = client.get(f"/sessions/{test_session.id}")
    data = session_response.json()
    assert data["current_participants"] == 1

def test_leave_session_not_participant(client, test_session, test_user2):
    response = client.post(f"/sessions/{test_session.id}/leave?user_id={test_user2.id}")
    assert response.status_code == 400
    assert "User is not a participant" in response.json()["detail"]

def test_get_session_participants(client, test_session, test_user):
    response = client.get(f"/sessions/{test_session.id}/participants")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0] == test_user.id

def test_filter_sessions_by_sport(client, test_session, test_sport):
    response = client.get(f"/sessions/sport/{test_sport.id}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert all(session["sport"]["id"] == test_sport.id for session in data)

def test_session_validation(client, test_user, test_sport, test_location):
    # Test creating session with past datetime
    past_session_data = {
        "title": "Past Session",
        "datetime": (datetime.now() - timedelta(days=1)).isoformat(),
        "sport_id": test_sport.id,
        "location_id": test_location.id,
        "max_participants": 4,
        "creator_id": test_user.id
    }
    response = client.post("/sessions/", json=past_session_data)
    assert response.status_code == 422

    # Test creating session with invalid max_participants
    invalid_participants_data = {
        "title": "Invalid Participants",
        "datetime": (datetime.now() + timedelta(days=1)).isoformat(),
        "sport_id": test_sport.id,
        "location_id": test_location.id,
        "max_participants": 0,
        "creator_id": test_user.id
    }
    response = client.post("/sessions/", json=invalid_participants_data)
    assert response.status_code == 422

def test_creator_cannot_leave_session(client, test_session, test_user):
    response = client.post(f"/sessions/{test_session.id}/leave?user_id={test_user.id}")
    assert response.status_code == 400
    assert "Creator cannot leave" in response.json()["detail"]

def test_join_session_twice(client, test_session, test_user2):
    # Join first time
    client.post(f"/sessions/{test_session.id}/join?user_id={test_user2.id}")
    
    # Try to join again
    response = client.post(f"/sessions/{test_session.id}/join?user_id={test_user2.id}")
    assert response.status_code == 400
    assert "already a participant" in response.json()["detail"]

def test_get_upcoming_sessions(client, test_session):
    response = client.get("/sessions/upcoming")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    # Verify all sessions are in the future
    for session in data:
        session_time = datetime.fromisoformat(session["datetime"].replace("Z", "+00:00"))
        assert session_time > datetime.now() 