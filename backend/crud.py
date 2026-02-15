from sqlalchemy.orm import Session
import models
import schemas
import auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_cake(db: Session, cake_id: int):
    return db.query(models.Cake).filter(models.Cake.id == cake_id).first()

def get_cakes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Cake).offset(skip).limit(limit).all()

def create_cake(db: Session, cake: schemas.CakeCreate):
    db_cake = models.Cake(**cake.dict())
    db.add(db_cake)
    db.commit()
    db.refresh(db_cake)
    return db_cake

def create_order(db: Session, order: schemas.OrderCreate):
    # Calculate total price and validate cakes
    total_price = 0.0
    db_items = []
    
    for item in order.items:
        cake = get_cake(db, item.cake_id)
        if not cake:
            # In a real app, raise HTTPException here or handle gracefully
            continue 
        total_price += cake.price * item.quantity
        db_items.append(models.OrderItem(cake_id=item.cake_id, quantity=item.quantity))

    # Create Order
    db_order = models.Order(user_id=order.user_id, total_price=total_price, status="pending")
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    
    # Associate items with order
    for db_item in db_items:
        db_item.order_id = db_order.id
        db.add(db_item)
    
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Order).offset(skip).limit(limit).all()
