import sys
import os
from datetime import datetime, timedelta

# Add project root to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend import crud, schemas, models
from backend.database import SessionLocal

def seed_test_orders():
    db = SessionLocal()
    try:
        # Get some cakes to link to orders
        cakes = db.query(models.Models_Cake).limit(3).all() if hasattr(models, 'Models_Cake') else db.query(models.Cake).limit(3).all()
        if not cakes:
            print("No cakes found in database. Please seed cakes first.")
            return

        test_data = [
            {
                "customer_name": "Іван Тестовий",
                "customer_phone": "+380501234567",
                "delivery_method": "pickup",
                "delivery_date": (datetime.now() + timedelta(days=2)).strftime("%Y-%m-%d"),
                "items": [
                    {"cake_id": cakes[0].id, "quantity": 1, "flavor": "Шоколадний", "weight": 2.0}
                ]
            },
            {
                "customer_name": "Марія Адмінівна",
                "customer_phone": "+380679876543",
                "delivery_method": "uklon",
                "delivery_date": (datetime.now() + timedelta(days=3)).strftime("%Y-%m-%d"),
                "items": [
                    {"cake_id": cakes[1].id, "quantity": 2, "flavor": "Ягідний", "weight": 1.5}
                ]
            }
        ]

        for data in test_data:
            # Create Order
            total_price = 0
            for item in data["items"]:
                cake = db.query(models.Cake).filter(models.Cake.id == item["cake_id"]).first()
                total_price += cake.price * item["quantity"]

            db_order = models.Order(
                customer_name=data["customer_name"],
                customer_phone=data["customer_phone"],
                delivery_method=data["delivery_method"],
                delivery_date=data["delivery_date"],
                total_price=total_price,
                status="pending",
                created_at=datetime.utcnow()
            )
            db.add(db_order)
            db.commit()
            db.refresh(db_order)

            # Create Items
            for item in data["items"]:
                db_item = models.OrderItem(
                    order_id=db_order.id,
                    cake_id=item["cake_id"],
                    quantity=item["quantity"],
                    flavor=item.get("flavor"),
                    weight=item.get("weight")
                )
                db.add(db_item)
            
            db.commit()
            print(f"Created order #{db_order.id} for {data['customer_name']}")

    except Exception as e:
        print(f"Error seeding orders: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_test_orders()
