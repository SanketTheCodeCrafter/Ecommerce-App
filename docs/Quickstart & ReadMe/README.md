PikaShop E-commerce Web App –
1. Project Overview

Name: PikaShop E-commerce Web App

Repository: GitHub Link

Tech Stack:

Frontend: React.js, Tailwind CSS, Framer Motion, React Router

Backend: Node.js, Express.js, MongoDB, Mongoose

Auth: JWT, bcrypt

Image Uploads: Cloudinary

Payment: PayPal SDK (if integrated)

Features: User authentication, product catalog, search, cart, checkout, order management, admin dashboard, reviews, addresses.

2. Project Setup
2.1 Backend

Clone Repo

git clone https://github.com/SanketTheCodeCrafter/Ecommerce-App.git
cd Ecommerce-App/backend


Install Dependencies

npm install


Environment Variables (.env)

PORT=5000
MONGO_URI=<Your MongoDB Atlas URI>
JWT_SECRET=<Your JWT Secret>
CLOUDINARY_CLOUD_NAME=<Cloudinary Name>
CLOUDINARY_API_KEY=<Cloudinary API Key>
CLOUDINARY_API_SECRET=<Cloudinary Secret>


Start Server

npm run dev


Server runs on http://localhost:5000 by default

2.2 Frontend

Navigate to frontend folder

cd ../frontend


Install Dependencies

npm install


Environment Variables (.env)

REACT_API_URL=http://localhost:5000


Start React App

npm start


React app runs on http://localhost:3000

3. Folder Structure
Backend
backend/
 ├─ controllers/        # API controllers (auth, shop, admin)
 ├─ models/             # MongoDB schemas
 ├─ routes/             # Express routes
 ├─ helper/             # Utilities (Cloudinary, middlewares)
 ├─ index.js            # Entry point
 └─ package.json

Frontend
frontend/
 ├─ src/
 │   ├─ components/     # Reusable UI components
 │   ├─ pages/          # Page-level components
 │   └─ api/            # API integration functions
 └─ package.json

4. Initial Configuration

MongoDB Atlas setup for database

Cloudinary setup for image uploads

JWT for secure authentication

React Router for frontend routing

CORS configuration in backend for frontend integration

5. How to Use

Register a new user via /register endpoint

Login to receive JWT in cookie

Browse products (/shop/get)

Add products to cart and manage cart

Admin can add/edit/delete products via admin routes

Checkout and manage orders 