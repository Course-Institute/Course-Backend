import express from 'express';
const router = express.Router();
import userRouter from '../components/users/routes/user.route.js';
import adminRouter from '../components/admin/routes/admin.route.js';
import studentRouter from '../components/students/routes/student.route.js';
import centerRouter from '../components/centers/routes/center.route.js';
import marksheetRouter from '../components/marksheets/routes/marksheet.route.js';
import inquiryRouter from '../components/inquiry/routes/inquiry.routes.js';
import courseRouter from '../components/course/routes/course.route.js';

// User routes (includes public login and protected registration)
router.use('/user', userRouter);

// Admin routes (all protected with authentication and admin role)
router.use('/admin', adminRouter);

// Student routes (all protected with authentication and admin role)
router.use('/student', studentRouter);

//Center routes
router.use('/center', centerRouter);

//Marksheet routes
router.use('/marksheet', marksheetRouter);

// Inquiry routes
router.use('/inquiry', inquiryRouter);

// Course routes
router.use('/course', courseRouter);

export default router;
