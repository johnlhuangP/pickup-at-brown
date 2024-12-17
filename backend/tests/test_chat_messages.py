import pytest
from datetime import datetime

def test_create_message(client, test_session, test_user):
    message_data = {
        "content": "Test message",
        "session_id": test_session["id"]
    }
    response = client.post("/chat/?current_user_id={}".format(test_user["id"]), json=message_data)
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == message_data["content"]
    assert data["sender_id"] == test_user["id"]
    assert data["session_id"] == test_session["id"]

def test_get_session_messages(client, test_session, test_user):
    # Create multiple messages
    messages = [
        {"content": f"Test message {i}", 
         "session_id": test_session["id"]}
        for i in range(3)
    ]
    
    for message in messages:
        response = client.post("/chat/?current_user_id={}".format(test_user["id"]), json=message)
        assert response.status_code == 200
    
    # Get all messages for the session
    response = client.get(f"/chat/session/{test_session['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    
    # Verify messages are in chronological order
    timestamps = [datetime.fromisoformat(msg["timestamp"]) for msg in data]
    assert timestamps == sorted(timestamps)

def test_get_session_messages_with_pagination(client, test_session, test_user):
    # Create 10 messages
    messages = [
        {"content": f"Test message {i}", 
         "session_id": test_session["id"]}
        for i in range(10)
    ]
    
    for message in messages:
        response = client.post("/chat/?current_user_id={}".format(test_user["id"]), json=message)
        assert response.status_code == 200
    
    # Test pagination
    response = client.get(f"/chat/session/{test_session['id']}?skip=2&limit=3")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3

def test_create_message_invalid_session(client, test_user):
    message_data = {
        "content": "Test message",
        "session_id": 9999  # Non-existent session
    }
    response = client.post("/chat/?current_user_id={}".format(test_user["id"]), json=message_data)
    assert response.status_code == 404
    assert "Session not found" in response.json()["detail"]

def test_create_message_non_participant(client, test_session, test_user2):
    # test_user2 is not a participant in test_session
    message_data = {
        "content": "Test message",
        "session_id": test_session["id"]
    }
    response = client.post("/chat/?current_user_id={}".format(test_user2["id"]), json=message_data)
    assert response.status_code == 403
    assert "User is not a participant" in response.json()["detail"]

def test_create_empty_message(client, test_session, test_user):
    message_data = {
        "content": "",  # Empty message
        "session_id": test_session["id"]
    }
    response = client.post("/chat/?current_user_id={}".format(test_user["id"]), json=message_data)
    assert response.status_code == 422  # Validation error

def test_get_messages_invalid_session(client):
    response = client.get("/chat/session/9999")  # Non-existent session
    assert response.status_code == 404
    assert "Session not found" in response.json()["detail"]

def test_delete_message(client, test_session, test_user):
    # First create a message
    message_data = {
        "content": "Message to delete",
        "session_id": test_session["id"]
    }
    create_response = client.post("/chat/?current_user_id={}".format(test_user["id"]), json=message_data)
    assert create_response.status_code == 200
    message_id = create_response.json()["id"]
    
    # Then delete it
    response = client.delete(f"/chat/{message_id}?current_user_id={test_user['id']}")
    assert response.status_code == 200
    assert response.json()["message"] == "Message deleted successfully"

def test_delete_message_not_sender(client, test_session, test_user, test_user2):
    # First create a message as test_user
    message_data = {
        "content": "Message to delete",
        "session_id": test_session["id"]
    }
    create_response = client.post("/chat/?current_user_id={}".format(test_user["id"]), json=message_data)
    assert create_response.status_code == 200
    message_id = create_response.json()["id"]
    
    # Try to delete it as test_user2
    response = client.delete(f"/chat/{message_id}?current_user_id={test_user2['id']}")
    assert response.status_code == 404
    assert "Message not found or you're not the sender" in response.json()["detail"]

def test_multiple_messages_ordering(client, test_session, test_user, test_user2):
    # First add test_user2 to the session
    client.post(f"/sessions/{test_session['id']}/join?user_id={test_user2['id']}")
    
    # Create messages from different users
    messages = [
        {"content": "Message 1", "session_id": test_session["id"]},
        {"content": "Message 2", "session_id": test_session["id"]},
        {"content": "Message 3", "session_id": test_session["id"]}
    ]
    
    # Send messages alternating between users
    users = [test_user, test_user2, test_user]
    for message, user in zip(messages, users):
        response = client.post("/chat/?current_user_id={}".format(user["id"]), json=message)
        assert response.status_code == 200
    
    # Get all messages and verify order
    response = client.get(f"/chat/session/{test_session['id']}")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 3
    
    # Verify messages are in chronological order
    for i in range(len(data) - 1):
        current_time = datetime.fromisoformat(data[i]["timestamp"])
        next_time = datetime.fromisoformat(data[i + 1]["timestamp"])
        assert current_time <= next_time
        assert data[i]["content"] == messages[i]["content"]