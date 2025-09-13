import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import 'dotenv/config';
import AuthRoutes from './routes/AuthRoutes.js';
import adminProductsRouter from './routes/admin/products-routes.js'
import adminOrderRouter from './routes/admin/order-routes.js';
import shopProductsRouter from './routes/shop/products-routes.js';
import shopCartRouter from './routes/shop/cart-routes.js';
import shopAddressRouter from './routes/shop/address-routes.js';
import shopOrderRouter from './routes/shop/order-routes.js';
import shopSearchRouter from './routes/shop/search-routes.js';
import shopReviewRouter from './routes/shop/review-routes.js';

dotenv.config();
const app = express();
const PORT = Number(process.env.PORT) || 5000;


mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log(('MongoDB connected successfully'));
    })
    .catch((err) => {
        console.error(`Error connecting to MongoDB: ${err.message}`);
    });


const allowedOrigins = [
    'http://localhost:5173',
    process.env.FRONTEND_URL,  // Production frontend URL
].filter(Boolean);

app.use(
    cors({
        origin: allowedOrigins,
        methods: ['GET', 'POST', 'DELETE', 'PUT'],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma"
        ],
        credentials: true
    })
);


app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', AuthRoutes);

app.use('/api/admin/products', adminProductsRouter);
app.use('/api/admin/orders', adminOrderRouter);

app.use('/api/shop/products', shopProductsRouter);
app.use('/api/shop/cart', shopCartRouter);
app.use('/api/shop/address', shopAddressRouter);
app.use('/api/shop/order', shopOrderRouter);
app.use('/api/shop/search', shopSearchRouter);
app.use('/api/shop/review', shopReviewRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


