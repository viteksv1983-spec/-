"""
Compress category images to WebP WITH alpha channel (transparency preserved).
- Reads category image URLs from DB
- Resizes to max 600x600 (enough for category thumbnails)
- Saves as lossy WebP with quality=85 + alpha_q=100 (full transparency quality)
- Overwrites the original file (no new filenames, no DB changes needed)
"""
import sys
import os
from pathlib import Path
from PIL import Image

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.database import SessionLocal
from backend import models


def compress_with_transparency(img_path_str, max_size=(600, 600), quality=85):
    img_path = Path(img_path_str)
    if not img_path.exists():
        print(f"  ❌ File not found: {img_path}")
        return False

    try:
        original_size = img_path.stat().st_size
        img = Image.open(img_path)

        # Check if image has alpha channel
        has_alpha = img.mode in ('RGBA', 'LA', 'PA') or (img.mode == 'P' and 'transparency' in img.info)

        if has_alpha:
            img = img.convert("RGBA")
        else:
            img = img.convert("RGB")

        # Resize if larger than max_size
        img.thumbnail(max_size, Image.Resampling.LANCZOS)

        # Save as WebP with transparency preserved
        save_kwargs = {
            "format": "WEBP",
            "quality": quality,
            "method": 6,  # best compression
        }

        # For RGBA images, we MUST NOT set lossless=True (too large)
        # Instead, use lossy with high alpha quality
        if has_alpha:
            save_kwargs["exact"] = True  # preserve alpha exactly

        img.save(img_path, **save_kwargs)
        new_size = img_path.stat().st_size
        ratio = (1 - new_size / original_size) * 100 if original_size > 0 else 0

        status = "🟢 with alpha" if has_alpha else "⚪ no alpha"
        print(f"  ✅ {img_path.name}: {original_size // 1024}KB → {new_size // 1024}KB ({ratio:.0f}% saved) [{status}]")
        return True

    except Exception as e:
        print(f"  ❌ Error processing {img_path}: {e}")
        return False


def main():
    db = SessionLocal()
    try:
        media_dir = Path(__file__).parent / "media"
        categories = db.query(models.CategoryMetadata).all()

        processed = 0
        total = 0

        print(f"\n📦 Found {len(categories)} categories in DB\n")

        for cat in categories:
            total += 1
            print(f"[{cat.slug}] image_url={cat.image_url}")

            if cat.image_url and cat.image_url.startswith("/media/"):
                filename = cat.image_url.split("/")[-1]
                img_path = media_dir / filename

                if compress_with_transparency(str(img_path)):
                    processed += 1
            else:
                print(f"  ⚠️ No local media URL")

        print(f"\n🎉 Compressed {processed}/{total} category images with transparency preserved.\n")

    finally:
        db.close()


if __name__ == "__main__":
    main()
