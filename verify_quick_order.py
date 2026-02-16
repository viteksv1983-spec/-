from backend.database import SessionLocal
from backend import models
from sqlalchemy import desc

def verify_latest_order():
    db = SessionLocal()
    try:
        order = db.query(models.Order).order_by(desc(models.Order.id)).first()
        if order:
            print(f"Latest Order: ID={order.id}, Name={order.customer_name}, Phone={order.customer_phone}, Status={order.status}")
            return order
        else:
            print("No orders found.")
            return None
    finally:
        db.close()

if __name__ == "__main__":
    verify_latest_order()
