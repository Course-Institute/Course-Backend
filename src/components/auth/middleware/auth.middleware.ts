import { NextFunction, Request, Response } from "express";
import authService from '../services/auth.service.js';

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
                type: string;
                centerId?: string;
            };
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Auth middleware - req.headers.authorization:', req.headers.authorization);
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            console.log('Auth middleware - No token found');
            return res.status(401).json({
                status: false,
                message: 'Access token required'
            });
        }

        console.log('Auth middleware - Token found, verifying...');
        const decoded = await authService.verifyToken(token);
        req.user = decoded;
        console.log('Auth middleware - Token verified, user:', req.user);
        next();
    } catch (error) {
        console.log('Auth middleware - Token verification failed:', error);
        return res.status(401).json({
            status: false,
            message: 'Invalid or expired token'
        });
    }
};

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Admin middleware - req.user:', req.user);
        if (!req.user) {
            console.log('Admin middleware - No user found');
            return res.status(401).json({
                status: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role !== 'admin' || req.user.type !== 'admin') {
            console.log('Admin middleware - User is not admin. Role:', req.user.role, 'Type:', req.user.type);
            return res.status(403).json({
                status: false,
                message: 'Admin access required'
            });
        }

        console.log('Admin middleware - User is admin, proceeding...');
        next();
    } catch (error) {
        console.log('Admin middleware - Error:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
};

export const authorizeCenter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Center middleware - req.user:', req.user);
        if (!req.user) {
            console.log('Center middleware - No user found');
            return res.status(401).json({
                status: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role !== 'center') {
            console.log('Center middleware - User is not center. Role:', req.user.role);
            return res.status(403).json({
                status: false,
                message: 'Center access required'
            });
        }

        console.log('Center middleware - User is center, proceeding...');
        next();
    } catch (error) {
        console.log('Center middleware - Error:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
};

export const authorizeAdminOrCenter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('AdminOrCenter middleware - req.user:', req.user);
        if (!req.user) {
            console.log('AdminOrCenter middleware - No user found');
            return res.status(401).json({
                status: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role !== 'admin' && req.user.role !== 'center') {
            console.log('AdminOrCenter middleware - User is not admin or center. Role:', req.user.role);
            return res.status(403).json({
                status: false,
                message: 'Admin or Center access required'
            });
        }

        console.log('AdminOrCenter middleware - User is authorized, proceeding...');
        next();
    } catch (error) {
        console.log('AdminOrCenter middleware - Error:', error);
        return res.status(500).json({
            status: false,
            message: 'Internal server error'
        });
    }
};

export const validatePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const PASSWORD = process.env.PASSWORD;
        const { password } = req.query;
        if(password == PASSWORD) { next() }
        else { return res.status(400).json({message: "Invalid password"}); }
    } catch (error) {
        return res.status(500).json({message: "Internal server error"});
    }
}