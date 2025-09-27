import { Request, Response } from 'express';
import adminService from '../services/admin.service.js';

const listAllStudentsController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { page = 1, limit = 10, search, faculty, course, session } = req.query;
        
        const result = await adminService.listAllStudents({
            page: Number(page),
            limit: Number(limit),
            search: search as string,
            faculty: faculty as string,
            course: course as string,
            session: session as string
        });
        
        return res.status(200).json({
            status: true,
            message: 'Students retrieved successfully',
            data: result
        });
    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: error.message || 'Failed to retrieve students',
            error: error.message
        });
    }
};

const getStudentDetailsController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { registrationNo } = req.params;
        
        if (!registrationNo) {
            return res.status(400).json({
                status: false,
                message: 'Registration number is required'
            });
        }
        
        const student = await adminService.getStudentDetails(registrationNo);
        
        return res.status(200).json({
            status: true,
            message: 'Student details retrieved successfully',
            data: student
        });
    } catch (error: any) {
        return res.status(404).json({
            status: false,
            message: error.message || 'Failed to retrieve student details',
            error: error.message
        });
    }
};

const getAdminDashboardController = async (req: Request, res: Response): Promise<Response> => {
    try {
        const dashboardData = await adminService.getDashboardData();
        
        return res.status(200).json({
            status: true,
            message: 'Admin dashboard data retrieved successfully',
            data: dashboardData
        });
    } catch (error: any) {
        return res.status(400).json({
            status: false,
            message: error.message || 'Failed to retrieve dashboard data',
            error: error.message
        });
    }
};

export default {
    listAllStudentsController,
    getStudentDetailsController,
    getAdminDashboardController
};
