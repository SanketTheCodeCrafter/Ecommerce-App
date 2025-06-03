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

export const loginUser = async (req, res) =>{
    const {email, password}=req.body;


    try {
        const checkUser= await User.findOne({email});
        if(!checkUser) return res.json({
            success: false,
            message: "User doesn't exists! Please register first"
        })
        
        const checkedPassword =  bcrypt.compareSync(password, checkUser.password);
        if(!checkedPassword) return res.json({
            success: false,
            message: "Incorrect password!"
        })

        const token = jwt.sign({
            id: checkUser._id,
            role: checkUser.role,
            email: checkUser.email
        }, "JWT_SECRET_KEY", {
            expiresIn: '1hr'
        })

        res.cookie('token', token, {httpOnly: true, secure: false});
        res.json({
            success: true,
            message: "Logged in successfully!",
            user: {
                email: checkUser.email,
                role: checkUser.role,
                id: checkUser._id
            }
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Some error occured",
        })
    }
}

export const logoutUser = async (req, res)=>{
    try{
        res.clearCookie('token');
        res.json({
            success: true,
            message: "Logged out successfully!"
        })
    }catch(error){
        console.log("Error in logging out user:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message,
        })
    }
}

export const authMiddleware = (req, res, next)=>{
    const token = req.cookies.token;
    if(!token) return res.status(401).json({
        success: false,
        message: "Unauthorized! Please login first"
    })

    try {
        const decoded = jwt.verify(token, "JWT_SECRET_KEY");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({
        success: false,
        message: "Unauthorized! Please login first"
    })
    }
}