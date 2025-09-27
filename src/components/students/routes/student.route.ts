import express from 'express';
import studentController from '../controller/student.controller.js';
import { authenticateToken, authorizeAdmin } from '../../auth/middleware/auth.middleware.js';
import { uploadStudentFiles, multerErrorHandler } from '../../auth/middleware/upload.middleware.js';

const router = express.Router();

// Public route to get student profile by registration number
router.get('/profile', studentController.getStudentProfileController);

// Protected routes (require authentication and admin role)
router.post('/add-student', authenticateToken, authorizeAdmin, uploadStudentFiles.fields([
    { name: 'aadharCardFront', maxCount: 1 },
    { name: 'aadharCardBack', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]), multerErrorHandler, studentController.addStudentController);

export default router;
