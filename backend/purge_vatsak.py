import sys
import os
from pathlib import Path

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal
from backend import models

def main():
    db = SessionLocal()
    try:
        categories = db.query(models.CategoryMetadata).filter(
            models.CategoryMetadata.image_url.like('%vatsak.com.ua%')
        ).all()
        
        # We will assign placeholder images instead or keep it empty for the admin to configure
        for cat in categories:
            # Re-mapping to some local placeholders / transparent default images if possible
            # Or just set them to empty string 
            print(f"Removing Vatsak image for category: {cat.slug} -> {cat.image_url}")
            cat.image_url = ""
            
        # Also clean Cakes if any left
        cakes = db.query(models.Cake).filter(models.Cake.image_url.like('%vatsak.com.ua%')).all()
        for cake in cakes:
            print(f"Removing Vatsak image for cake: {cake.id} -> {cake.image_url}")
            cake.image_url = ""
            
        db.commit()
        print("Database cleaned from Vatsak links.")
        
    finally:
        db.close()

if __name__ == "__main__":
    main()
