import os
import requests
import shutil

# Ensure directory exists
IMAGES_DIR = os.path.join(os.path.dirname(__file__), "static", "images")
os.makedirs(IMAGES_DIR, exist_ok=True)

# Data from seed.py
cookies_sweets = [
    ("cookie_choco_apricot", "https://images.unsplash.com/photo-1499636136210-65bd20fc5717?q=80&w=800&auto=format&fit=crop"),
    ("cookie_amerikaner", "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?q=80&w=800&auto=format&fit=crop"),
    ("cookie_vanilla", "https://images.unsplash.com/photo-1590080875515-8a3a8dc2fe0a?q=80&w=800&auto=format&fit=crop"),
    ("cookie_mushroom", "https://images.unsplash.com/photo-1511211042767-422204a3959c?q=80&w=800&auto=format&fit=crop"),
    ("cookie_caprice", "https://images.unsplash.com/photo-1481391243133-f96216dcb5d2?q=80&w=800&auto=format&fit=crop"),
    ("cookie_ring", "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800&auto=format&fit=crop"),
    ("cookie_creme_brulee", "https://images.unsplash.com/photo-1600431521340-491dea8809b1?q=80&w=800&auto=format&fit=crop"),
    ("cookie_kurabye", "https://images.unsplash.com/photo-1590080875515-8a3a8dc2fe0a?q=80&w=800&auto=format&fit=crop"),
    ("cookie_milk", "https://images.unsplash.com/photo-1627308595186-e6bb36712645?q=80&w=800&auto=format&fit=crop"),
    ("cookie_oatmeal", "https://images.unsplash.com/photo-1557089706-68d02dbda277?q=80&w=800&auto=format&fit=crop"),
    ("cookie_savoyardi", "https://images.unsplash.com/photo-1559620192-032c4bc4674e?q=80&w=800&auto=format&fit=crop"),
    ("cookie_apricot_roll", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop"),
    ("sweet_zephyr_vanilla", "https://images.unsplash.com/photo-1582298538104-fe2e74c27f59?q=80&w=800&auto=format&fit=crop"),
    ("sweet_zephyr_gold", "https://images.unsplash.com/photo-1599487488170-d11ec9c175f0?q=80&w=800&auto=format&fit=crop"),
    ("sweet_shu", "https://images.unsplash.com/photo-1570476922354-81227cdbb76c?q=80&w=800&auto=format&fit=crop"),
    ("sweet_jelly", "https://images.unsplash.com/photo-1559181567-c3190ca9959b?q=80&w=800&auto=format&fit=crop"),
    ("sweet_potato", "https://images.unsplash.com/photo-1629676705580-ef0c39f0322c?q=80&w=800&auto=format&fit=crop"),
    ("sweet_edem", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop"),
    ("sweet_lastivka", "https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop"),
    ("sweet_muffin", "https://images.unsplash.com/photo-1586788640451-bc015f60640f?q=80&w=800&auto=format&fit=crop"),
    ("sweet_cherry_roll", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop"),
    ("sweet_marble_cake", "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=800&auto=format&fit=crop"),
    ("sweet_sushka", "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?q=80&w=800&auto=format&fit=crop"),
    ("sweet_mohito", "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=800&auto=format&fit=crop")
]

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

def download():
    for name, url in cookies_sweets:
        path = os.path.join(IMAGES_DIR, f"{name}.jpg")
        if os.path.exists(path):
            print(f"Skipping {name}, already exists.")
            continue
        try:
            print(f"Downloading {name}...")
            r = requests.get(url, headers=headers, stream=True)
            if r.status_code == 200:
                with open(path, 'wb') as f:
                    shutil.copyfileobj(r.raw, f)
                print(f"Done: {name}")
            else:
                print(f"Failed status: {r.status_code}")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    download()
