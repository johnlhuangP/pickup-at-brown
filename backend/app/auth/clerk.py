from fastapi import HTTPException, Depends, Header, Request
from typing import Optional
from jose import jwt
from jose.backends import RSAKey
from jose.utils import base64url_decode
import json
import requests

CLERK_JWT_ISSUER = "https://clerk.your.domain.com"
CLERK_JWKS_URL = f"{CLERK_JWT_ISSUER}/.well-known/jwks.json"

# Simplified version for development
async def verify_auth_token(request: Request):
    # For development, just return a mock user
    return {
        "sub": "mock_user_id",
        "email": "test@example.com",
        "username": "test_user",
        "first_name": "Test",
        "last_name": "User"
    }

# Use this as a dependency in routes
async def require_auth(request: Request):
    return await verify_auth_token(request) 