import pytest
from datetime import datetime, timedelta
from fastapi import HTTPException

def test_create_session(client, test_user, test_sport, test_location):
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
    
    data = response.json()
    assert data["title"] == session_data["title"]
    assert data["description"] == session_data["description"]
    assert data["sport"]["id"] == test_sport["id"]
    assert data["location"]["id"] == test_location["id"]
    assert data["creator"]["id"] == test_user["id"]
    assert data["current_participants"] == 1

def test_get_sessions(client, test_session):
    response = client.get("/sessions/")
    assert response.status_code == 200
    
    data = response.json()
    assert len(data) > 0
    assert data[0]["title"] == test_session["title"]

def test_join_session(client, test_session, test_user2):
    response = client.post(f"/sessions/{test_session['id']}/join?user_id={test_user2['id']}")
    assert response.status_code == 200
    
    session_response = client.get(f"/sessions/{test_session['id']}")
    assert session_response.status_code == 200
    session_data = session_response.json()
    assert session_data["current_participants"] == 2

def test_leave_session(client, test_session, test_user2):
    # First join the session
    join_response = client.post(f"/sessions/{test_session['id']}/join?user_id={test_user2['id']}")
    assert join_response.status_code == 200
    
    # Then leave the session
    response = client.post(f"/sessions/{test_session['id']}/leave?user_id={test_user2['id']}")
    assert response.status_code == 200
    
    session_response = client.get(f"/sessions/{test_session['id']}")
    assert session_response.status_code == 200
    session_data = session_response.json()
    assert session_data["current_participants"] == 1

def test_join_full_session(client, test_full_session, test_user2):
    response = client.post(f"/sessions/{test_full_session['id']}/join?user_id={test_user2['id']}")
    assert response.status_code == 400
    assert "Session is full" in response.json()["detail"]

def test_leave_session_not_participant(client, test_session, test_user2):
    response = client.post(f"/sessions/{test_session['id']}/leave?user_id={test_user2['id']}")
    assert response.status_code == 400
    assert "User is not a participant" in response.json()["detail"]

def test_get_session_participants(client, test_session, test_user2):
    client.post(f"/sessions/{test_session['id']}/join?user_id={test_user2['id']}")
    response = client.get(f"/sessions/{test_session['id']}/participants")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2 # Creator and new user


def test_creator_cannot_leave_session(client, test_session, test_user):
    response = client.post(f"/sessions/{test_session['id']}/leave?user_id={test_user['id']}")
    assert response.status_code == 400
    assert "Creator cannot leave" in response.json()["detail"]

def test_join_session_twice(client, test_session, test_user2):
    # Join first time
    client.post(f"/sessions/{test_session['id']}/join?user_id={test_user2['id']}")
    
    # Try to join again
    response = client.post(f"/sessions/{test_session['id']}/join?user_id={test_user2['id']}")
    assert response.status_code == 400
    assert "User already in session" in response.json()["detail"]
