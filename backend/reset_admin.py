import sys
import os

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import crud, schemas, auth, models
from backend.database import SessionLocal

def reset_admin():
    db = SessionLocal()
    try:
        email = "admin"
        password = "admin"
        
        # Check if user already exists
        user = db.query(models.User).filter(models.User.email == email).first()
        if user:
            print(f"User {email} found. Resetting password and admin status...")
            user.hashed_password = auth.get_password_hash(password)
            user.is_admin = True
            db.commit()
            print(f"SUCCESS: Admin password reset to '{password}' and is_admin=True")
        else:
            print(f"User {email} not found. Creating...")
            user_in = schemas.UserCreate(email=email, password=password)
            db_user = crud.create_user(db, user_in)
            db_user.is_admin = True
            db.commit()
            print(f"SUCCESS: Admin user created: {email} / {password}")
            
    except Exception as e:
        print(f"ERROR: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_admin()
