import express from 'express';
import inquiryController  from '../controllers/inquiry.controller.js';
import { authenticateToken, authorizeAdmin } from '../../auth/middleware/auth.middleware.js';

const router = express.Router();

router.post('/newInquiry', inquiryController.createInquiry);
router.get('/list', authenticateToken, authorizeAdmin, inquiryController.list);

export default router;


