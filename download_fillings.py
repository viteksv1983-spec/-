
import os
import requests
import json

fillings = [
    {
        "id": "blueberry-orange",
        "name": "Чорнично-апельсинова",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2023/11/1-optimized.png"
    },
    {
        "id": "coconut",
        "name": "Кокосова",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2023/03/zobrazhennya_viber_2023-03-01_14-29-11-593_111novyj-razmer-1-optimized.jpg"
    },
    {
        "id": "strawberry-basil",
        "name": "Полунично-базилікова",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2023/03/1677582858527_novyj-razmer-1-optimized.jpg"
    },
    {
        "id": "lavender",
        "name": "Лавандова",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2023/03/zobrazhennya_viber_2023-03-01_13-58-08-067_11111novyj-razmer-optimized.jpg"
    },
    {
        "id": "milk-girl",
        "name": "Молочна дівчинка",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2023/03/1679042256820_11novyj-razmer-optimized.jpg"
    },
    {
        "id": "forest-berries",
        "name": "Лісові ягоди",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2023/03/1679041660840-optimized.jpg"
    },
    {
        "id": "cherry-paradise",
        "name": "Вишневий рай",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2023/03/1677582944421_11111novyj-razmer-1-optimized.jpg"
    },
    {
        "id": "mango-pineapple",
        "name": "Маракуйя-ананас",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2023/03/1677580083087_novyj-razmer-optimized.jpg"
    },
    {
        "id": "apricot",
        "name": "Абрикосова",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2025/05/abrikos-optimized.jpg"
    },
    {
        "id": "pear",
        "name": "Грушева",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2018/10/photo-4-scaled-optimized.jpg"
    },
    {
        "id": "chocolate-blueberry",
        "name": "Шоколадно-чорнична",
        "image": "https://cake.shoko.com.ua/wp-content/uploads/2018/10/Tort-Shokoladno-chorchnij-2-optimized.jpg"
    }
]

output_dir = 'backend/static/images/fillings'
os.makedirs(output_dir, exist_ok=True)

mapping = {}

for item in fillings:
    url = item['image']
    ext = url.split('.')[-1]
    filename = f"{item['id']}.{ext}"
    filepath = os.path.join(output_dir, filename)
    
    try:
        response = requests.get(url, stream=True)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
            print(f"Downloaded {item['name']} to {filepath}")
            mapping[item['id']] = f"/static/images/fillings/{filename}"
        else:
            print(f"Failed to download {url}: Status {response.status_code}")
    except Exception as e:
        print(f"Error downloading {url}: {e}")

print("Done. Copy the mapping below:")
print(json.dumps(mapping, indent=2))
