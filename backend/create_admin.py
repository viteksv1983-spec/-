import sys
import os

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import crud, schemas
from backend.database import SessionLocal

def create_admin():
    db = SessionLocal()
    try:
        # Check if user already exists
        user = crud.get_user_by_email(db, email="admin")
        if not user:
            user_in = schemas.UserCreate(email="admin", password="admin")
            db_user = crud.create_user(db, user_in)
            db_user.is_admin = True
            db.commit()
            print("Admin user created: admin / admin")
        else:
            user.is_admin = True
            db.commit()
            print("Admin user already exists. ensuring is_admin=True.")
    finally:
        db.close()

if __name__ == "__main__":
    create_admin()
