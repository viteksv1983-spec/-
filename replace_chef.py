import sys
import os
from pathlib import Path
from PIL import Image

def optimize_chef_photo(input_path_str, output_path_str, max_dimension=800):
    input_path = Path(input_path_str)
    if not input_path.exists():
        print(f"File not found: {input_path}")
        return False
        
    try:
        img = Image.open(input_path)
        
        # Convert to RGB
        if img.mode != 'RGB':
            if img.mode in ('RGBA', 'LA') or (img.mode == 'P' and 'transparency' in img.info):
                background = Image.new('RGB', img.size, (255, 255, 255))
                background.paste(img, mask=img.split()[3])
                img = background
            else:
                img = img.convert('RGB')
        
        # Resize maintaining aspect ratio
        img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)
        
        os.makedirs(os.path.dirname(output_path_str), exist_ok=True)
        img.save(output_path_str, "WEBP", quality=85)
        print(f"Optimized chef photo saved to: {output_path_str}")
        
        return True
    except Exception as e:
        print(f"Error processing {input_path}: {e}")
        return False

if __name__ == "__main__":
    input_file = "C:/Users/Виктор/.gemini/antigravity/brain/f49bc0d3-4031-4caf-8726-fd699d1b4a8e/media__1771953370475.jpg"
    out_home = "frontend/public/images/confectioner.webp"
    out_about = "frontend/public/about/about_3.webp"
    
    optimize_chef_photo(input_file, out_home)
    optimize_chef_photo(input_file, out_about)
