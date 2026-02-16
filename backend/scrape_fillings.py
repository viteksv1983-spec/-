import requests
from bs4 import BeautifulSoup
import json

url = "https://cake.shoko.com.ua/nachinki/"
headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
}

try:
    response = requests.get(url, headers=headers)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')

    fillings = []
    
    # Target common image containers in WordPress (often used by Shoko)
    # They often use galleries or single image blocks
    blocks = soup.find_all('div', class_='wp-block-image')
    if not blocks:
        blocks = soup.find_all('figure', class_='wp-block-image')
    
    if blocks:
        for block in blocks:
            img = block.find('img')
            caption = block.find('figcaption')
            if img:
                src = img.get('src')
                # If no caption, try to find text below it
                text = caption.get_text(strip=True) if caption else ""
                if not text:
                    # Look for sibling text
                    sibling = block.find_next(['p', 'div', 'h3'])
                    if sibling:
                        text = sibling.get_text(strip=True)
                
                if src:
                    fillings.append({
                        "image": src if src.startswith('http') else f"https://cake.shoko.com.ua{src}",
                        "description": text
                    })
    
    # Fallback: All images with text nearby
    if not fillings:
        all_images = soup.find_all('img')
        for img in all_images:
            src = img.get('src')
            if not src or 'logo' in src.lower() or 'icon' in src.lower() or 'banner' in src.lower() or 'data:image' in src:
                continue
            
            # Find the closest text that isn't just one word
            parent = img.parent
            text = ""
            for _ in range(3):
                if parent:
                    text = parent.get_text(strip=True)
                    if len(text) > 30: break
                    parent = parent.parent
            
            if len(text) > 20:
                fillings.append({
                    "image": src if src.startswith('http') else f"https://cake.shoko.com.ua{src}",
                    "description": text
                })

    print(json.dumps(fillings, indent=2, ensure_ascii=False))

except Exception as e:
    print(f"Error: {e}")
