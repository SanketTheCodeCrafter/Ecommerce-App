import express from 'express';
import passport from 'passport';
import jwt from 'jsonwebtoken';
import { registerUser, loginUser, logoutUser, authMiddleware } from '../controllers/AuthController.js';

const router = express.Router();

router.post('/register', registerUser)
router.post('/login', loginUser)
router.post('/logout', logoutUser)

router.get('/check-auth', authMiddleware, (req, res) => {
    // Return minimal response for faster processing
    res.status(200).json({
        success: true,
        user: req.user,
    })
})

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
}));

router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/login',
        session: false
    }),
    (req, res) => {
        // Generate JWT token for the authenticated user
        const token = jwt.sign({
            id: req.user._id,
            role: req.user.role,
            email: req.user.email,
            userName: req.user.userName
        }, process.env.JWT_SECRET, {
            expiresIn: '1hr'
        });

        // Set token as cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            path: '/',
            sameSite: 'none',
            domain: undefined
        });

        // Redirect to frontend with token in URL for client-side handling
        const isProduction = process.env.NODE_ENV === 'production';
        const frontendUrl = isProduction
            ? process.env.FRONTEND_URL_PROD
            : process.env.FRONTEND_URL_DEV;
        res.redirect(`${frontendUrl}/auth/google/success?token=${token}`);
    }
);

export default router;