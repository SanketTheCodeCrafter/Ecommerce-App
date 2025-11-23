import express from 'express';
import { registerUser, loginUser, logoutUser, authMiddleware } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

router.get('/check-auth', authMiddleware, (req, res)=>{
    // Return minimal response for faster processing
    res.status(200).json({
        success: true,
        user: req.user,
    })
})



export default router;