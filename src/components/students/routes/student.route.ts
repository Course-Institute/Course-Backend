import express from 'express';
import multer from 'multer';
import path from 'path';
import studentController from '../controller/student.controller';
import { authenticateToken, authorizeAdmin } from '../../auth/middleware/auth.middleware';

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

// Protected routes (require authentication and admin role)
router.post('/add-student', authenticateToken, authorizeAdmin, upload.array('images', 10), studentController.addStudentController);

export default router;
