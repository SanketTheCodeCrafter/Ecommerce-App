# PikaShop E-commerce Web Application

## 1. Project Overview

**Project Name:** PikaShop E-commerce Web Application  
**Repository:** [GitHub Repository](https://github.com/SanketTheCodeCrafter/Ecommerce-App)  

### Tech Stack:
- **Frontend:** React.js, Tailwind CSS, Framer Motion, React Router  
- **Backend:** Node.js, Express.js, MongoDB, Mongoose  
- **Authentication:** JWT, bcrypt  
- **Image Uploads:** Cloudinary  
- **Payment Integration:** PayPal SDK (if implemented)  

### Key Features:
- User authentication
- Product catalog and search functionality
- Shopping cart and checkout process
- Order management
- Admin dashboard for product management
- Product reviews and user addresses

---

## 2. Project Setup

### 2.1 Backend Setup

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/SanketTheCodeCrafter/Ecommerce-App.git
    cd Ecommerce-App/backend
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Configure Environment Variables (.env):**
    ```plaintext
    PORT=5000
    MONGO_URI=<Your MongoDB Atlas URI>
    JWT_SECRET=<Your JWT Secret>
    CLOUDINARY_CLOUD_NAME=<Cloudinary Name>
    CLOUDINARY_API_KEY=<Cloudinary API Key>
    CLOUDINARY_API_SECRET=<Cloudinary Secret>
    ```

4. **Start the Server:**
    ```bash
    npm run dev
    ```
    The backend server will run at `http://localhost:5000` by default.

---

### 2.2 Frontend Setup

1. **Navigate to the Frontend Directory:**
    ```bash
    cd ../frontend
    ```

2. **Install Dependencies:**
    ```bash
    npm install
    ```

3. **Configure Environment Variables (.env):**
    ```plaintext
    REACT_API_URL=http://localhost:5000
    ```

4. **Start the React Application:**
    ```bash
    npm start
    ```
    The frontend application will run at `http://localhost:3000`.

---

## 3. Folder Structure

### Backend
```
backend/
 ├─ controllers/        # API controllers (auth, shop, admin)
 ├─ models/             # MongoDB schemas
 ├─ routes/             # Express routes
 ├─ helper/             # Utilities (Cloudinary, middlewares)
 ├─ index.js            # Entry point
 └─ package.json
```

### Frontend
```
frontend/
 ├─ src/
 │   ├─ components/     # Reusable UI components
 │   ├─ pages/          # Page-level components
 │   └─ api/            # API integration functions
 └─ package.json
```

---

## 4. Initial Configuration

- **Database:** Set up MongoDB Atlas for database management.  
- **Image Uploads:** Configure Cloudinary for image hosting.  
- **Authentication:** Use JWT for secure user authentication.  
- **Routing:** Implement React Router for frontend navigation.  
- **CORS:** Configure backend CORS settings for frontend integration.

---

## 5. How to Use

1. Register a new user via the `/register` endpoint.  
2. Log in to receive a JWT token stored in cookies.  
3. Browse products using the `/shop/get` endpoint.  
4. Add products to the shopping cart and manage the cart.  
5. Admin users can add, edit, or delete products via admin routes.  
6. Proceed to checkout and manage orders.
