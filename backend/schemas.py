from pydantic import BaseModel
from typing import List, Optional

class CakeBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_available: bool = True
    weight: Optional[float] = None
    ingredients: Optional[str] = None
    shelf_life: Optional[str] = None
    category: Optional[str] = None

class CakeCreate(CakeBase):
    pass

class Cake(CakeBase):
    id: int

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True
    orders: List["Order"] = []

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class OrderItemBase(BaseModel):
    cake_id: int
    quantity: int
    flavor: Optional[str] = None
    weight: Optional[float] = None

class OrderItemCreate(OrderItemBase):
    pass

class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    total_price: float = 0 # Calculated on server
    status: str = "pending"

class OrderCreate(BaseModel):
    # user_id: int # Removed because it's now inferred from token
    # But wait, if I remove it, I need to make sure frontend doesn't send it, or I instruct pydantic to ignore extra.
    # Actually, previous OrderCreate had items.
    items: List[OrderItemCreate]

class QuickOrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    cake_id: int
    quantity: int = 1
    flavor: Optional[str] = None
    weight: Optional[float] = None


class Order(OrderBase):
    id: int
    user_id: int
    items: List[OrderItem] = []

    class Config:
        from_attributes = True
