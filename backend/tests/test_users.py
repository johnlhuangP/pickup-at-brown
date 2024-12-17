import pytest
from datetime import datetime, timedelta

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
    assert "id" in data

def test_get_user(client, test_user):
    response = client.get(f"/users/{test_user['id']}")
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == test_user["username"]

def test_update_user(client, test_user):
    update_data = {
        "first_name": "Updated",
        "last_name": "Name"
    }
    response = client.put(f"/users/{test_user['id']}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    assert data["first_name"] == update_data["first_name"]
    assert data["last_name"] == update_data["last_name"]

def test_create_duplicate_username(client, test_user):
    user_data = {
        "username": test_user["username"],
        "email": "different@example.com",
        "supabase_id": "different123",
        "first_name": "Different",
        "last_name": "User"
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 400
    assert "Username already exists" in response.json()["detail"]


def test_invalid_user_update(client, test_user):
    update_data = {
        "username": "",  # Invalid empty username
        "email": "invalid"  # Invalid email format
    }
    response = client.put(f"/users/{test_user['id']}", json=update_data)
    assert response.status_code == 422  # Validation error