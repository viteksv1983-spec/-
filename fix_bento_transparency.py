import sys
import os
import sqlite3
from pathlib import Path
from PIL import Image
import numpy as np

def fix_black_background(img_path_str):
    img_path = Path(img_path_str)
    if not img_path.exists():
        print(f"File not found: {img_path}")
        return False
        
    try:
        img = Image.open(img_path)
        img = img.convert("RGBA")
        
        # Convert image to numpy array
        data = np.array(img)
        
        # Define what constitutes "black" (RGB values close to 0)
        # Using a tolerance to catch near-black compression artifacts
        tolerance = 15
        
        # Create a mask where pixels are black-ish
        r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]
        black_mask = (r <= tolerance) & (g <= tolerance) & (b <= tolerance)
        
        # Determine if it actually has a lot of black background (at least 5% of image)
        black_ratio = np.sum(black_mask) / (data.shape[0] * data.shape[1])
        if black_ratio < 0.01:
            print(f"Skipping {img_path.name}: not enough black background ({black_ratio:.1%})")
            return False
            
        # Set alpha to 0 for black pixels
        data[:,:,3][black_mask] = 0
        
        # Create new image from the modified array
        new_img = Image.fromarray(data)
        
        # Resize/optimize size: max 600x600 for bento cakes is enough
        max_size = (600, 600)
        new_img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save back to WebP, preserving transparency
        new_img.save(img_path, "WEBP", quality=85, method=6, alpha_quality=100)
        
        print(f"Fixed black background and resized {img_path.name}. Black ratio: {black_ratio:.1%}")
        return True
        
    except Exception as e:
        print(f"Error processing {img_path}: {e}")
        return False

def main():
    db_path = 'backend/sql_app.db'
    conn = sqlite3.connect(db_path)
    c = conn.cursor()
    c.execute("SELECT image_url FROM cakes WHERE category='bento'")
    results = c.fetchall()
    
    for r in results:
        img_url = r[0]
        if img_url and img_url.startswith('/media/'):
            filename = img_url.split('/')[-1]
            filepath = os.path.join('backend', 'media', filename)
            fix_black_background(filepath)
            
if __name__ == "__main__":
    main()
