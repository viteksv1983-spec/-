import requests
import os

URLS = [
    "https://upload.wikimedia.org/wikipedia/commons/4/4e/Kiev_cake.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/d/d3/Kiev_cake_slice.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/e/e6/Kyiv_cake.jpg"
]

DEST = r"C:\Users\Виктор\Desktop\интернет магазин торты\backend\static\images\kyivskyi.jpg"

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def download():
    for url in URLS:
        try:
            print(f"Trying {url}...")
            response = requests.get(url, headers=headers, stream=True, timeout=5)
            if response.status_code == 200:
                with open(DEST, 'wb') as f:
                    for chunk in response.iter_content(1024):
                        f.write(chunk)
                print(f"Success! Downloaded to {DEST}")
                return
            else:
                print(f"Failed: {response.status_code}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    download()
