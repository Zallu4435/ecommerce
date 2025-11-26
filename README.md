# Ecommerce App

A MERN-based ecommerce application with a Node/Express backend and a React (Vite) frontend.

## Features
- User auth (JWT), Google OAuth
- Products, categories, reviews
- Cart, wishlist, comparison, coupons, wallet, orders
- Sales analytics
- Admin endpoints and utilities
- File uploads (Multer) with Cloudinary integration
- Email (Resend)

## Tech Stack
- Backend: Node.js, Express, MongoDB (Mongoose)
- Auth: JWT
- Uploads/Media: Multer, Cloudinary
- Email: Resend
- Payments: Razorpay (keys present)
- Frontend: React, Vite, TailwindCSS

## Prerequisites
- Node.js (see .nvmrc for version)
- MongoDB database
- Optional: Docker (for backend container)

## Getting Started

### 1) Clone and install
```
# Backend deps
cd backend
npm install

# Frontend deps
cd ../frontend
npm install
```

### 2) Environment variables
- Backend env file path: `backend/config/.env` (this is what the app loads).
- Frontend env file path: `frontend/.env` (Vite requires variables to start with `VITE_`).
- Examples provided in:
  - Root: `.env.example` (includes both backend and frontend examples)
  - Backend: `backend/env.example` (server-only vars)

Backend (`backend/config/.env`) keys commonly used:
- `PORT=5000`
- `NODE_ENV=development`
- `MONGO_URI=<your_mongodb_connection_string>`
- `ORIGIN=http://localhost:5173`
- `JWT_SECRET_KEY=<secret>`
- `JWT_EXPIRES=1m`
- `JWT_REFRESH_SECRET_KEY=<secret>`
- `JWT_REFRESH_EXPIRE=1d`
- `JWT_ACTIVATION_SECRET=<secret>`
- `RESEND_API_KEY=<resend_api_key>`
- `RESEND_FROM_EMAIL=<verified_sender@example.com>`
- `GOOGLE_CLIENT_ID=<google_client_id>`
- `OTP_EXPIRATION=10m`
- `OTP_SECRET=<secret>`
- Optional server-side Cloudinary (if used server-side):
  - `CLOUDINARY_CLOUD_NAME`
  - `CLOUDINARY_API_KEY`
  - `CLOUDINARY_API_SECRET`
- Optional Razorpay server keys:
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`

Frontend (`frontend/.env`) keys commonly used:
- `VITE_SERVER_URL=http://localhost:5000`
- `VITE_GOOGLE_CLIENT_ID=<google_client_id>`
- `VITE_CLOUDINARY_CLOUD_NAME=<cloud_name>`
- `VITE_CLOUDINARY_URL=https://api.cloudinary.com/v1_1/<cloud_name>/image/upload`
- `VITE_CLOUDINARY_UPLOAD_PRESET=<upload_preset>`
- `VITE_CLOUDINARY_FOLDER=<folder_name>`
- `VITE_RAZORPAY_KEY=<public_key>`

### 3) Run in development
Open two terminals:
```
# Terminal 1: backend
cd backend
npm run dev

# Terminal 2: frontend
cd frontend
npm run dev
```

Backend: http://localhost:5000
Frontend: http://localhost:5173 (default Vite)

### 4) Build
```
# Frontend build
cd frontend
npm run build
```
Output is generated in `frontend/dist/`.

## Project Structure
- `backend/` – API, controllers, middleware, DB
- `frontend/` – React app (Vite)

## Backend API Overview
- Base URL: `http://localhost:5000/api`
- Static uploads: served from `http://localhost:5000/` (maps to `uploads/`)

Route prefixes (from `backend/routes/index.js`):
- `/users` – auth, profile, etc.
- `/products` – product listing, details, CRUD (admin)
- `/coupons` – coupon management and application
- `/category` – categories
- `/orders` – order creation and management
- `/sales` – sales analytics
- `/admin` – admin utilities
- `/wallet` – wallet operations
- `/userProfile` – user profile management
- `/user-cart` – cart operations
- `/user-wishlist` – wishlist operations
- `/user-comparison` – product compare list
- `/reviews` – product reviews

Note: All routes are mounted under `/api` (e.g., `GET /api/products`).

## Scripts (common)
- Backend: `npm run dev`, `npm start`
- Frontend: `npm run dev`, `npm run build`, `npm run preview`

## Docker (backend optional)
Build and run the backend with Docker:
```
# From repo root
docker build -t ecommerce-backend ./backend
docker run --name ecommerce-backend \
  -p 5000:5000 \
  --env-file backend/config/.env \
  ecommerce-backend
```

## License
MIT

