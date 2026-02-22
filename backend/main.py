from typing import List, Optional
import sys
import os

# Fix definitions for deployment: Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Depends, HTTPException, File, UploadFile, Response
from fastapi.staticfiles import StaticFiles
import uuid
import shutil
import os
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from backend import crud
from backend import models
from backend import schemas
from backend.database import SessionLocal, engine, get_db
from backend import auth
from backend import auto_seed
from jose import JWTError, jwt

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cake Shop API", description="API for checking and ordering cakes", version="0.1.0")

# Populate database with mock data on startup if empty
@app.on_event("startup")
async def startup_event():
    db = SessionLocal()
    try:
        # Auto-seed cakes, categories and pages if DB is empty
        auto_seed.check_and_seed_data(db)
    finally:
        db.close()

@app.get("/health-check")
async def health_check(db: Session = Depends(get_db)):
    cakes_count = db.query(models.Cake).count()
    pages_count = db.query(models.Page).count()
    return {
        "status": "online",
        "database": "connected",
        "cakes_count": cakes_count,
        "pages_count": pages_count
    }




# CORS setup to allow frontend connection
# For production, you might want to restrict this to your specific frontend domain.
# But for initial deployment debugging, allowing all is often easier.
origins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:5174",
    "https://cake-shop-frontend.onrender.com", # Example Render URL
    "*", # Allow all for now
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files configuration
STATIC_DIR = Path(__file__).parent / "static"
MEDIA_DIR = Path(__file__).parent / "media"
MEDIA_DIR.mkdir(parents=True, exist_ok=True)

app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")
app.mount("/media", StaticFiles(directory=str(MEDIA_DIR)), name="media")


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import timedelta


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
oauth2_scheme_optional = OAuth2PasswordBearer(tokenUrl="token", auto_error=False)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = schemas.TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = crud.get_user_by_email(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

def get_optional_current_user(token: Optional[str] = Depends(oauth2_scheme_optional), db: Session = Depends(get_db)):
    if not token:
        return None
    try:
        payload = jwt.decode(token, auth.SECRET_KEY, algorithms=[auth.ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            return None
        user = crud.get_user_by_email(db, email=email)
        return user
    except JWTError:
        return None

@app.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/google")
async def google_auth(token: str, db: Session = Depends(get_db)):
    idinfo = auth.verify_google_token(token)
    if not idinfo:
        raise HTTPException(status_code=400, detail="Invalid Google token")
    
    email = idinfo['email']
    user = crud.get_user_by_email(db, email=email)
    
    if not user:
        # Create user if doesn't exist
        # Password will be random/unused for Google users
        user_in = schemas.UserCreate(email=email, password=str(uuid.uuid4()))
        user = crud.create_user(db, user_in)
    
    access_token_expires = timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth.create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user


@app.post("/cakes/", response_model=schemas.Cake)
def create_cake(cake: schemas.CakeCreate, db: Session = Depends(get_db)):
    return crud.create_cake(db=db, cake=cake)

@app.get("/cakes/", response_model=List[schemas.Cake])
def read_cakes(skip: int = 0, limit: int = 100, category: Optional[str] = None, db: Session = Depends(get_db)):
    cakes = crud.get_cakes(db, skip=skip, limit=limit, category=category)
    return cakes

@app.get("/cakes/{identifier}", response_model=schemas.Cake)
def read_cake(identifier: str, category: Optional[str] = None, db: Session = Depends(get_db)):
    if identifier.isdigit():
        db_cake = crud.get_cake(db, cake_id=int(identifier))
    else:
        db_cake = crud.get_cake_by_slug(db, slug=identifier)
        
    if db_cake is None:
        raise HTTPException(status_code=404, detail="Cake not found")
        
    # Contextual Slug Validation (SEO strict matching)
    if category and db_cake.category != category:
        raise HTTPException(status_code=404, detail="Cake not found in this category")
        
    return db_cake



# Validating requests installation
import requests

# --- Telegram notification system (DB-based) ---
def get_telegram_settings(db: Session):
    settings = db.query(models.TelegramSettings).filter(models.TelegramSettings.id == 1).first()
    if not settings:
        # Create default with user's token
        settings = models.TelegramSettings(
            id=1,
            bot_token="8339223589:AAFAdjKe9VTuWwye3HNJsQW_IIwDSxmrnMo",
            chat_id_1="428760780",
            label_1="Viktor",
            is_active=True
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings

def send_telegram_notification(message: str, db: Session = None):
    try:
        if db is None:
            db_gen = get_db()
            db = next(db_gen)
            close_after = True
        else:
            close_after = False

        settings = get_telegram_settings(db)
        if not settings.is_active or not settings.bot_token:
            return

        url = f"https://api.telegram.org/bot{settings.bot_token}/sendMessage"
        chat_ids = []
        if settings.chat_id_1 and settings.is_active_1:
            chat_ids.append(settings.chat_id_1)
        if settings.chat_id_2 and settings.is_active_2:
            chat_ids.append(settings.chat_id_2)
        if settings.chat_id_3 and settings.is_active_3:
            chat_ids.append(settings.chat_id_3)

        for chat_id in chat_ids:
            data = {"chat_id": chat_id, "text": message, "parse_mode": "HTML"}
            requests.post(url, json=data, timeout=5)

        if close_after:
            db.close()
    except Exception as e:
        print(f"Failed to send Telegram notification: {e}")

@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db), current_user: Optional[models.User] = Depends(get_optional_current_user)):
    # Override user_id from auth token if available
    user_id = current_user.id if current_user else None
    
    # Creating order
    db_order = crud.create_order(db=db, order=order, user_id=user_id)
    
    msg = f"<b>Нове замовлення! (Кошик)</b>\n"
    msg += f"🆔 Номер замовлення: №{db_order.id}\n\n"
    msg += f"👤 <b>Клієнт:</b>\n"
    msg += f"Ім'я: {order.customer_name}\n"
    msg += f"Телефон: {order.customer_phone}\n"
    msg += f"Тип обліковки: {'Зареєстрований' if current_user else 'Гість'}\n\n"
    msg += f"🚚 <b>Доставка:</b>\n"
    msg += f"Спосіб: {order.delivery_method or 'Не вказано'}\n"
    msg += f"Дата (на коли): {order.delivery_date or 'Не вказано'}\n\n"
    msg += f"📦 <b>Товари:</b>\n"
    for item in order.items:
        cake = crud.get_cake(db, item.cake_id)
        cake_name = cake.name if cake else f"ID {item.cake_id}"
        msg += f"- {cake_name} ({item.quantity} шт)\n"
        if item.weight:
            msg += f"  Вага: {item.weight} кг\n"
        if item.flavor:
            msg += f"  Начинка: {item.flavor}\n"
            
    msg += f"\n💰 <b>Всього:</b> {db_order.total_price} грн\n"
    
    send_telegram_notification(msg, db)
    
    return db_order

@app.patch("/orders/{order_id}/status", response_model=schemas.Order)
def update_order_status(order_id: int, status_update: dict, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    status = status_update.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
    
    db_order = crud.update_order_status(db, order_id=order_id, status=status)
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")
    return db_order

@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(status: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    orders = crud.get_orders(db, skip=skip, limit=limit, status=status)
    return orders

@app.post("/orders/quick", response_model=schemas.Order)
def create_quick_order(order: schemas.QuickOrderCreate, db: Session = Depends(get_db)):
    db_order = crud.create_quick_order(db=db, order=order)
    if not db_order:
        raise HTTPException(status_code=404, detail="Cake not found")
    
    # Send Telegram Notification
    cake = crud.get_cake(db, order.cake_id)
    cake_name = cake.name if cake else "Unknown Cake"
    
    msg = f"<b>Нове замовлення! (В 1 клік)</b>\n"
    msg += f"🆔 Номер замовлення: №{db_order.id}\n\n"
    msg += f"👤 <b>Клієнт:</b>\n"
    msg += f"Ім'я: {order.customer_name}\n"
    msg += f"Телефон: {order.customer_phone}\n\n"
    msg += f"🚚 <b>Доставка:</b>\n"
    msg += f"Спосіб: {order.delivery_method or 'Не вказано'}\n"
    msg += f"Дата (на коли): {order.delivery_date or 'Не вказано'}\n\n"
    msg += f"📦 <b>Товари:</b>\n"
    msg += f"- {cake_name} ({order.quantity} шт)\n"
    if order.weight:
        msg += f"  Вага: {order.weight} кг\n"
    if order.flavor:
        msg += f"  Начинка: {order.flavor}\n"
        
    msg += f"\n💰 <b>Всього:</b> {db_order.total_price} грн\n"
        
    send_telegram_notification(msg, db)
    
    return db_order

# --- Admin / SEO Endpoints ---

@app.patch("/cakes/{cake_id}", response_model=schemas.Cake)
def update_cake(cake_id: int, cake: schemas.CakeUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # TODO: Check if user is admin
    db_cake = crud.update_cake(db, cake_id=cake_id, cake=cake)
    if not db_cake:
         raise HTTPException(status_code=404, detail="Cake not found")
    return db_cake

# Pages
@app.get("/admin/pages", response_model=List[schemas.Page])
def read_pages(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return crud.get_pages(db, skip=skip, limit=limit)

@app.post("/admin/pages", response_model=schemas.Page)
def create_page(page: schemas.PageCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return crud.create_page(db=db, page=page)

@app.patch("/admin/pages/{page_id}", response_model=schemas.Page)
def update_page(page_id: int, page: schemas.PageUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    db_page = crud.update_page(db, page_id=page_id, page=page)
    if not db_page:
        raise HTTPException(status_code=404, detail="Page not found")
    return db_page

# Category Metadata
@app.get("/admin/categories/metadata", response_model=List[schemas.CategoryMetadata])
def read_all_category_metadata(db: Session = Depends(get_db)):
    return crud.get_all_category_metadata(db)

@app.get("/admin/categories/metadata/{slug}", response_model=Optional[schemas.CategoryMetadata])
def read_category_metadata(slug: str, db: Session = Depends(get_db)):
    return crud.get_category_metadata(db, slug=slug)

@app.patch("/admin/categories/metadata/{slug}", response_model=schemas.CategoryMetadata)
def update_category_metadata(slug: str, metadata: schemas.CategoryMetadataUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return crud.update_category_metadata(db, slug=slug, metadata=metadata)

@app.get("/api/seo/{route_path:path}") # :path to catch full routes including slashes
def get_seo(route_path: str, db: Session = Depends(get_db)):
    # Ensure route_path starts with / if not provided
    if not route_path.startswith("/"):
        route_path = "/" + route_path
        
    page = crud.get_page_by_route(db, route_path)
    if not page:
         # Return default or 404? 
         # Better to return empty/default structure so frontend doesn't crash
         return {} 
    return page

@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    orders = crud.get_orders(db, skip=skip, limit=limit)
    return orders

@app.get("/")
def read_root():
    return {"message": "Welcome to Cake Shop API"}

# --- Telegram Admin Endpoints ---
@app.get("/admin/telegram", response_model=schemas.TelegramSettings)
def get_telegram_settings_endpoint(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    return get_telegram_settings(db)

@app.put("/admin/telegram", response_model=schemas.TelegramSettings)
def update_telegram_settings_endpoint(settings_update: schemas.TelegramSettingsUpdate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    settings = get_telegram_settings(db)
    update_data = settings_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(settings, key, value)
    db.commit()
    db.refresh(settings)
    return settings

@app.post("/admin/telegram/test")
def test_telegram(db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    send_telegram_notification("\u2705 Тестове повідомлення від Antreme!", db)
    return {"message": "Test notification sent"}

from backend import seed

@app.post("/seed_db")
def seed_database():
    try:
        seed.seed_data()
        return {"message": "Database seeded successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/admin/upload")
def upload_image(file: UploadFile = File(...), current_user: schemas.User = Depends(get_current_user)):
    file_extension = file.filename.split('.')[-1]
    file_name = f"{uuid.uuid4()}.{file_extension}"
    file_path = MEDIA_DIR / file_name
    
    with file_path.open("wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"image_url": f"/media/{file_name}"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
