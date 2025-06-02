import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';


export const registerUser = async (req, res)=>{
    const { userName, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const newUser = new User({
        userName,
        email,
        password: hashedPassword,
    })

    try {
        await newUser.save();
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            user: newUser,
        })
    } catch (error) {
        console.log("Error in registering user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        });
    }
}