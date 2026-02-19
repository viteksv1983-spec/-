import random
import os
from sqlalchemy.orm import Session
from backend import models, schemas, crud

def check_and_seed_data(db: Session):
    """
    Checks if the database is empty and seeds it if necessary.
    This is intended to run on backend startup in production.
    """
    # 1. Check if we have any cakes
    cake_count = db.query(models.Cake).count()
    if cake_count > 0:
        print(f"Database already has {cake_count} cakes. Skipping auto-seeding.")
        return

    print("Database is empty. Starting auto-seeding process...")

    # 2. Seed SEO Pages (Common logic)
    default_pages = [
        {"route_path": "/", "name": "Головна сторінка"},
        {"route_path": "/cakes", "name": "Каталог (Всі торти)"},
        {"route_path": "/cakes?category=bento", "name": "Категорія: Бенто тортики"},
        {"route_path": "/cakes?category=biscuit", "name": "Категорія: Бісквітні торти"},
        {"route_path": "/cakes?category=wedding", "name": "Категорія: Весільні торти"},
        {"route_path": "/cakes?category=mousse", "name": "Категорія: Мусові торти"},
        {"route_path": "/cakes?category=cupcakes", "name": "Категорія: Капкейки"},
        {"route_path": "/cakes?category=gingerbread", "name": "Категорія: Імбирні пряники"},
        {"route_path": "/fillings", "name": "Начинки"},
        {"route_path": "/delivery", "name": "Доставка та оплата"},
        {"route_path": "/about", "name": "Про нас"},
        {"route_path": "/gallery/photo", "name": "Фотогалерея"},
        {"route_path": "/gallery/video", "name": "Відеогалерея"},
        {"route_path": "/cart", "name": "Кошик"},
    ]
    for p in default_pages:
        if not crud.get_page_by_route(db, p["route_path"]):
            crud.create_page(db, schemas.PageCreate(**p))

    # 3. Seed Category Metadata
    initial_images = {
        "birthday": "https://images.unsplash.com/photo-1533777857889-4be7c70b33f7?auto=format&fit=crop&q=80&w=800",
        "anniversary": "https://images.unsplash.com/photo-1535141192574-5d4897c12636?auto=format&fit=crop&q=80&w=800",
        "kids": "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&q=80&w=800",
        "wedding": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/SER?IA%20VELVET/Velvet%20Cherry/Velvet%20Redberry_main-562x429.png",
        "bento": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/Child/FruttiMango/FruttiMango_Icon-562x429.jpg",
        "biscuit": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/Milk%20Cream/RedVelvet/RedVelvet_icon-562x429.jpg",
        "mousse": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/SER%IA%20VELVET/Velvet%20Cherry/velvet%20cherry-562x429.jpg",
        "cupcakes": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/PORTC%JN?/Medovuk/Medovuk_porc_Icon-562x429.jpg",
        "gingerbread": "https://vatsak.com.ua/image/cache/catalog/products/Tortu/KARTONNA%20UPAKOVKA/Tof?/tofi-562x429.jpg"
    }
    for slug, img_url in initial_images.items():
        if not crud.get_category_metadata(db, slug):
            db.add(models.CategoryMetadata(slug=slug, image_url=img_url))
    
    # 4. Seed Essential Cakes (Minimal set for instant WOW)
    categories_data = {
        "bento": ("Бенто", 450.0, 500.0, "https://vatsak.com.ua/image/cache/catalog/products/Tortu/Child/FruttiMango/FruttiMango_Icon-562x429.jpg"),
        "biscuit": ("Бісквітний", 1500.0, 1000.0, "https://vatsak.com.ua/image/cache/catalog/products/Tortu/Milk%20Cream/RedVelvet/RedVelvet_icon-562x429.jpg"),
        "mousse": ("Мусовий", 1100.0, 1200.0, "https://vatsak.com.ua/image/cache/catalog/products/Tortu/SER%IA%20VELVET/Velvet%20Cherry/velvet%20cherry-562x429.jpg"),
        "wedding": ("Весільний", 4000.0, 3500.0, "https://vatsak.com.ua/image/cache/catalog/products/Tortu/SER?IA%20VELVET/Velvet%20Cherry/Velvet%20Redberry_main-562x429.png"),
        "cupcakes": ("Капкейки", 350.0, 600.0, "https://vatsak.com.ua/image/cache/catalog/products/Tortu/PORTC%JN?/Medovuk/Medovuk_porc_Icon-562x429.jpg"),
        "gingerbread": ("Пряник", 200.0, 300.0, "https://vatsak.com.ua/image/cache/catalog/products/Tortu/KARTONNA%20UPAKOVKA/Tof?/tofi-562x429.jpg")
    }

    for cat_slug, (pref, weight, price, img) in categories_data.items():
        for i in range(1, 7): # Seed 6 cakes per category
            cake = schemas.CakeCreate(
                name=f"{pref} '{cat_slug.capitalize()} #{i}'",
                description=f"Найкращий {pref.lower()} для вашого свята. Тільки натуральні інгредієнти.",
                price=price + random.randint(-50, 50),
                image_url=img,
                is_available=True,
                weight=weight,
                ingredients="Преміум інгредієнти, свіжі ягоди, бельгійський шоколад",
                shelf_life="72 години",
                category=cat_slug
            )
            crud.create_cake(db, cake)

    db.commit()
    print("Auto-seeding completed successfully!")
