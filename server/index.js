import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;


mongoose.connect("mongodb+srv://Sanket:Ecommerce@ecommerce.2hoo8jz.mongodb.net/")
.then(()=>{
    console.log(('MongoDB connected successfully'));
})
.catch((err)=>{
    console.error(`Error connecting to MongoDB: ${err.message}`);
});


app.use(
    cors({
        origin: 'https://localhost: 5173/',
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



app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`);
})


//26.22