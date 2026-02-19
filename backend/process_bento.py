import os
import shutil
from PIL import Image
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
# Adjust imports for running as a script in backend/ directory or with PYTHONPATH
try:
    from models import Product, Category
    from database import Base, SessionLocal
except ImportError:
    from backend.models import Product, Category
    from backend.database import Base, SessionLocal

# Configuration
# Assuming running from project root
IMAGE_DIR = os.path.join("frontend", "public", "images", "cakes", "bento")
DB_URL = "postgresql://postgres:password@localhost/cake_shop" # Ensure this matches valid URL in database.py or env

def process_image(image_path):
    try:
        img = Image.open(image_path)
        # Resize/Crop to square (e.g., 800x800)
        width, height = img.size
        new_size = min(width, height)
        
        left = (width - new_size)/2
        top = (height - new_size)/2
        right = (width + new_size)/2
        bottom = (height + new_size)/2

        img = img.crop((left, top, right, bottom))
        img = img.resize((800, 800), Image.LANCZOS)
        
        # Save as optimized JPG/PNG
        filename = os.path.basename(image_path)
        processed_path = os.path.join(IMAGE_DIR, f"processed_{filename}")
        img.save(processed_path, quality=90)
        return f"/images/cakes/bento/processed_{filename}"
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

def update_db(image_url):
    engine = create_engine(DB_URL)
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # Check if category exists
        category = session.query(Category).filter_by(slug="bento").first()
        if not category:
            print("Category 'bento' not found.")
            return

        # Add or update product
        product = Product(
            name="Бенто Торт (Custom)",
            slug="bento-custom",
            description="Свіжий бенто-торт з індивідуальним дизайном.",
            price=450,
            image=image_url,
            category_id=category.id,
            is_active=True
        )
        session.add(product)
        session.commit()
        print(f"Added product with image: {image_url}")

    except Exception as e:
        print(f"DB Error: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == "__main__":
    # Process the specific uploaded file
    target_file = "frontend/public/images/cakes/bento/media__1771289708291.jpg"
    if os.path.exists(target_file):
        new_url = process_image(target_file)
        if new_url:
            update_db(new_url)
    else:
        print(f"File not found: {target_file}")
