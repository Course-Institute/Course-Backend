import express from 'express';
import studentController from '../controller/student.controller.js';
import adminController from '../../admin/controller/admin.controller.js';
import { authenticateToken, authorizeAdmin, authorizeAdminOrCenter } from '../../auth/middleware/auth.middleware.js';
import { uploadStudentFiles, multerErrorHandler } from '../../auth/middleware/upload.middleware.js';

const router = express.Router();

// Public route to get student profile by registration number
router.get('/profile', studentController.getStudentProfileController);

// Protected routes (require authentication and admin role)
router.post('/add-student', authenticateToken, authorizeAdminOrCenter, uploadStudentFiles.fields([
    { name: 'adharCardFront', maxCount: 1 },
    { name: 'adharCardBack', maxCount: 1 },
    { name: 'photo', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]), multerErrorHandler, studentController.addStudentController);

// List students (admin and center access) - centers can only see their own students
router.get('/students', authenticateToken, authorizeAdminOrCenter, adminController.listStudentsForAdminOrCenterController);

// Student auto complete list (admin only)
router.get('/getStudentAutoCompleteList', authenticateToken, authorizeAdminOrCenter, studentController.studentListAutoCompleteController);

export default router;
