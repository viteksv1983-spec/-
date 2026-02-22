import sys
import os
from pathlib import Path
from PIL import Image
import numpy as np

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal
from backend import models

def remove_white_background(img_path_str):
    img_path = Path(img_path_str)
    if not img_path.exists():
        print(f"File not found: {img_path}")
        return None
        
    try:
        img = Image.open(img_path)
        img = img.convert("RGBA")
        
        # Convert image to numpy array
        data = np.array(img)
        
        # Define what constitutes "white" (RGB values close to 255)
        # Using a tolerance of 230 to catch off-white compression artifacts
        tolerance = 230
        
        # Create a mask where pixels are white-ish
        r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
        white_mask = (r >= tolerance) & (g >= tolerance) & (b >= tolerance)
        
        # Set alpha to 0 for white pixels
        data[:,:,3][white_mask] = 0
        
        # Create new image from the modified array
        new_img = Image.fromarray(data)
        
        max_size = (1200, 1200)
        new_img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save to WebP
        new_filename = img_path.stem + ".webp"
        new_path = img_path.parent / new_filename
        new_img.save(new_path, "WEBP", quality=90, lossless=True)
        print(f"Made background transparent for: {new_filename}")
        
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
            new_filename = remove_white_background(str(img_path))
            
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
