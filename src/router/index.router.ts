import express from 'express';
const router = express.Router();
import userRouter from '../components/users/routes/user.route.js';
import adminRouter from '../components/admin/routes/admin.route.js';
import studentRouter from '../components/students/routes/student.route.js';
import centerRouter from '../components/centers/routes/center.route.js';
import marksheetRouter from '../components/marksheets/routes/marksheet.route.js';

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

export default router;
