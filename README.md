# Cake Shop Store (Интернет магазин торты)

A web application for a cake shop inspired by the Vatsak brand.

## Features
- Product catalog with categories (Cakes, Cookies, Sweets)
- Detailed product pages with specifications
- Shopping cart
- Order placement (Backend integration)
- Admin capabilities for image uploads

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, SQLite (for testing)

## How to Run

### Backend
1. Go to `backend/`
2. Create virtual environment: `python -m venv venv`
3. Activate venv: `.\venv\Scripts\activate` (Windows)
4. Install dependencies: `pip install -r requirements.txt`
5. Run server: `uvicorn main:app --reload`

### Frontend
1. Go to `frontend/`
2. Install dependencies: `npm install`
3. Run dev server: `npm run dev`

## Deployment to GitHub
1. Create a new repository on GitHub.
2. Run the following commands in the project root:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin YOUR_REPOSITORY_URL
   git push -u origin main
   ```
