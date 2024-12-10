from fastapi import APIRouter, Depends
from app.auth.clerk import require_auth

class AuthRouter(APIRouter):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Comment out or remove the authentication dependency
        # self.dependencies = [Depends(require_auth)] + (self.dependencies or []) 