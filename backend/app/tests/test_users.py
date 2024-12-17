from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_create_user():
    user_data = {
        "username": "testuser",
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 200
    assert response.json()["email"] == user_data["email"]

def test_create_user_invalid_data():
    user_data = {
        "username": "testuser",
        "email": "invalid-email",
        "password": "testpassword"
    }
    response = client.post("/users/", json=user_data)
    assert response.status_code == 400
    assert "detail" in response.json()
def test_list_users():
        response = client.get("/users/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)

def test_get_user():
    user_id = 1  # Replace with a valid user ID
    response = client.get(f"/users/{user_id}")
    if response.status_code == 200:
        assert response.json()["id"] == user_id
    else:
        assert response.status_code == 404

def test_get_user_by_supabase_id():
    supabase_id = "valid_supabase_id"  # Replace with a valid Supabase ID
    response = client.get(f"/users/supabase/{supabase_id}")
    if response.status_code == 200:
        assert response.json()["supabase_id"] == supabase_id
    else:
        assert response.status_code == 404
def test_update_user():
        user_id = 1  # Replace with a valid user ID
        update_data = {
            "username": "updateduser",
            "email": "updateduser@example.com"
        }
        response = client.put(f"/users/{user_id}", json=update_data)
        if response.status_code == 200:
            assert response.json()["email"] == update_data["email"]
        else:
            assert response.status_code == 404

def test_delete_user():
    user_id = 1  # Replace with a valid user ID
    response = client.delete(f"/users/{user_id}")
    if response.status_code == 200:
        assert response.json()["id"] == user_id
    else:
        assert response.status_code == 404
