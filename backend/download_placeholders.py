import os
import requests
import shutil
import time

# Ensure the directory exists
IMAGES_DIR = "static/images"
os.makedirs(IMAGES_DIR, exist_ok=True)

categories = {
    "bento": ["bento,cake", "mini,cake", "korean,cake"],
    "biscuit": ["sponge,cake", "layer,cake", "birthday,cake"],
    "wedding": ["wedding,cake", "tiered,cake", "elegant,cake"],
    "mousse": ["mousse,cake", "mirror,glaze", "entremet"],
    "cupcakes": ["cupcake", "muffin", "frosting"],
    "gingerbread": ["gingerbread", "cookie", "royal,icing"]
}

def download_images():
    print("Starting image downloads...")
    for category, keywords in categories.items():
        print(f"Downloading images for category: {category}")
        for i in range(1, 13):
            filename = f"{category}_{i}.jpg"
            file_path = os.path.join(IMAGES_DIR, filename)
            
            # Use a random keyword from the list for variety
            keyword = keywords[i % len(keywords)]
            url = f"https://loremflickr.com/800/800/{keyword}?random={i}"
            
            try:
                print(f"Downloading {filename} from {url}...")
                response = requests.get(url, stream=True, timeout=10)
                if response.status_code == 200:
                    with open(file_path, 'wb') as f:
                        response.raw.decode_content = True
                        shutil.copyfileobj(response.raw, f)
                    print(f"Successfully downloaded: {filename}")
                else:
                    print(f"Failed to download {filename}: Status {response.status_code}")
                
            except Exception as e:
                print(f"Error downloading {filename}: {e}")
            
            # Be nice to the server (optional but good practice)
            # time.sleep(0.5)

if __name__ == "__main__":
    download_images()
