import express from 'express';
const router = express.Router();
import userRouter from '../components/users/routes/user.route';
import adminRouter from '../components/admin/routes/admin.route';

// User routes (includes public login and protected registration)
router.use('/user', userRouter);

// Admin routes (all protected with authentication and admin role)
router.use('/admin', adminRouter);

export default router;
