from sqlalchemy.orm import Session
from sqlalchemy import create_engine
from backend.database import SessionLocal, engine
from backend import models
import re
import unicodedata

# Словник для транслітерації (українська -> латиниця)
UKR_TO_LATIN = {
    'а': 'a', 'б': 'b', 'в': 'v', 'г': 'h', 'ґ': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
    'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k', 'л': 'l',
    'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
    'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '',
    'ю': 'yu', 'я': 'ya', "'": ""
}

def transliterate(text: str) -> str:
    text = text.lower()
    result = ""
    for char in text:
        if char in UKR_TO_LATIN:
            result += UKR_TO_LATIN[char]
        else:
            result += char
    return result

def generate_slug(name: str, category: str = None) -> str:
    # 1. Транслітерація
    text = transliterate(name)
    
    # 2. Видалення слова "торт" або "tort" якщо це доречно
    # (для спрощення міграції, поки просто прибираємо зайве)
    text = text.replace("торт", "").replace("tort", "")
    
    # 3. Заміна пробілів та спецсимволів на дефіси
    slug = re.sub(r'[^a-z0-9]+', '-', text)
    
    # 4. Видалення зайвих дефісів на початку і в кінці
    slug = slug.strip('-')
    
    # 5. Видалення подвійних дефісів
    slug = re.sub(r'-+', '-', slug)
    
    # Якщо після видалення слів рядок пустий (наприклад, торт називався "Торт")
    if not slug:
        slug = "cake"
        
    return slug

def migrate_slugs():
    db = SessionLocal()
    try:
        cakes = db.query(models.Cake).all()
        print(f"[{len(cakes)}] тортів знайдено для міграції.")
        
        for cake in cakes:
            if cake.slug:
                continue # Вже має slug
                
            base_slug = generate_slug(cake.name, cake.category)
            slug = base_slug
            
            # Перевірка на унікальність
            counter = 1
            while db.query(models.Cake).filter(models.Cake.slug == slug, models.Cake.id != cake.id).first():
                slug = f"{base_slug}-{counter}"
                counter += 1
                
            cake.slug = slug
            print(f"[{cake.id}] {cake.name} -> {cake.slug}")
            
        db.commit()
        print("Міграція успішно завершена!")
    except Exception as e:
        print(f"Помилка міграції: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    import time
    # Захист від блокування бази
    models.Base.metadata.create_all(bind=engine)
    migrate_slugs()
