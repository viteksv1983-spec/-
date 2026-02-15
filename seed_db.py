from sqlalchemy.orm import Session
from backend.database import SessionLocal, engine
from backend import models

db = SessionLocal()

def seed_data():
    # Check if data exists
    if db.query(models.Cake).count() > 0:
        print("Database already seeded.")
        return

    cakes = [
        models.Cake(
            name="Chocolate Fudge Paradise",
            description="Rich chocolate layers with fudge frosting and dark chocolate shavings.",
            price=45.00,
            image_url="https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            is_available=True
        ),
        models.Cake(
            name="Vanilla Bean Dream",
            description="Classic vanilla sponge with madagascar vanilla bean buttercream.",
            price=35.00,
            image_url="https://images.unsplash.com/photo-1565239454153-61b6c7f46219?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            is_available=True
        ),
        models.Cake(
            name="Red Velvet Royal",
            description="Velvety red cake with cream cheese frosting and silver sprinkles.",
            price=50.00,
            image_url="https://images.unsplash.com/photo-1586788680434-30d32443f858?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            is_available=True
        ),
        models.Cake(
            name="Lemon Zest Delight",
            description="Zesty lemon cake with lemon curd filling and meringue topping.",
            price=38.00,
            image_url="https://images.unsplash.com/photo-1519340333755-56e9c1d04579?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            is_available=True
        ),
        models.Cake(
            name="Strawberry Fields",
            description="Fresh strawberry cake with whipped cream and fresh berries.",
            price=42.00,
            image_url="https://images.unsplash.com/photo-1611293388250-580b08c1714f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            is_available=True
        ),
        models.Cake(
            name="Caramel Crunch",
            description="Caramel sponge with salted caramel sauce and honeycomb crunch.",
            price=48.00,
            image_url="https://images.unsplash.com/photo-1535141192574-5d4897c12636?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
            is_available=True
        ),
    ]

    for cake in cakes:
        db.add(cake)
    
    db.commit()
    print("Seeded 6 cakes successfully!")

if __name__ == "__main__":
    seed_data()
    db.close()
