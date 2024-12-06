from app.database import SessionLocal
from app.crud.sport import create_sport

def init_sports():
    db = SessionLocal()
    try:
        sports = ["Tennis", "Basketball", "Soccer", "Pickleball", "Badminton", "Volleyball", "Football"]
        for sport_name in sports:
            try:
                create_sport(db, sport_name)
                print(f"Created sport: {sport_name}")
            except Exception as e:
                print(f"Error creating sport {sport_name}: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    init_sports() 