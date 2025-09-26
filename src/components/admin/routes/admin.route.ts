import express from 'express';
import userController from '../../users/controller/user.controller';
import { authenticateToken, authorizeAdmin } from '../../auth/middleware/auth.middleware';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeAdmin);

// Admin profile routes
router.get('/profile', userController.getAdminProfile);

// Admin dashboard route (placeholder for future admin features)
router.get('/dashboard', (req, res) => {
    res.json({
        status: true,
        message: 'Admin dashboard accessed successfully',
        data: {
            admin: req.user,
            timestamp: new Date().toISOString()
        }
    });
});

export default router;
