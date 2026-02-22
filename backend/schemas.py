from datetime import datetime
from pydantic import BaseModel
from typing import List, Optional

class CakeBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    image_url: Optional[str] = None
    is_available: bool = True
    slug: Optional[str] = None
    updated_at: Optional[datetime] = None
    weight: Optional[float] = None
    ingredients: Optional[str] = None
    shelf_life: Optional[str] = None
    category: Optional[str] = None
    
    # SEO Fields
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    h1_heading: Optional[str] = None
    canonical_url: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    schema_json: Optional[str] = None

class PageBase(BaseModel):
    route_path: str
    name: str
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    h1_heading: Optional[str] = None
    canonical_url: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    schema_json: Optional[str] = None
    content: Optional[str] = None
    content_images: Optional[str] = None

class PageCreate(PageBase):
    pass

class PageUpdate(PageBase):
    route_path: Optional[str] = None
    name: Optional[str] = None

class Page(PageBase):
    id: int

    class Config:
        from_attributes = True

class CakeCreate(CakeBase):
    pass

class Cake(CakeBase):
    id: int
    slug: str

class CakeUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None
    is_available: Optional[bool] = None
    weight: Optional[float] = None
    ingredients: Optional[str] = None
    shelf_life: Optional[str] = None
    category: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    meta_keywords: Optional[str] = None
    h1_heading: Optional[str] = None
    canonical_url: Optional[str] = None
    og_title: Optional[str] = None
    og_description: Optional[str] = None
    og_image: Optional[str] = None
    schema_json: Optional[str] = None

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool = True
    is_admin: bool = False
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
    cake: Optional[Cake] = None

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    total_price: float = 0
    status: str = "pending"
    created_at: Optional[datetime] = None

class OrderCreate(BaseModel):
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    delivery_method: Optional[str] = None
    delivery_date: Optional[str] = None
    items: List[OrderItemCreate]

class QuickOrderCreate(BaseModel):
    customer_name: str
    customer_phone: str
    cake_id: int
    quantity: int = 1
    flavor: Optional[str] = None
    weight: Optional[float] = None
    delivery_method: Optional[str] = None
    delivery_date: Optional[str] = None


class Order(OrderBase):
    id: int
    user_id: Optional[int] = None
    customer_name: Optional[str] = None
    customer_phone: Optional[str] = None
    delivery_method: Optional[str] = None
    delivery_date: Optional[str] = None
    items: List[OrderItem] = []

    class Config:
        from_attributes = True

class CategoryMetadataBase(BaseModel):
    slug: str
    image_url: Optional[str] = None
    description: Optional[str] = None

class CategoryMetadataCreate(CategoryMetadataBase):
    pass

class CategoryMetadataUpdate(BaseModel):
    image_url: Optional[str] = None
    description: Optional[str] = None

class CategoryMetadata(CategoryMetadataBase):
    id: int

    class Config:
        from_attributes = True

class TelegramSettingsUpdate(BaseModel):
    bot_token: Optional[str] = None
    chat_id_1: Optional[str] = None
    label_1: Optional[str] = None
    is_active_1: Optional[bool] = None
    chat_id_2: Optional[str] = None
    label_2: Optional[str] = None
    is_active_2: Optional[bool] = None
    chat_id_3: Optional[str] = None
    label_3: Optional[str] = None
    is_active_3: Optional[bool] = None
    is_active: Optional[bool] = None

class TelegramSettings(BaseModel):
    id: int = 1
    bot_token: Optional[str] = None
    chat_id_1: Optional[str] = None
    label_1: Optional[str] = None
    is_active_1: bool = True
    chat_id_2: Optional[str] = None
    label_2: Optional[str] = None
    is_active_2: bool = True
    chat_id_3: Optional[str] = None
    label_3: Optional[str] = None
    is_active_3: bool = True
    is_active: bool = True

    class Config:
        from_attributes = True
