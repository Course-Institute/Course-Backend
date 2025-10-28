import express from 'express';
import marksheetController from '../controller/marksheet.controller.js';
import { authenticateToken, authorizeAdminOrCenter } from '../../auth/middleware/auth.middleware.js';
import { validateCreateMarksheet } from '../validations/marksheet.validation.js';

const router = express.Router();

// Marksheet management routes
router.post('/upload-marksheet', authenticateToken, authorizeAdminOrCenter, validateCreateMarksheet, marksheetController.uploadMarksheetController);

router.get('/getAllMarksheets', authenticateToken, authorizeAdminOrCenter, marksheetController.getAllMarksheetsController);
router.get('/get-marksheet', authenticateToken, marksheetController.getMarksheetController);
router.get('/show-marksheet', authenticateToken, marksheetController.showMarksheetController);

export default router;
