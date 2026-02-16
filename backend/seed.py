from sqlalchemy.orm import Session
from backend import crud, models, schemas
from backend.database import SessionLocal, engine

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def seed_data():
    db = SessionLocal()
    
    # Clear existing data to ensure fresh seed
    print("Clearing existing data...")
    try:
        db.query(models.OrderItem).delete()
        db.query(models.Order).delete()
        db.query(models.Cake).delete()
        db.commit()
        print("Existing data cleared.")
    except Exception as e:
        print(f"Error clearing data: {e}")
        db.rollback()
        return

    import json
    import os
    import random

    scraped_data = []
    scraped_json_path = os.path.join("backend", "scraped_products.json")
    
    if os.path.exists(scraped_json_path):
        with open(scraped_json_path, 'r', encoding='utf-8') as f:
            scraped_data = json.load(f)
            print(f"Loaded {len(scraped_data)} scraped items.")
    else:
        print("Warning: scraped_products.json not found. Using defaults.")

    categories = {
        "bento": {
            "name_prefix": "Бенто",
            "description": "Маленький тортик для двох. Ідеальний подарунок.",
            "price_range": (400, 550),
            "weight": 450,
            "ingredients": "Бісквіт, крем-чіз, фруктова начинка",
            "shelf_life": "48 годин"
        },
        "biscuit": {
            "name_prefix": "Бісквітний торт",
            "description": "Ніжний та вологий бісквітний торт з авторською начинкою.",
            "price_range": (800, 1200),
            "weight": 1500,
            "ingredients": "Бісквіт, вершковий крем, ганаш, фрукти",
            "shelf_life": "72 години"
        },
        "wedding": {
            "name_prefix": "Весільний торт",
            "description": "Розкішний торт для вашого особливого дня.",
            "price_range": (2500, 5000),
            "weight": 4000,
            "ingredients": "Індивідуально під замовлення",
            "shelf_life": "72 години"
        },
        "mousse": {
            "name_prefix": "Мусовий торт",
            "description": "Вишуканий мусовий десерт з дзеркальною глазур'ю або велюром.",
            "price_range": (900, 1400),
            "weight": 1100,
            "ingredients": "Мус, конфі, бісквіт, глазур",
            "shelf_life": "72 години"
        },
        "cupcakes": {
            "name_prefix": "Набір капкейків",
            "description": "Ароматні кекси з ніжною кремовою шапочкою.",
            "price_range": (400, 700),
            "weight": 350,
            "ingredients": "Борошно, масло, яйця, крем-чіз",
            "shelf_life": "48 годин"
        },
        "gingerbread": {
            "name_prefix": "Пряники",
            "description": "Запашні медово-імбирні пряники з ручним розписом.",
            "price_range": (150, 400),
            "weight": 200,
            "ingredients": "Мед, імбир, спеції, борошно, айсінг",
            "shelf_life": "90 днів",
            "images": [
                "https://vatsak.com.ua/image/cache/catalog/products/Tortu/KARTONNA%20UPAKOVKA/Tof?/tofi-562x429.jpg"
            ]
        }
    }

    # High quality official image mapping
    category_images = {
        "bento": ["https://vatsak.com.ua/image/cache/catalog/products/Tortu/Child/FruttiMango/FruttiMango_Icon-562x429.jpg"],
        "biscuit": ["https://vatsak.com.ua/image/cache/catalog/products/Tortu/Milk%20Cream/RedVelvet/RedVelvet_icon-562x429.jpg"],
        "wedding": ["https://vatsak.com.ua/image/cache/catalog/products/Tortu/SER?IA%20VELVET/Velvet%20Cherry/Velvet%20Redberry_main-562x429.png"],
        "mousse": ["https://vatsak.com.ua/image/cache/catalog/products/Tortu/SER?IA%20VELVET/Velvet%20Cherry/velvet%20cherry-562x429.jpg"],
        "cupcakes": ["https://vatsak.com.ua/image/cache/catalog/products/Tortu/PORTC?JN?/Medovuk/Medovuk_porc_Icon-562x429.jpg"],
        "gingerbread": ["https://vatsak.com.ua/image/cache/catalog/products/Tortu/KARTONNA%20UPAKOVKA/Tof?/tofi-562x429.jpg"]
    }

    cakes = []
    
    # Shuffle scraped data to distribute randomly across categories
    if scraped_data:
        random.shuffle(scraped_data)
    
    scraped_index = 0
    
    for category_key, details in categories.items():
        print(f"Generating items for {category_key}...")
        for i in range(1, 13):
            # Generate a slightly random price
            base_price = random.randint(details["price_range"][0], details["price_range"][1])
            price = float(base_price - (base_price % 10)) # Round to nearest 10
            
            # Prioritize scraped images if available
            if scraped_index < len(scraped_data):
                item = scraped_data[scraped_index]
                image_url = item["image_url"]
                # Use description from scraped data if it's not the generic "Нет описания фото"
                raw_desc = item.get("description", "")
                if "Нет описания фото" not in raw_desc and raw_desc:
                    description = f"{details['name_prefix']}. {raw_desc}"
                else:
                    description = f"{details['description']} Варіант No.{i}."
                scraped_index += 1
            else:
                # Fallback to category images
                images = category_images.get(category_key, ["/static/images/facebook/fb_product_1.jpg"])
                image_url = images[i % len(images)]
                description = f"{details['description']} Варіант No.{i}."

            cake = schemas.CakeCreate(
                name=f"{details['name_prefix']} #{i}",
                description=description,
                price=price,
                image_url=image_url,
                is_available=True,
                weight=float(details["weight"]),
                ingredients=details["ingredients"],
                shelf_life=details["shelf_life"],
                category=category_key
            )
            cakes.append(cake)

    for cake in cakes:
        print(f"Adding cake: {cake.name}")
        crud.create_cake(db=db, cake=cake)
    
    print(f"Database seeded successfully with {len(cakes)} items!")
    db.close()

if __name__ == "__main__":
    seed_data()
