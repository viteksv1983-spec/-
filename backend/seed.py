import sys
import os

# Add project root to sys.path to resolve 'backend' package
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from backend import crud, models, schemas
from backend.database import SessionLocal, engine
from backend.migrate_slugs import generate_slug

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
        db.commit()
        print("Existing data cleared.")
    except Exception as e:
        print(f"Error clearing data: {e}")
        db.rollback()
        return

    # Create default admin if not exists
    print("Checking for admin user...")
    if not crud.get_user_by_email(db, "admin"):
        print("Creating default admin user...")
        admin_user = schemas.UserCreate(
            email="admin",
            password="admin"
        )
        crud.create_user(db, admin_user)
        print("Default admin created: admin/admin")

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
            "name_prefix": "Торт бенто",
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
        },
        # --- Seasonal / Holiday Categories ---
        "birthday": {
            "name_prefix": "Торт на День народження",
            "description": "Святковий торт з яскравим декором для вашого свята.",
            "price_range": (700, 1500),
            "weight": 2000,
            "ingredients": "Натуральні інгредієнти, святковий декор",
            "shelf_life": "72 години"
        },
        "anniversary": {
            "name_prefix": "Торт на ювілей",
            "description": "Вишуканий торт для значущої дати.",
            "price_range": (1000, 2500),
            "weight": 3000,
            "ingredients": "Преміум склад, елегантний декор",
            "shelf_life": "72 години"
        },
        "kids": {
            "name_prefix": "Дитячий торт",
            "description": "Веселий торт з улюбленими героями.",
            "price_range": (800, 1800),
            "weight": 2500,
            "ingredients": "Тільки натуральні барвники та продукти",
            "shelf_life": "48 годин"
        },
        "boy": {
            "name_prefix": "Торт для хлопчика",
            "description": "Торт у синіх та блакитних тонах з машинками або героями.",
            "price_range": (800, 1800),
            "weight": 2500,
            "ingredients": "Натуральний склад",
            "shelf_life": "48 годин"
        },
        "girl": {
            "name_prefix": "Торт для дівчинки",
            "description": "Ніжний рожевий торт з принцесами або квітами.",
            "price_range": (800, 1800),
            "weight": 2500,
            "ingredients": "Натуральний склад",
            "shelf_life": "48 годин"
        },
        "for-women": {
            "name_prefix": "Торт для жінок",
            "description": "Елегантний торт з квітами та витонченим смаком.",
            "price_range": (900, 2000),
            "weight": 2500,
            "ingredients": "Натуральні вершки, ягоди, квіти",
            "shelf_life": "72 години"
        },
        "for-men": {
            "name_prefix": "Торт для чоловіків",
            "description": "Стильний торт у темних тонах з лаконічним декором.",
            "price_range": (900, 2200),
            "weight": 2500,
            "ingredients": "Бельгійський шоколад, віскі, горіхи",
            "shelf_life": "72 години"
        },
        "patriotic": {
            "name_prefix": "Патріотичний торт",
            "description": "Торт у національних кольорах.",
            "price_range": (700, 1500),
            "weight": 2000,
            "ingredients": "Натуральний склад",
            "shelf_life": "72 години"
        },
        "professional": {
            "name_prefix": "Професійне свято",
            "description": "Торт з тематичним декором до вашої професії.",
            "price_range": (800, 1800),
            "weight": 2500,
            "ingredients": "Натуральний склад",
            "shelf_life": "72 години"
        },
        "gender-reveal": {
            "name_prefix": "Торт Gender Reveal",
            "description": "Торт, який розкриє головний секрет!",
            "price_range": (1000, 2000),
            "weight": 2500,
            "ingredients": "Сюрприз всередині (рожевий або блакитний)",
            "shelf_life": "48 годин"
        },
        "hobby": {
            "name_prefix": "Торт за хобі",
            "description": "Торт, що відображає ваші захоплення.",
            "price_range": (900, 2500),
            "weight": 3000,
            "ingredients": "Натуральний склад, індивідуальний декор",
            "shelf_life": "72 години"
        },
        "corporate": {
            "name_prefix": "Корпоративний торт",
            "description": "Великий торт з логотипом компанії.",
            "price_range": (2000, 10000),
            "weight": 5000,
            "ingredients": "Натуральний склад",
            "shelf_life": "72 години"
        },
        "christening": {
            "name_prefix": "Торт на Хрестини",
            "description": "Ніжний ангельський торт для особливого обряду.",
            "price_range": (1000, 2500),
            "weight": 3000,
            "ingredients": "Легкі начинки, мастичний декор",
            "shelf_life": "48 годин"
        },
        "seasonal": {
            "name_prefix": "Сезонний торт",
            "description": "Торт до свята за сезоном (Новий Рік, Великдень тощо).",
            "price_range": (600, 1500),
            "weight": 1500,
            "ingredients": "Сезонні фрукти та декор",
            "shelf_life": "72 години"
        },
        "photo-cakes": {
            "name_prefix": "Фото-торт",
            "description": "Торт з вашим улюбленим фото на цукровому папері.",
            "price_range": (800, 1800),
            "weight": 2000,
            "ingredients": "Цукровий друк, натуральний крем",
            "shelf_life": "48 годин"
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

    # Predefined Bento Products for high-quality restoration
    BENTO_PRODUCTS = [
        {"name": "Бенто 'Love Story'", "image": "/static/images/bento_1.png", "desc": "Ніжний тортик для закоханих з індивідуальним написом."},
        {"name": "Бенто 'Happy Birthday'", "image": "/static/images/bento_2.png", "desc": "Святковий дизайн для незабутнього дня народження."},
        {"name": "Бенто 'Милий Котик'", "image": "/static/images/bento_3.png", "desc": "Милий малюнок котика, що дарує посмішку."},
        {"name": "Бенто 'Весняний Сад'", "image": "/static/images/bento_4.jpg", "desc": "Вишуканий декор з весняними квітами та зеленню."},
        {"name": "Бенто 'Зоряне Небо'", "image": "/static/images/bento_5.jpg", "desc": "Глибокий синій колір з золотистими зірками."},
        {"name": "Бенто 'Рожева Мрія'", "image": "/static/images/bento_6.jpg", "desc": "Повітряний рожевий крем та перлинний декор."},
        {"name": "Бенто 'Шоколадний Бум'", "image": "/static/images/bento_7.jpg", "desc": "Насичений шоколадний смак для справжніх гурманів."},
        {"name": "Бенто 'Мінімалізм'", "image": "/static/images/bento_8.jpg", "desc": "Лаконічний дизайн у пастельних тонах."},
        {"name": "Бенто 'Ягідна Насолода'", "image": "/static/images/bento_9.jpg", "desc": "Свіжі ягоди та легкий вершковий крем."},
        {"name": "Бенто 'Teddy Bear'", "image": "/static/images/bento_10.jpg", "desc": "Чарівний ведмедик для найменших іменинників."},
        {"name": "Бенто 'Золота Класика'", "image": "/static/images/bento_11.jpg", "desc": "Елегантний дизайн з золотим поталом."},
        {"name": "Бенто 'Сюрприз'", "image": "/static/images/bento_12.jpg", "desc": "Тортик, що розповість про ваші почуття без слів."}
    ]

    cakes = []
    scraped_index = 0
    for category_key, details in categories.items():
        print(f"Generating items for {category_key}...")
        
        # Special handling for Bento to restore the user's preferred set
        if category_key == "bento":
            for i, bento in enumerate(BENTO_PRODUCTS):
                base_slug = generate_slug(bento["name"], "bento")
                slug = base_slug
                counter = 1
                while any(c.slug == slug for c in cakes):
                    slug = f"{base_slug}-{counter}"
                    counter += 1
                
                cake = schemas.CakeCreate(
                    name=bento["name"],
                    description=bento["desc"],
                    price=float(random.randint(450, 550)),
                    image_url=bento["image"],
                    is_available=True,
                    slug=slug,
                    weight=450.0,
                    ingredients="Бісквіт, крем-чіз, фруктова начинка",
                    shelf_life="48 годин",
                    category="bento"
                )
                cakes.append(cake)
            continue

        for i in range(1, 13):
            # Generate a slightly random price
            base_price = random.randint(details["price_range"][0], details["price_range"][1])
            price = float(base_price - (base_price % 10)) # Round to nearest 10
            
            # Prioritize scraped images if available (except for bento which is handled above)
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

            name = f"{details['name_prefix']} #{i}"
            base_slug = generate_slug(name, category_key)
            slug = base_slug
            counter = 1
            while any(c.slug == slug for c in cakes):
                slug = f"{base_slug}-{counter}"
                counter += 1

            cake = schemas.CakeCreate(
                name=name,
                description=description,
                price=price,
                image_url=image_url,
                is_available=True,
                slug=slug,
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
    
    # --- Seed Category Metadata (only if table is empty) ---
    existing_meta_count = db.query(models.CategoryMetadata).count()
    if existing_meta_count > 0:
        print(f"Category metadata already has {existing_meta_count} entries — SKIPPING (preserving admin-uploaded images).")
    else:
        print("Seeding category metadata (first time)...")
        initial_images = {
            "birthday": "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800",
            "anniversary": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800",
            "kids": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800",
            "boy": "https://images.unsplash.com/photo-1525124541374-b7eaf79d0dbf?auto=format&fit=crop&q=80&w=800",
            "girl": "https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&q=80&w=800",
            "wedding": "https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&q=80&w=800",
            "for-women": "https://images.unsplash.com/photo-1535254973040-607b474cb50d?auto=format&fit=crop&q=80&w=800",
            "for-men": "https://images.unsplash.com/photo-1622621746654-20ecb790757d?auto=format&fit=crop&q=80&w=800",
            "patriotic": "https://images.unsplash.com/photo-1517260911058-0fcfd733702f?auto=format&fit=crop&q=80&w=800",
            "professional": "https://images.unsplash.com/photo-1542826438-bd32f43d626f?auto=format&fit=crop&q=80&w=800",
            "gender-reveal": "https://images.unsplash.com/photo-1519340333755-56e9c1d04579?auto=format&fit=crop&q=80&w=800",
            "hobby": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800",
            "corporate": "https://images.unsplash.com/photo-1550617931-e17a7b70dce2?auto=format&fit=crop&q=80&w=800",
            "christening": "https://images.unsplash.com/photo-1627916607164-7b20241db935?auto=format&fit=crop&q=80&w=800",
            "seasonal": "https://images.unsplash.com/photo-1512484776495-a09d92e87c3b?auto=format&fit=crop&q=80&w=800",
            "photo-cakes": "https://images.unsplash.com/photo-1558961359-1d9c29c5094f?auto=format&fit=crop&q=80&w=800",
            "bento": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/Child/FruttiMango/FruttiMango_Icon-562x429.jpg",
            "biscuit": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/Milk%20Cream/RedVelvet/RedVelvet_icon-562x429.jpg",
            "mousse": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/SER%IA%20VELVET/Velvet%20Cherry/velvet%20cherry-562x429.jpg",
            "cupcakes": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/PORTC%JN?/Medovuk/Medovuk_porc_Icon-562x429.jpg",
            "gingerbread": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/KARTONNA%20UPAKOVKA/Tof?/tofi-562x429.jpg"
        }

        for slug, img_url in initial_images.items():
            meta = models.CategoryMetadata(slug=slug, image_url=img_url)
            db.add(meta)
        
        db.commit()
        print("Category metadata seeded!")
    db.close()

if __name__ == "__main__":
    seed_data()
