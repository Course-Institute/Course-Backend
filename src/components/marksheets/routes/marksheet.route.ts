import express from 'express';
import marksheetController from '../controller/marksheet.controller.js';
import { authenticateToken, authorizeAdmin, authorizeAdminOrCenter } from '../../auth/middleware/auth.middleware.js';
import { validateCreateMarksheet } from '../validations/marksheet.validation.js';

const router = express.Router();

// Marksheet management routes
router.post('/upload-marksheet', authenticateToken, authorizeAdminOrCenter, validateCreateMarksheet, marksheetController.uploadMarksheetController);

export default router;
