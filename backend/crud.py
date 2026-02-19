from typing import Optional
from sqlalchemy.orm import Session
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

def get_cakes(db: Session, skip: int = 0, limit: int = 100, category: Optional[str] = None):
    query = db.query(models.Cake)
    if category:
        query = query.filter(models.Cake.category == category)
    return query.order_by(models.Cake.id).offset(skip).limit(limit).all()

def create_cake(db: Session, cake: schemas.CakeCreate):
    db_cake = models.Cake(**cake.dict())
    db.add(db_cake)
    db.commit()
    db.refresh(db_cake)
    return db_cake

def create_order(db: Session, order: schemas.OrderCreate, user_id: Optional[int] = None):
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
    from datetime import datetime
    db_order = models.Order(
        user_id=user_id, 
        customer_name=order.customer_name,
        customer_phone=order.customer_phone,
        delivery_method=order.delivery_method,
        delivery_date=order.delivery_date,
        total_price=total_price, 
        status="pending", 
        created_at=datetime.utcnow()
    )
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

def get_orders(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None):
    from sqlalchemy.orm import joinedload
    query = db.query(models.Order).options(joinedload(models.Order.items).joinedload(models.OrderItem.cake))
    
    if status:
        query = query.filter(models.Order.status == status)
        
    return query.order_by(models.Order.id.desc()).offset(skip).limit(limit).all()

def update_order_status(db: Session, order_id: int, status: str):
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if db_order:
        db_order.status = status
        db.commit()
        db.refresh(db_order)
    return db_order

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
    from datetime import datetime
    db_order = models.Order(
        customer_name=order.customer_name, 
        customer_phone=order.customer_phone, 
        delivery_method=order.delivery_method,
        delivery_date=order.delivery_date,
        total_price=total_price, 
        status="pending",
        created_at=datetime.utcnow()
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
    db.refresh(db_order)
    
    return db_order


def update_cake(db: Session, cake_id: int, cake: schemas.CakeUpdate):
    db_cake = get_cake(db, cake_id)
    if not db_cake:
        return None
    
    cake_data = cake.dict(exclude_unset=True)
    for key, value in cake_data.items():
        setattr(db_cake, key, value)
    
    db.add(db_cake)
    db.commit()
    db.refresh(db_cake)
    return db_cake

# Page CRUD
def get_page(db: Session, page_id: int):
    return db.query(models.Page).filter(models.Page.id == page_id).first()

def get_page_by_route(db: Session, route_path: str):
    return db.query(models.Page).filter(models.Page.route_path == route_path).first()

def get_pages(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Page).offset(skip).limit(limit).all()

def create_page(db: Session, page: schemas.PageCreate):
    db_page = models.Page(**page.dict())
    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page

def update_page(db: Session, page_id: int, page: schemas.PageUpdate):
    db_page = get_page(db, page_id)
    if not db_page:
        return None
    
    page_data = page.dict(exclude_unset=True)
    for key, value in page_data.items():
        setattr(db_page, key, value)

    db.add(db_page)
    db.commit()
    db.refresh(db_page)
    return db_page

# Category Metadata CRUD
def get_category_metadata(db: Session, slug: str):
    return db.query(models.CategoryMetadata).filter(models.CategoryMetadata.slug == slug).first()

def get_all_category_metadata(db: Session):
    return db.query(models.CategoryMetadata).all()

def create_category_metadata(db: Session, metadata: schemas.CategoryMetadataCreate):
    db_metadata = models.CategoryMetadata(**metadata.dict())
    db.add(db_metadata)
    db.commit()
    db.refresh(db_metadata)
    return db_metadata

def update_category_metadata(db: Session, slug: str, metadata: schemas.CategoryMetadataUpdate):
    db_metadata = get_category_metadata(db, slug)
    if not db_metadata:
        # Auto-create if not exists
        db_metadata = models.CategoryMetadata(slug=slug, **metadata.dict(exclude_unset=True))
        db.add(db_metadata)
    else:
        metadata_data = metadata.dict(exclude_unset=True)
        for key, value in metadata_data.items():
            setattr(db_metadata, key, value)
    
    db.commit()
    db.refresh(db_metadata)
    return db_metadata
