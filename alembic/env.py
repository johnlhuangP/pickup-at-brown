from logging.config import fileConfig
from sqlalchemy import engine_from_config, create_engine
from sqlalchemy import pool
from alembic import context
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import your models
from app.models.user import User
from app.models.session import Session
from app.models.session_participant import SessionParticipant
from app.models.chat_message import ChatMessage
from app.models.activity import Activity
from app.models.friendship import Friendship
from app.database import Base

# this is the Alembic Config object
config = context.config

# Get database URL directly without modifying it
DATABASE_URL = os.getenv('DATABASE_URL')

target_metadata = Base.metadata

def include_object(object, name, type_, reflected, compare_to):
    """Determine which database objects should be included in the autogeneration."""
    # Exclude auth schema and other Supabase internal schemas
    if hasattr(object, 'schema') and object.schema in ['auth', 'storage', 'graphql', 'graphql_public', 'realtime', 'supabase_functions']:
        return False
    return True

def run_migrations_offline() -> None:
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_schemas=False,  # Only work with public schema
        include_object=include_object
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    # Create engine directly with the URL
    connectable = create_engine(
        DATABASE_URL,
        poolclass=pool.NullPool,
        connect_args={
            "sslmode": "require",
            "gssencmode": "disable"
        }
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
            include_schemas=False,  # Only work with public schema
            include_object=include_object
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online() 