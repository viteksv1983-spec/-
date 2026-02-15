import os
import requests
import shutil

# Ensure the directory exists
IMAGES_DIR = "static/images"
os.makedirs(IMAGES_DIR, exist_ok=True)

# List of images to download (using the URLs from seed.py)
image_urls = {
    "napoleon.jpg": "https://loremflickr.com/800/800/napoleon,cake",
    "medovik.jpg": "https://loremflickr.com/800/800/honey,cake",
    "red_velvet.jpg": "https://loremflickr.com/800/800/redvelvet,cake",
    "esterhazi.jpg": "https://loremflickr.com/800/800/almond,cake",
    "truffle.jpg": "https://loremflickr.com/800/800/chocolate,truffle",
    "cherry.jpg": "https://loremflickr.com/800/800/cherry,cake",
    "kyivskyi.jpg": "https://loremflickr.com/800/800/meringue,cake",
    "prague.jpg": "https://loremflickr.com/800/800/chocolate,cake",
    "cheesecake.jpg": "https://loremflickr.com/800/800/cheesecake",
    "tiramisu.jpg": "https://loremflickr.com/800/800/tiramisu",
    "snickers.jpg": "https://loremflickr.com/800/800/snickers,cake",
    "fruit.jpg": "https://loremflickr.com/800/800/fruit,cake"
}

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def download_images():
    print("Starting image downloads...")
    for filename, url in image_urls.items():
        file_path = os.path.join(IMAGES_DIR, filename)
        try:
            response = requests.get(url, headers=headers, stream=True)
            if response.status_code == 200:
                with open(file_path, 'wb') as f:
                    response.raw.decode_content = True
                    shutil.copyfileobj(response.raw, f)
                print(f"Successfully downloaded: {filename}")
            else:
                print(f"Failed to download {filename}: Status {response.status_code}")
        except Exception as e:
            print(f"Error downloading {filename}: {e}")

if __name__ == "__main__":
    download_images()
