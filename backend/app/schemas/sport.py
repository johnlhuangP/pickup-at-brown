from pydantic import BaseModel
from typing import Optional, List

class SportBase(BaseModel):
    name: str

class SportCreate(SportBase):
    pass

class SportResponse(SportBase):
    id: int

    class Config:
        from_attributes = True 