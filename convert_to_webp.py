"""Convert all large PNG assets to WebP for massive size reduction."""
from PIL import Image
import os

ASSETS_DIR = os.path.join('frontend', 'src', 'assets')
QUALITY = 80  # WebP quality (80 = excellent quality, much smaller)

files_to_convert = [
    'logo.png',
    'hero-banner.png',
    'category-bento.png',
    'category-biscuit.png',
    'category-mousse.png',
    'transparent-hero-cake.png',
    'mobile_hero_bg.png',
]

for filename in files_to_convert:
    src = os.path.join(ASSETS_DIR, filename)
    if not os.path.exists(src):
        print(f"  SKIP: {filename} not found")
        continue
    
    dst = os.path.join(ASSETS_DIR, filename.replace('.png', '.webp'))
    
    old_size = os.path.getsize(src) / 1024
    
    img = Image.open(src)
    # Convert RGBA to RGBA WebP (preserves transparency)
    img.save(dst, 'WEBP', quality=QUALITY, method=6)
    
    new_size = os.path.getsize(dst) / 1024
    savings = ((old_size - new_size) / old_size) * 100
    
    print(f"  {filename}: {old_size:.0f}KB -> {new_size:.0f}KB ({savings:.0f}% smaller)")

print("\nDone! Now update imports in components.")
