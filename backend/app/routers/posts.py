from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.crud import post as crud_post

router = APIRouter(
    prefix="/posts",
    tags=["posts"]
)

@router.get("/{post_id}")
def read_post(post_id: int, db: Session = Depends(get_db)):
    db_post = crud_post.get_post(db, post_id)
    if db_post is None:
        raise HTTPException(status_code=404, detail="Post not found")
    return db_post

@router.post("/user/{user_id}")
def create_post_for_user(
    user_id: int,
    title: str,
    content: str,
    db: Session = Depends(get_db)
):
    return crud_post.create_post(db, title, content, user_id) 

