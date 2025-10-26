import express from 'express';
import billController from '../controller/bill.controller.js';
import { authenticateToken, authorizeAdmin } from '../../auth/middleware/auth.middleware.js';
import { validateCreateBill, validateUpdateBillStatus, validateBillQuery } from '../validations/bill.validation.js';

const router = express.Router();

// All bill routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeAdmin);

// Bill management routes
router.get('/bills', validateBillQuery, billController.getAllBillsController);
router.get('/bills/:billId', billController.getBillByIdController);
router.get('/bills/bill-number/:billNumber', billController.getBillByBillNumberController);
router.put('/bills/:billId/status', validateUpdateBillStatus, billController.updateBillStatusController);
router.delete('/bills/:billId', billController.deleteBillController);

// Center specific bill routes
router.get('/centers/:centerId/bills', billController.getBillsByCenterController);

// Student specific bill routes
router.get('/students/:registrationNo/bills', billController.getBillsByStudentController);

export default router;
