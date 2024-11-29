from app.models.user import User
from app.models.post import Post
from app.database import Base

# This ensures the models are registered with SQLAlchemy
__all__ = ['User', 'Post', 'Base']

# Make sure models are loaded
User
Post 