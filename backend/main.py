from typing import List
import sys
import os

# Fix definitions for deployment: Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from fastapi import FastAPI, Depends, HTTPException, File, UploadFile
from fastapi.staticfiles import StaticFiles
import uuid
import shutil
import os
from pathlib import Path
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud
from . import models
from . import schemas
from .database import SessionLocal, engine
from . import auth
from jose import JWTError, jwt

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Cake Shop API", description="API for checking and ordering cakes", version="0.1.0")

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
    allow_origins=["*"], # Allow all origins explicitly
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files configuration
STATIC_DIR = Path(__file__).parent / "static"
print(f"[DEBUG] Static files directory: {STATIC_DIR}")
print(f"[DEBUG] Static directory exists: {STATIC_DIR.exists()}")
if STATIC_DIR.exists():
    print(f"[DEBUG] Files in static: {list(STATIC_DIR.iterdir())}")
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


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

@app.post("/token", response_model=schemas.Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
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

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

@app.get("/users/me/", response_model=schemas.User)
async def read_users_me(current_user: schemas.User = Depends(get_current_user)):
    return current_user

@app.post("/upload/")
async def upload_image(file: UploadFile = File(...)):
    # Create directory if not exists (redundant if we did it, but safe)
    os.makedirs("static/images", exist_ok=True)
    
    # Generate unique filename
    file_extension = file.filename.split(".")[-1]
    unique_filename = f"{uuid.uuid4()}.{file_extension}"
    file_path = f"static/images/{unique_filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {"url": f"/static/images/{unique_filename}"}

@app.post("/cakes/", response_model=schemas.Cake)
def create_cake(cake: schemas.CakeCreate, db: Session = Depends(get_db)):
    return crud.create_cake(db=db, cake=cake)

@app.get("/cakes/", response_model=List[schemas.Cake])
def read_cakes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    cakes = crud.get_cakes(db, skip=skip, limit=limit)
    return cakes

@app.get("/cakes/{cake_id}", response_model=schemas.Cake)
def read_cake(cake_id: int, db: Session = Depends(get_db)):
    db_cake = crud.get_cake(db, cake_id=cake_id)
    if db_cake is None:
        raise HTTPException(status_code=404, detail="Cake not found")
    return db_cake

@app.post("/orders/", response_model=schemas.Order)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db), current_user: schemas.User = Depends(get_current_user)):
    # Override user_id from auth token to ensure security
    # We need to modify schemas.OrderCreate or handle it here.
    # The schema OrderCreate expects user_id. 
    # Let's override it in the crud call or modify the schema object.
    # Better: create a new object or modify the existing one.
    # Since Pydantic models are immutable by default (in v2? or just good practice), we might need to be careful.
    # But wait, schemas.OrderCreate probably has user_id.
    # We should actually remove user_id from OrderCreate if it's inferred from token, OR overwrite it.
    # For now, let's overwrite it in the logic.
    order.user_id = current_user.id
    return crud.create_order(db=db, order=order)



@app.post("/orders/quick", response_model=schemas.Order)
def create_quick_order(order: schemas.QuickOrderCreate, db: Session = Depends(get_db)):
    return crud.create_quick_order(db=db, order=order)

@app.get("/orders/", response_model=List[schemas.Order])
def read_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    orders = crud.get_orders(db, skip=skip, limit=limit)
    return orders

@app.get("/")
def read_root():
    return {"message": "Welcome to Cake Shop API"}

@app.get("/health")
def health_check():
    return {"status": "ok"}
