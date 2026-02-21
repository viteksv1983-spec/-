from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from backend.database import Base

class Cake(Base):
    __tablename__ = "cakes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    image_url = Column(String)
    is_available = Column(Boolean, default=True)
    weight = Column(Float, nullable=True)  # Вага в грамах
    ingredients = Column(String, nullable=True)  # Склад
    shelf_life = Column(String, nullable=True)  # Термін придатності
    category = Column(String, nullable=True)  # Категорія (порційний, цілий, святковий)

    # SEO Fields
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    meta_keywords = Column(String, nullable=True)
    h1_heading = Column(String, nullable=True)
    canonical_url = Column(String, nullable=True)
    og_title = Column(String, nullable=True)
    og_description = Column(String, nullable=True)
    og_image = Column(String, nullable=True)
    schema_json = Column(String, nullable=True)

class Page(Base):
    __tablename__ = "pages"

    id = Column(Integer, primary_key=True, index=True)
    route_path = Column(String, unique=True, index=True)  # e.g., "/", "/catalog"
    name = Column(String)  # internal name, e.g., "Home Page"
    
    # SEO Fields
    meta_title = Column(String, nullable=True)
    meta_description = Column(String, nullable=True)
    meta_keywords = Column(String, nullable=True)
    h1_heading = Column(String, nullable=True)
    canonical_url = Column(String, nullable=True)
    og_title = Column(String, nullable=True)
    og_description = Column(String, nullable=True)
    og_image = Column(String, nullable=True)
    schema_json = Column(String, nullable=True)
    
    content = Column(String, nullable=True)  # Rich text or JSON content
    content_images = Column(String, nullable=True)  # JSON list of image URLs

class CategoryMetadata(Base):
    __tablename__ = "category_metadata"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String, unique=True, index=True)
    image_url = Column(String, nullable=True)
    description = Column(String, nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    orders = relationship("Order", back_populates="owner")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    total_price = Column(Float)
    status = Column(String, default="pending")
    created_at = Column(DateTime(timezone=True), default=func.now)
    delivery_method = Column(String, nullable=True)  # "pickup" or "uklon"
    delivery_date = Column(String, nullable=True)    # e.g., "2026-02-18"

    owner = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    cake_id = Column(Integer, ForeignKey("cakes.id"))
    scale = Column(String, nullable=True)  # Placeholder in case needed for something else
    quantity = Column(Integer)
    flavor = Column(String, nullable=True)
    weight = Column(Float, nullable=True)  # Selected weight in kg (e.g., 1.5)

    order = relationship("Order", back_populates="items")
    cake = relationship("Cake")

class TelegramSettings(Base):
    __tablename__ = "telegram_settings"

    id = Column(Integer, primary_key=True, default=1)
    bot_token = Column(String, nullable=True)
    chat_id_1 = Column(String, nullable=True)
    label_1 = Column(String, nullable=True)
    is_active_1 = Column(Boolean, default=True)
    chat_id_2 = Column(String, nullable=True)
    label_2 = Column(String, nullable=True)
    is_active_2 = Column(Boolean, default=True)
    chat_id_3 = Column(String, nullable=True)
    label_3 = Column(String, nullable=True)
    is_active_3 = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
