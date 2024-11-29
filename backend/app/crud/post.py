from sqlalchemy.orm import Session
from app.models.post import Post
from typing import Optional

def get_post(db: Session, post_id: int):
    return db.query(Post).filter(Post.id == post_id).first()

def get_user_posts(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Post)\
        .filter(Post.user_id == user_id)\
        .offset(skip)\
        .limit(limit)\
        .all()

def create_post(db: Session, title: str, content: str, user_id: int):
    db_post = Post(
        title=title,
        content=content,
        user_id=user_id
    )
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post 