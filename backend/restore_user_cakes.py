import sys
import os
import sqlite3
import time

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal
from backend import models, schemas, crud

def restore_cakes():
    db = SessionLocal()
    media_dir = os.path.join("backend", "media")
    
    # Mapping of identified "beautiful" images to names/descriptions
    # Based on visual inspection of the media folder
    RESTORE_MAPPING = {
        "07ac587c-2ed8-45c8-9e87-a22f022518b4.png": {
            "name": "Бенто 'Лелека - Дідусь і бабуся'",
            "description": "Милий тортик з лелекою: 'Дідусь і бабуся, чекайте на мене взимку!'"
        },
        "12f0d33d-c6b8-4ae2-9673-d8bd3a8b2a8e.png": {
            "name": "Бенто 'Пес Патрон - Happy Birthday'",
            "description": "Патріотичний тортик з Псом Патроном та серцями."
        },
        "babc329a-0a75-4997-af08-6d30309a59df.png": {
            "name": "Бенто 'Малюк у капусті'",
            "description": "Ніжний дизайн для повідомлення про поповнення в родині."
        }
    }

    print("Checking media folder for bento cakes...")
    
    # Also find other potential bento images uploaded recently
    additional_images = []
    if os.path.exists(media_dir):
        now = time.time()
        for f in os.listdir(media_dir):
            if f.endswith(('.png', '.jpg', '.jpeg')):
                path = os.path.join(media_dir, f)
                mtime = os.path.getmtime(path)
                # Images from Feb 17-19
                if now - mtime < 72 * 3600 and f not in RESTORE_MAPPING:
                    additional_images.append(f)

    # Restore identified ones first
    for img_name, data in RESTORE_MAPPING.items():
        image_url = f"/media/{img_name}"
        # Check if already exists
        exists = db.query(models.Cake).filter(models.Cake.image_url == image_url).first()
        if not exists:
            cake_in = schemas.CakeCreate(
                name=data["name"],
                description=data["description"],
                price=550.0,
                image_url=image_url,
                is_available=True,
                category="bento",
                weight=450.0,
                ingredients="Фірмовий бісквіт, крем-чіз",
                shelf_life="48 годин"
            )
            crud.create_cake(db=db, cake=cake_in)
            print(f"Restored: {data['name']}")
        else:
            print(f"Skipping (exists): {data['name']}")

    # Restore others as generic bento cakes if they look relevant
    for img_name in additional_images:
        image_url = f"/media/{img_name}"
        exists = db.query(models.Cake).filter(models.Cake.image_url == image_url).first()
        if not exists:
            cake_in = schemas.CakeCreate(
                name=f"Бенто Торт (Відновлений) {img_name[:8]}",
                description="Ваш унікальний дизайн бенто-торта.",
                price=500.0,
                image_url=image_url,
                is_available=True,
                category="bento",
                weight=450.0,
                ingredients="Натуральні інгредієнти",
                shelf_life="48 годин"
            )
            crud.create_cake(db=db, cake=cake_in)
            print(f"Restored generic: {img_name}")

    db.close()
    print("Restoration complete!🕺🎂🚀🎉🧁✅")

if __name__ == "__main__":
    restore_cakes()
