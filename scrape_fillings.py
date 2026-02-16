import requests
from bs4 import BeautifulSoup
import os

url = 'https://cake.shoko.com.ua/nachinki/'
response = requests.get(url)
soup = BeautifulSoup(response.text, 'html.parser')

# Create directory
output_dir = 'backend/static/images/fillings'
os.makedirs(output_dir, exist_ok=True)

# Find all nachinki items
# Let's print the classes of all divs to find the right one
divs = soup.find_all('div')
for d in divs:
    if d.get('class') and any('nachin' in c.lower() for c in d.get('class')):
        print(f"Found div with class: {d.get('class')}")

# Try to find images and check their parents
imgs = soup.find_all('img')
for i, img in enumerate(imgs):
    src = img.get('src')
    if 'wp-content/uploads' in src:
        parent = img.parent
        # Try to find a title nearby
        title = "No Title"
        # Look at parent, grandparent...
        curr = parent
        for _ in range(5):
            if not curr: break
            t = curr.find(['h2', 'h3', 'h4', 'strong', 'b'])
            if t:
                title = t.text.strip()
                break
            curr = curr.parent
        print(f"Found image: {src} | Title: {title}")

import json
with open('fillings_data.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)
