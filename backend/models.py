from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Float
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

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    orders = relationship("Order", back_populates="owner")

class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    customer_name = Column(String, nullable=True)
    customer_phone = Column(String, nullable=True)
    total_price = Column(Float)
    status = Column(String, default="pending")

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
