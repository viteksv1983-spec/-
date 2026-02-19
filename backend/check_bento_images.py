import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from backend.database import SessionLocal
from backend.models import Cake

db = SessionLocal()
bentos = db.query(Cake).filter(Cake.category == "bento").limit(5).all()

print(f"Found {len(bentos)} bento cakes.")
for bento in bentos:
    print(f"ID: {bento.id}, Name: {bento.name}, Image URL: {bento.image_url}")

db.close()
