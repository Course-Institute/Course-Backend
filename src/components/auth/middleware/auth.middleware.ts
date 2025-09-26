import { NextFunction, Request, Response } from "express";
import authService from '../services/auth.service';

// Extend Request interface to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                role: string;
                type: string;
            };
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                status: false,
                message: 'Access token required'
            });
        }

        const decoded = await authService.verifyToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({
            status: false,
            message: 'Invalid or expired token'
        });
    }
};

export const authorizeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                status: false,
                message: 'Authentication required'
            });
        }

        if (req.user.role !== 'admin' || req.user.type !== 'admin') {
            return res.status(403).json({
                status: false,
                message: 'Admin access required'
            });
        }

        next();
    } catch (error) {
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