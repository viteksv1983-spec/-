from backend import models
from backend import schemas
from backend import auth

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
        total_price += cake.price * item.quantity # Note: In a real app we would recalculate based on weight here too
        db_items.append(models.OrderItem(cake_id=item.cake_id, quantity=item.quantity, flavor=item.flavor, weight=item.weight))

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

    return db.query(models.Order).offset(skip).limit(limit).all()

def create_quick_order(db: Session, order: schemas.QuickOrderCreate):
    # Fetch cake to get price
    cake = get_cake(db, order.cake_id)
    if not cake:
        return None
    
    # Calculate total price (simplified for quick order, assuming base price * quantity)
    # In a real scenario, weight would factor in if it differs from base.
    # For now, let's assume price is per item or calculate if weight is provided.
    price = cake.price
    if order.weight:
        # If weight is provided, we might need logic to calculate price based on weight
        # For this MVP, let's just use the cake price * quantity
        pass
        
    total_price = price * order.quantity

    # Create Order
    db_order = models.Order(
        customer_name=order.customer_name, 
        customer_phone=order.customer_phone, 
        total_price=total_price, 
        status="pending"
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order)

    # Create OrderItem
    db_item = models.OrderItem(
        order_id=db_order.id,
        cake_id=order.cake_id,
        quantity=order.quantity,
        flavor=order.flavor,
        weight=order.weight
    )
    db.add(db_item)
    db.commit()
    
    return db_order

