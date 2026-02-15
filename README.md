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

## Deployment to Render

This project is ready for deployment on [Render](https://render.com/).

1. Create a Render account.
2. Click "New" -> "Blueprint".
3. Connect your GitHub repository.
4. Render will automatically detect the `render.yaml` file and set up both the backend and frontend.

## Deployment to GitHub manually (if needed)
...
