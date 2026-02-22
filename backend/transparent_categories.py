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
        tolerance = 230
        
        # Create a mask where pixels are white-ish
        r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
        white_mask = (r >= tolerance) & (g >= tolerance) & (b >= tolerance)
        
        # Set alpha to 0 for white pixels
        data[:,:,3][white_mask] = 0
        
        # Create new image from the modified array
        new_img = Image.fromarray(data)
        
        max_size = (800, 800) # Slightly smaller max size for category thumbnails
        new_img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save to WebP
        new_filename = img_path.stem + "_trans.webp"
        new_path = img_path.parent / new_filename
        
        # Overwrite if exists
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
        categories = db.query(models.CategoryMetadata).all()
        
        processed = 0
        updates_db = 0
        
        for cat in categories:
            if cat.image_url and cat.image_url.startswith("/media/"):
                # E.g. /media/55719d10-53ab-4322-b816-12c342cb58da.webp
                filename = cat.image_url.split("/")[-1]
                img_path = media_dir / filename
                
                # Check if file exists, then process
                if img_path.exists():
                    new_filename = remove_white_background(str(img_path))
                    
                    if new_filename:
                        processed += 1
                        new_url = f"/media/{new_filename}"
                        
                        # Update DB CategoryMetadata
                        cat.image_url = new_url
                        updates_db += 1
                        
                        # We won't delete the original in case it's used elsewhere (like Home Hero)
                        # unless we strictly want to replace all
        
        db.commit()
        print(f"Successfully processed {processed} category images and updated {updates_db} DB records.")
        
    finally:
        db.close()

if __name__ == "__main__":
    main()
