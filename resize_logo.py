import os
from PIL import Image

webp_path = "frontend/src/assets/logo.webp"
png_path = "frontend/public/logo.png"

def check_and_resize(path, max_height=300):
    if not os.path.exists(path):
        print(f"File not found: {path}")
        return
    img = Image.open(path)
    print(f"Original {path}: {img.size}, {os.path.getsize(path)/1024:.0f}KB")
    
    # Calculate new width to maintain aspect ratio
    width, height = img.size
    if height > max_height:
        new_height = max_height
        new_width = int((new_height / height) * width)
        print(f"Resizing to {new_width}x{new_height}")
        
        # High quality downsampling
        img_resized = img.resize((new_width, new_height), Image.Resampling.LANCZOS)
        
        # Save keeping original format
        if path.endswith('.webp'):
            img_resized.save(path, 'WEBP', quality=85, method=6, alpha_quality=100)
        else:
            img_resized.save(path, 'PNG', optimize=True)
            
        print(f"New size {path}: {os.path.getsize(path)/1024:.0f}KB")
    else:
        print(f"No resize needed for {path}")

check_and_resize(webp_path, max_height=200)
check_and_resize(png_path, max_height=200)
