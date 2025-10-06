import { Request, Response } from 'express';
import authService from '../../auth/services/auth.service.js';
import userService from '../services/user.service.js';
import { sendResponse } from '../../../utils/response.util.js';

const registerAdmin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { name, email, password } = req.body;

        // Validate required fields
        if (!name || !email || !password) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Name, email, and password are required'
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Invalid email format'
            });
        }

        // Validate password strength
        if (password.length < 6) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        const result = await userService.registerAdmin({ name, email, password });
        
        return sendResponse({
            res,
            statusCode: 201,
            status: true,
            message: 'Admin registered successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 400,
            status: false,
            message:'Failed to register admin',
            error: error.message
        });
    }
};

const adminLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Email and password are required'
            });
        }

        const result = await authService.adminLogin({ email, password });
        
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Admin logged in successfully',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 401,
            status: false,
            message:'Login failed',
            error: error.message
        });
    }
};

const getAdminProfile = async (req: Request, res: Response): Promise<Response> => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            return sendResponse({
                res,
                statusCode: 401,
                status: false,
                message: 'User not authenticated'
            });
        }

        const admin = await authService.getAdminById(userId);
        
        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Admin profile retrieved successfully',
            data: admin
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 404,
            status: false,
            message:'Admin not found',
            error: error.message
        });
    }
};


const studentLogin = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { registrationNo, dateOfBirth } = req.body;

        // Validate required fields
        if (!registrationNo || !dateOfBirth) {
            return sendResponse({
                res,
                statusCode: 400,
                status: false,
                message: 'Registration number and date of birth are required',
                error: 'Missing required fields'
            });
        }

        // Authenticate student
        const result = await authService.studentLogin({
            registrationNo,
            dateOfBirth
        });

        return sendResponse({
            res,
            statusCode: 200,
            status: true,
            message: 'Student login successful',
            data: result
        });
    } catch (error: any) {
        return sendResponse({
            res,
            statusCode: 401,
            status: false,
            message:'Login failed',
            error: error.message
        });
    }
};

export default { registerAdmin, adminLogin, getAdminProfile, studentLogin };