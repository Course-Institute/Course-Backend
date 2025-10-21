import express from 'express';
import userController from '../../users/controller/user.controller.js';
import adminController from '../controller/admin.controller.js';
import { authenticateToken, authorizeAdmin } from '../../auth/middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeAdmin);

// Admin profile routes
router.get('/profile', userController.getAdminProfile);

// Admin dashboard route
router.get('/dashboard', adminController.getAdminDashboardController);

// Student management routes
router.get('/students/:registrationNo', adminController.getStudentDetailsController);
router.post('/approve-student', adminController.approveStudentController);

// Center management routes (admin only)
router.post('/register-center', adminController.registerCenterController);
router.post('/getAllCentersList', adminController.getAllCentersController);
// router.post('/approve-center', adminController.approveCenterController);

export default router;
