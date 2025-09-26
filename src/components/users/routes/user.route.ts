import express from 'express';
import multer from 'multer';
import path from 'path';
import userController from '../controller/user.controller';
import { validatePassword, authenticateToken, authorizeAdmin } from '../../auth/middleware/auth.middleware';

// Configure multer for disk storage - OUTSIDE app folder
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../uploads/') // Files saved OUTSIDE your app folder
    },
    filename: function (req, file, cb) {
        // Generate unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

const router = express.Router();

// Public routes
router.post('/admin-login', userController.adminLogin);

// Protected routes (require password validation for registration)
router.post('/register-admin', validatePassword, userController.registerAdmin);

// Protected routes (require authentication and admin role)
router.get('/profile', authenticateToken, authorizeAdmin, userController.getAdminProfile);

//add student api and center api
router.post('/add-student', authenticateToken, authorizeAdmin, upload.array('images', 10), userController.addStudentController);

export default router;