import os
from PIL import Image

image_dir = "backend/static/images/facebook"
for filename in os.listdir(image_dir):
    if filename.endswith(".jpg"):
        path = os.path.join(image_dir, filename)
        try:
            with Image.open(path) as img:
                print(f"{filename}: {img.width}x{img.height}")
        except Exception as e:
            print(f"Error {filename}: {e}")
