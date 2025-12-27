import express from 'express';
import userController from '../../users/controller/user.controller.js';
import adminController from '../controller/admin.controller.js';
import { authenticateToken, authorizeAdmin } from '../../auth/middleware/auth.middleware.js';
import { uploadCenterFiles, multerErrorHandler } from '../../auth/middleware/upload.middleware.js';
import { validateCenterRegistration } from '../../centers/validations/center.validation.js';
import billController from '../../bills/controller/bill.controller.js';
import { validateCreateBill } from '../../bills/validations/bill.validation.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeAdmin);

// Admin profile routes
router.get('/profile', userController.getAdminProfile);

// Admin dashboard route
router.get('/dashboard', adminController.getAdminDashboardController);
router.get('/dashboardStats', adminController.getDashboardStatsController);
router.get('/centerdynamics', adminController.getCenterDynamicsController);

// Student management routes
router.get('/students/:registrationNo', adminController.getStudentDetailsController);
router.post('/approve-student', adminController.approveStudentController);
router.post('/approve-marksheet', adminController.approveStudentMarksheetController);
router.post('/approve-admit-card', adminController.approveAdmitCardController);
router.post('/approve-certificate', adminController.approveCertificateController);
router.post('/approve-migration', adminController.approveMigrationController);

// Center management routes (admin only)
router.post('/register-center', uploadCenterFiles.fields([
    { name: 'photo', maxCount: 1 },
    { name: 'infraPhotos', maxCount: 5 },
    { name: 'cancelledCheque', maxCount: 1 },
    { name: 'gstCertificate', maxCount: 1 },
    { name: 'panCard', maxCount: 1 },
    { name: 'addressProof', maxCount: 1 },
    { name: 'directorIdProof', maxCount: 1 },
    { name: 'signature', maxCount: 1 }
]), multerErrorHandler, validateCenterRegistration, adminController.registerCenterController);
router.post('/getAllCentersList', adminController.getAllCentersController);
router.get('/getCenterById', adminController.getCenterByIdController);

router.post('/create-bill', billController.createBillController);
router.post('/getBillsList', billController.getAllBillsController);

export default router;
