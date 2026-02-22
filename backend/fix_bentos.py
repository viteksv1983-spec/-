import os
import sys
from PIL import Image

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal
from backend.models import Cake

STATIC_DIR = os.path.join(os.path.dirname(__file__), "static", "images", "cakes")

def fix_image(input_path, output_path):
    if not os.path.exists(input_path):
        print(f"File not found: {input_path}")
        return False
    
    img = Image.open(input_path)
    # Composite white background for transparent images
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        background = Image.new("RGB", img.size, (255, 255, 255))
        background.paste(img, mask=img.split()[3]) 
        img = background
    else:
        img = img.convert("RGB")
        
    img.thumbnail((800, 800), Image.Resampling.LANCZOS)
    img.save(output_path, "WEBP", quality=80, optimize=True)
    return True

BENTO_IMAGES = [
    "/static/images/bento_1.png",
    "/static/images/bento_2.png",
    "/static/images/bento_3.png",
    "/static/images/bento_4.jpg",
    "/static/images/bento_5.jpg",
    "/static/images/bento_6.jpg",
    "/static/images/bento_7.jpg",
    "/static/images/bento_8.jpg",
    "/static/images/bento_9.jpg",
    "/static/images/bento_10.jpg",
    "/static/images/bento_11.jpg",
    "/static/images/bento_12.jpg"
]

def main():
    db = SessionLocal()
    bentos = db.query(Cake).filter(Cake.category=='bento').order_by(Cake.id).all()

    for i, cake in enumerate(bentos):
        if i < len(BENTO_IMAGES):
            # Paths inside the backend directory
            original = os.path.join(os.path.dirname(__file__), BENTO_IMAGES[i].lstrip('/'))
            webp = os.path.join(STATIC_DIR, f"{cake.id}.webp")
            print(f"Fixing ID {cake.id} using original file: {original}")
            success = fix_image(original, webp)
            if success:
                print(f" -> Fixed & overwritten {webp}")

    print("Done fixing bentos!")

if __name__ == "__main__":
    main()
