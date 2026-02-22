import sys
import os
from pathlib import Path
from PIL import Image

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal
from backend import models

def optimize_image_white_bg(img_path_str):
    img_path = Path(img_path_str)
    if not img_path.exists():
        return None
        
    try:
        img = Image.open(img_path)
        
        # We want to create a white background for transparent images
        if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
            # Convert specifically to RGBA to be safe
            img = img.convert('RGBA')
            # Create a white background
            background = Image.new('RGB', img.size, (255, 255, 255))
            # Paste the image on the background using the alpha channel as a mask
            background.paste(img, mask=img.split()[3])
            img = background
        else:
            img = img.convert('RGB')
            
        max_size = (1200, 1200)
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # New filename
        new_filename = img_path.stem + ".webp"
        new_path = img_path.parent / new_filename
        
        img.save(new_path, "WEBP", quality=85)
        print(f"Optimized to WebP with white bg: {new_filename}")
        
        return new_filename
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
        return None

def main():
    db = SessionLocal()
    try:
        media_dir = Path(__file__).parent / "media"
        
        # Find all png and jpg files in media_dir
        image_files = list(media_dir.glob("*.png")) + list(media_dir.glob("*.jpg")) + list(media_dir.glob("*.jpeg"))
        
        print(f"Found {len(image_files)} PNG/JPG files in media directory.")
        
        updates_db = 0
        processed = 0
        
        for img_path in image_files:
            old_filename = img_path.name
            new_filename = optimize_image_white_bg(str(img_path))
            
            if new_filename:
                processed += 1
                old_url = f"/media/{old_filename}"
                new_url = f"/media/{new_filename}"
                
                # Update DB Cakes
                cakes = db.query(models.Cake).filter(models.Cake.image_url == old_url).all()
                for c in cakes:
                    c.image_url = new_url
                    updates_db += 1
                    
                # Update DB CategoryMetadata
                cats = db.query(models.CategoryMetadata).filter(models.CategoryMetadata.image_url == old_url).all()
                for c in cats:
                    c.image_url = new_url
                    updates_db += 1
                    
                # Optionally delete old file to save space
                try:
                    os.remove(img_path)
                    print(f"Deleted original: {old_filename}")
                except Exception as e:
                    print(f"Failed to delete {old_filename}: {e}")
                    
        db.commit()
        print(f"Successfully processed {processed} images and updated {updates_db} database records.")
        
    finally:
        db.close()

if __name__ == "__main__":
    main()
