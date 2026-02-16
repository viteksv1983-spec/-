import os
import requests
import shutil

# Ensure the directory exists
IMAGES_DIR = "static/images"
os.makedirs(IMAGES_DIR, exist_ok=True)

# List of images to download
# Using loremflickr specific keywords to get relevant images
image_urls = {
    # Bento
    "bento_love.jpg": "https://loremflickr.com/800/800/cake,love",
    "bento_hb.jpg": "https://loremflickr.com/800/800/cake,birthday",
    "bento_cat.jpg": "https://loremflickr.com/800/800/cat,cake",
    
    # Biscuit
    "biscuit_berry.jpg": "https://loremflickr.com/800/800/berry,cake",
    "biscuit_choco.jpg": "https://loremflickr.com/800/800/chocolate,cake",
    "biscuit_pear.jpg": "https://loremflickr.com/800/800/pear,cake",

    # Wedding
    "wedding_classic.jpg": "https://loremflickr.com/800/800/wedding,cake",
    "wedding_rustic.jpg": "https://loremflickr.com/800/800/rustic,wedding,cake",

    # Mousse
    "mousse_3choco.jpg": "https://loremflickr.com/800/800/mousse,chocolate",
    "mousse_mango.jpg": "https://loremflickr.com/800/800/mango,cake",
    "mousse_heart.jpg": "https://loremflickr.com/800/800/heart,cake",

    # Cupcakes
    "cupcake_vanilla.jpg": "https://loremflickr.com/800/800/cupcake,vanilla",
    "cupcake_choco.jpg": "https://loremflickr.com/800/800/cupcake,chocolate",
    "cupcake_mix.jpg": "https://loremflickr.com/800/800/cupcakes",

    # Gingerbread
    "ginger_kids.jpg": "https://loremflickr.com/800/800/gingerbread,cookie",
    "ginger_card.jpg": "https://loremflickr.com/800/800/gingerbread",
    "ginger_hearts.jpg": "https://loremflickr.com/800/800/heart,cookie"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def download_images():
    print("Starting image downloads for new categories...")
    for filename, url in image_urls.items():
        file_path = os.path.join(IMAGES_DIR, filename)
        
        # Skip if already exists to avoid overwriting (optional, but good for speed)
        if os.path.exists(file_path):
            print(f"Skipping {filename} - already exists")
            continue

        try:
            print(f"Downloading {filename}...")
            response = requests.get(url, headers=headers, stream=True, timeout=10)
            if response.status_code == 200:
                with open(file_path, 'wb') as f:
                    response.raw.decode_content = True
                    shutil.copyfileobj(response.raw, f)
                print(f"Successfully downloaded: {filename}")
            else:
                print(f"Failed to download {filename}: Status {response.status_code}")
        except Exception as e:
            print(f"Error downloading {filename}: {e}")
    
    print("\nDownload process completed!")

if __name__ == "__main__":
    download_images()
