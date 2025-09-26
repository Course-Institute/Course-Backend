import express from 'express';
const router = express.Router();
import userRouter from '../components/users/routes/user.route';
import adminRouter from '../components/admin/routes/admin.route';
import studentRouter from '../components/students/routes/student.route';

// User routes (includes public login and protected registration)
router.use('/user', userRouter);

// Admin routes (all protected with authentication and admin role)
router.use('/admin', adminRouter);

// Student routes (all protected with authentication and admin role)
router.use('/student', studentRouter);

export default router;
