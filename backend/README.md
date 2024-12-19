# Pickup at Brown - Backend

A FastAPI-based backend application for coordinating pickup sports games at Brown University. Built with Python, FastAPI, and PostgreSQL.

## Project Structure
backend/ ├── alembic/ # Database migrations │ └── versions/ # Migration versions ├── app/ # Main application │ ├── auth/ # Authentication logic │ ├── crud/ # Database operations │ ├── models/ # SQLAlchemy models │ ├── routers/ # API routes │ ├── schemas/ # Pydantic models │ ├── websockets/ # WebSocket handlers │ └── main.py # Application entry point ├── tests/ # Test files │ ├── conftest.py # Test configurations │ └── test_*.py # Test modules └── requirements.txt # Dependencies


## Prerequisites

- Python 3.11+
- PostgreSQL
- pip or conda

## Environment Setup

1. Create a virtual environment:
```bash
python -m venv cs32
source cs32/bin/activate  # On Unix/macOS
```
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Create .env file in the root directory:
```bash
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[dbname]
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

## Database Setup
1. Initialize the database:
```bash
alembic upgrade head
```
2. For fresh database:
```bash
python -m app.create_tables
```

## Running the application
Development Server:
```bash
uvicorn app.main:app --reload --port 8000
```
Access API documentation at http://localhost:8000/docs

## Testing

```bash
#Run all tests:
pytest

#Run specific test file
pytest tests/test_users.py -v

#Run with coverage:
pytest --cov=app tests/
```

## API Routes

### Authentication
* `POST /auth/login` - User login
* `POST /auth/register` - User registration
* `POST /auth/refresh` - Refresh access token

### Users
* `GET /users/me` - Get current user
* `PUT /users/me` - Update user profile
* `GET /users/{id}` - Get user by ID
* `GET /users/{id}/activities` - Get user activities

### Sessions
* `GET /sessions` - List all sessions
* `POST /sessions` - Create new session
* `GET /sessions/{id}` - Get session details
* `PUT /sessions/{id}` - Update session
* `DELETE /sessions/{id}` - Delete session
* `POST /sessions/{id}/join` - Join session
* `POST /sessions/{id}/leave` - Leave session

### WebSocket
* `WS /ws/chat/{session_id}` - Real-time chat
* `WS /ws/notifications` - User notifications

## Models
* User
* Session
* Location
* SessionParticipant
* ChatMessage
* Activity
* Friendship

## Error Handling

### 400 Bad Request
- **Description**: Invalid request payload.

### 401 Unauthorized
- **Description**: Missing or invalid authentication.

### 403 Forbidden
- **Description**: Insufficient permissions.

### 404 Not Found
- **Description**: Resource not found.

### 409 Conflict
- **Description**: Resource conflict.

### 422 Unprocessable Entity
- **Description**: Validation error.

### 500 Internal Server Error
- **Description**: Server error.
